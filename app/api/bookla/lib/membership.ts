/**
 * Shared server-side membership lookup for the public-sauna flow.
 *
 * Used by:
 * - app/api/bookla/membership/route.ts (UX status lookup — strips sensitive fields)
 * - app/api/bookla/booking/route.ts (applies the contract code server-side)
 *
 * SECURITY: the returned `code` authorizes free bookings. It must never be
 * sent to the client or written to logs.
 *
 * Usage counters come from the visits-ledger, a signed journal (verified
 * against real Bookla data, Sep 2026): remaining = Σ amount, where
 * ALLOCATION entries are positive grants and USAGE entries are negative.
 * This correctly handles manual allocations and rollovers. When the ledger
 * is unavailable, falls back to limitations.bookingsCount − usages.length
 * (which ignores allocations/rollovers).
 */
import { booklaFetch, getBooklaConfig } from './bookla-fetch';
import { authenticateClient, validateClientCode } from './booking';

// Public-sauna service context used for the authoritative validate call.
const PUBLIC_SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const PUBLIC_TICKET_ID = '74ef0b6e-c3d2-4da2-aecc-cd8d0b1a09ee';

// Minimal shapes for the Bookla fields actually accessed below.
interface BooklaClient {
  id?: string;
  email?: string;
}

interface BooklaContract {
  id?: string;
  code?: string;
  status?: string;
  activeFrom?: string;
  expiresAt?: string;
  subscriptionID?: string;
  duration?: string;
  limitations?: {
    bookingsCount?: number | string | null;
  };
  usages?: unknown[] | null;
}

export interface ActiveMembership {
  /** Subscription contract code — NEVER return to the client or log it. */
  code?: string;
  contractId?: string;
  subscriptionId?: string;
  subscriptionName: string;
  remainingUses: number | null;
  totalLimit: number | null;
  usedCount: number | null;
  isUnlimited: boolean;
  canUseSubscription: boolean;
  expiresAt: string | null;
}

/**
 * Finds the client's currently active subscription contract and resolves its
 * usage counters. Returns null when there is no client or no active contract.
 * Never throws on Bookla errors — callers fall back to a paid booking.
 */
export async function findActiveMembership(email: string): Promise<ActiveMembership | null> {
  const { companyId, apiKey, baseUrl } = getBooklaConfig();
  if (!companyId || !apiKey) {
    throw new Error('Missing Bookla configuration');
  }

  const normalizedEmail = email.trim().toLowerCase();
  console.log('[MEMBERSHIP] Checking membership');

  // Step 1: Find client by email. Duplicate Bookla clients can exist for the
  // same address (created before email normalization) — collect ALL matches,
  // a contractless duplicate must not shadow the record holding the contract.
  const clientResponse = await booklaFetch(
    `/companies/${companyId}/clients/search?email=${encodeURIComponent(normalizedEmail)}`,
    { method: 'GET' }
  );

  if (!clientResponse.ok) {
    console.log('[MEMBERSHIP] Client search failed:', clientResponse.status);
    return null;
  }

  const clientData = await clientResponse.json();
  // Response can be {clients: [...]} or just an array
  const clientsArray = clientData.clients || clientData;
  const clients = Array.isArray(clientsArray) ? clientsArray : [];

  const matchingClientIds = clients
    .filter((c: BooklaClient) => String(c.email ?? '').toLowerCase() === normalizedEmail)
    .map((c: BooklaClient) => c.id)
    .filter((id): id is string => Boolean(id));

  if (matchingClientIds.length === 0) {
    console.log('[MEMBERSHIP] No client found');
    return null;
  }

  console.log('[MEMBERSHIP] Clients found:', matchingClientIds.length);

  // Step 2: Search active subscription contracts across all matching clients
  // in one call (clientIDs is a list). Common case is a single client.
  const contractsResponse = await booklaFetch(
    `/companies/${companyId}/plugins/subscription/contracts/search`,
    {
      method: 'POST',
      body: JSON.stringify({
        clientIDs: matchingClientIds,
        status: 'active',
      }),
    }
  );

  if (!contractsResponse.ok) {
    console.log('[MEMBERSHIP] Contracts search failed:', contractsResponse.status);
    return null;
  }

  const contractsData = await contractsResponse.json();

  // Response can be {items: [...]} or just an array
  const contracts = contractsData.items || contractsData || [];
  const contractList = Array.isArray(contracts) ? contracts : [];
  const now = new Date();

  // Candidates: currently-active contracts, best (latest expiry) first.
  // NOTE: expiry may derive from activeFrom + subscription duration when
  // expiresAt is null, so a candidate can still turn out expired later in
  // this function — hence we try each candidate in turn instead of picking
  // one upfront (Teija regression: expired 30x card shadowed a valid card).
  const expiryTs = (c: BooklaContract) =>
    c.expiresAt ? new Date(c.expiresAt).getTime() : Number.POSITIVE_INFINITY;

  const candidates = (contractList as BooklaContract[])
    .filter((contract) => {
      const status = String(contract.status ?? '').toLowerCase();
      const activeFrom = contract.activeFrom ? new Date(contract.activeFrom) : null;
      const expiresAt = contract.expiresAt ? new Date(contract.expiresAt) : null;
      return (
        status === 'active' &&
        (!activeFrom || activeFrom <= now) &&
        (!expiresAt || expiresAt >= now)
      );
    })
    .sort((a, b) => expiryTs(b) - expiryTs(a));

  if (candidates.length === 0) {
    console.log('[MEMBERSHIP] No active contract');
    return null;
  }

  for (const activeContract of candidates) {
  console.log('[MEMBERSHIP] Trying contract:', activeContract.id);

  // Step 3: Fetch detailed contract info using the documented plugins endpoint
  let contractDetails: BooklaContract = activeContract;

  try {
    const res = await booklaFetch(
      `/companies/${companyId}/plugins/subscription/contracts/${activeContract.id}`,
      { method: 'GET' }
    );

    if (res.ok) {
      contractDetails = await res.json();
      console.log('[MEMBERSHIP] Fresh contract loaded');
    } else {
      console.log('[MEMBERSHIP] Contract fetch failed:', res.status);
      // Fall back to activeContract from search
    }
  } catch (e) {
    console.log('[MEMBERSHIP] Contract refresh threw error, using search result:', e instanceof Error ? e.message : e);
  }

  // Step 4: Resolve usage counters. Primary source: the visits-ledger, which
  // is a signed journal — verified against real Bookla data (Sep 2026):
  //   {"transactionType":"ALLOCATION","amount":5}   — initial grant
  //   {"transactionType":"ALLOCATION","amount":5}   — manual admin allocation
  //   {"transactionType":"USAGE","amount":-1,...}   — one per redeemed booking
  // So remaining = Σ amount, which correctly handles manual allocations,
  // rollovers and reversal entries. totalLimit = Σ positive amounts (all
  // grants), usedCount = Σ |negative amounts| (all consumptions).
  const bookingsCountRaw = contractDetails?.limitations?.bookingsCount ?? null;

  const parsedBookingsCount =
    typeof bookingsCountRaw === 'number'
      ? bookingsCountRaw
      : bookingsCountRaw !== null && bookingsCountRaw !== undefined && bookingsCountRaw !== ''
        ? Number(bookingsCountRaw)
        : null;

  const bookingsCount = Number.isFinite(parsedBookingsCount as number) ? (parsedBookingsCount as number) : null;

  let totalLimit: number | null = null;
  let usedCount: number | null = null;
  let remainingUses: number | null = null;

  try {
    const ledgerRes = await booklaFetch(
      `/companies/${companyId}/plugins/subscription/contracts/${activeContract.id}/visits-ledger`,
      { method: 'GET' }
    );

    if (ledgerRes.ok) {
      const ledgerData = await ledgerRes.json();
      const entries = Array.isArray(ledgerData) ? ledgerData : ledgerData.items || [];

      // Skip entries whose allocation has expired — Bookla treats expired
      // balances as 0 (verified against admin: expired card showed 0 while a
      // naive ledger sum showed 1). Entries without expiresAt never expire.
      const now = new Date();
      let granted = 0;
      let consumed = 0;
      let sawAmount = false;
      let expiredBalance = 0;
      for (const entry of entries) {
        const amount = Number(entry?.amount);
        if (!Number.isFinite(amount)) continue;
        const expired = entry?.expiresAt && new Date(entry.expiresAt) < now;
        if (expired) {
          expiredBalance += amount;
          continue;
        }
        sawAmount = true;
        if (amount > 0) granted += amount;
        else consumed += -amount;
      }

      if (sawAmount || expiredBalance !== 0) {
        totalLimit = granted;
        usedCount = consumed;
        remainingUses = Math.max(0, granted - consumed);
        console.log('[MEMBERSHIP] Ledger balance:', { granted, consumed, remainingUses, expiredBalance });
      }
    } else {
      console.log('[MEMBERSHIP] Ledger fetch failed:', ledgerRes.status);
    }
  } catch (e) {
    console.log('[MEMBERSHIP] Ledger fetch threw:', e instanceof Error ? e.message : e);
  }

  // Fallback when the ledger is unavailable or empty: quota minus usages[].
  // usages[] has one entry per consumed booking. Bookla is a Go API: a fresh
  // contract with zero usages serializes its nil slice as `"usages": null`,
  // which means 0 used — not "unknown". Only a wholly absent field is unknown.
  // NOTE: this fallback ignores manual allocations and rollovers.
  if (remainingUses === null) {
    totalLimit = bookingsCount;
    const usages = contractDetails?.usages;
    usedCount = Array.isArray(usages) ? usages.length : usages === null ? 0 : null;
    remainingUses =
      totalLimit !== null && usedCount !== null
        ? Math.max(0, totalLimit - usedCount)
        : null;
    console.log('[MEMBERSHIP] Using usages[] fallback:', { totalLimit, usedCount, remainingUses });
  }

  // Unlimited if Bookla uses null/0/-1 for unlimited (based on the quota field)
  const isUnlimited = bookingsCount === null || bookingsCount === 0 || bookingsCount === -1;

  // Step 5: Fetch subscription product (name + duration). NOTE: the correct
  // endpoint is /plugins/subscription/list/{id} — the old /subscriptions/{id}
  // path 404s silently. Duration matters: contracts with no expiresAt expire
  // at activeFrom + duration (e.g. "30x kortti" P30D), and Bookla rejects
  // redemptions after that even though contract.expiresAt is null.
  let subscriptionName = 'Kanta-asiakkuus';
  let subscriptionDuration: string | null = null;
  if (activeContract.subscriptionID) {
    try {
      const subResponse = await booklaFetch(
        `/companies/${companyId}/plugins/subscription/list/${activeContract.subscriptionID}`,
        { method: 'GET' }
      );
      if (subResponse.ok) {
        const subData = await subResponse.json();
        subscriptionName = subData.title || subData.name || subscriptionName;
        subscriptionDuration = typeof subData.duration === 'string' ? subData.duration : null;
        console.log('[MEMBERSHIP] Subscription:', subscriptionName, subscriptionDuration);
      }
    } catch (e) {
      console.log('[MEMBERSHIP] Error fetching subscription product:', e instanceof Error ? e.message : e);
    }
  }

  // Effective expiry: explicit expiresAt wins; otherwise activeFrom +
  // duration — the CONTRACT's own duration field first (admins can extend a
  // single contract this way), then the subscription product's duration.
  let effectiveExpiresAt = activeContract.expiresAt || null;
  const contractDuration = contractDetails?.duration || subscriptionDuration;
  if (!effectiveExpiresAt && activeContract.activeFrom && contractDuration) {
    const days = parseISODurationDays(contractDuration);
    if (days !== null) {
      const from = new Date(activeContract.activeFrom);
      effectiveExpiresAt = new Date(from.getTime() + days * 86400000).toISOString();
    }
  }
  if (effectiveExpiresAt && new Date(effectiveExpiresAt) < now) {
    console.log('[MEMBERSHIP] Contract expired (derived expiry), trying next candidate:', effectiveExpiresAt);
    continue;
  }

  // Authoritative counter from Bookla's redemption engine: codes/validate's
  // pluginResponse carries visitsRemaining/visitsTotal — the numbers the
  // booking engine actually enforces. The ledger is incomplete for older
  // contracts (Teija: ledger granted 7 vs 23 real usages) and disagrees with
  // usages[] on multi-seat bookings, so when validate can run, its numbers
  // win. Falls back to the ledger-derived numbers when validate can't run
  // (no upcoming slots, network failure, etc.).
  let canUseSubscription = isUnlimited || (remainingUses !== null && remainingUses > 0);
  if (activeContract.code && PUBLIC_SERVICE_ID && apiKey) {
    try {
      const auth = await authenticateClient({
        baseUrl,
        apiKey,
        companyId: companyId!,
        email: normalizedEmail,
        firstName: 'Membership',
        lastName: 'Check',
      });
      const timesRes = await booklaFetch(
        `/companies/${companyId}/services/${PUBLIC_SERVICE_ID}/times`,
        {
          method: 'POST',
          body: JSON.stringify({
            from: new Date().toISOString(),
            to: new Date(Date.now() + 14 * 86400000).toISOString(),
            tickets: { [PUBLIC_TICKET_ID]: 1 },
          }),
        },
        apiKey
      );
      if (timesRes.ok) {
        const timesData = await timesRes.json();
        const times = timesData.times || {};
        let slot: { startTime: string; resourceId: string; duration?: string } | null = null;
        for (const rid of Object.keys(times)) {
          const first = (times[rid] || [])[0];
          if (first?.startTime) {
            slot = { startTime: first.startTime, resourceId: rid, duration: first.duration };
            break;
          }
        }
        if (slot) {
          const validation = await validateClientCode({
            baseUrl,
            accessToken: auth.accessToken,
            code: activeContract.code,
            companyId: companyId!,
            serviceId: PUBLIC_SERVICE_ID,
            resourceId: slot.resourceId,
            startTime: slot.startTime,
            duration: slot.duration || 'PT2H',
            spots: 1,
            tickets: { [PUBLIC_TICKET_ID]: 1 },
          });
          if (validation) {
            console.log('[MEMBERSHIP] Authoritative validate numbers:', {
              canApply: validation.canApply,
              visitsRemaining: validation.visitsRemaining,
              visitsTotal: validation.visitsTotal,
            });
            canUseSubscription = validation.canApply;
            if (!isUnlimited && typeof validation.visitsRemaining === 'number') {
              remainingUses = validation.visitsRemaining;
              if (typeof validation.visitsTotal === 'number') {
                totalLimit = validation.visitsTotal;
                usedCount = validation.visitsTotal - validation.visitsRemaining;
              }
            }
          }
        } else {
          console.log('[MEMBERSHIP] No upcoming slot for validate — using ledger numbers');
        }
      }
    } catch (e) {
      console.log('[MEMBERSHIP] Validate-based counter failed, using ledger numbers:', e instanceof Error ? e.message : e);
    }
  }

  console.log('[MEMBERSHIP] Final usage calculation:', {
    totalLimit,
    isUnlimited,
    usedCount,
    remainingUses,
    canUseSubscription,
  });

  return {
    code: activeContract.code,
    contractId: activeContract.id,
    subscriptionId: activeContract.subscriptionID,
    subscriptionName,
    remainingUses: isUnlimited ? null : remainingUses,
    totalLimit: isUnlimited ? null : totalLimit,
    usedCount,
    isUnlimited,
    canUseSubscription,
    expiresAt: effectiveExpiresAt,
  };
  } // end for candidates

  console.log('[MEMBERSHIP] No usable contract (all candidates expired or invalid)');
  return null;
}

/** Minimal ISO-8601 duration parser for Bookla (P30D, P180D, P239DT21H57M…). */
function parseISODurationDays(duration: string): number | null {
  const m = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(duration);
  if (!m) return null;
  const years = Number(m[1] || 0);
  const months = Number(m[2] || 0);
  const days = Number(m[3] || 0);
  const hours = Number(m[4] || 0) + Number(m[5] || 0) / 60;
  if (!years && !months && !days && !hours) return null;
  return years * 365 + months * 30 + days + hours / 24;
}
