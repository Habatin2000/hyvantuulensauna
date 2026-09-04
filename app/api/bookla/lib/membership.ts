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
  const { companyId, apiKey } = getBooklaConfig();
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

  // Among all currently-active contracts pick the one with the latest
  // expiresAt (a contract without expiry outranks any dated one).
  let activeContract: BooklaContract | null = null;
  for (const contract of contractList as BooklaContract[]) {
    const status = String(contract.status ?? '').toLowerCase();
    const activeFrom = contract.activeFrom ? new Date(contract.activeFrom) : null;
    const expiresAt = contract.expiresAt ? new Date(contract.expiresAt) : null;

    const isActive =
      status === 'active' &&
      (!activeFrom || activeFrom <= now) &&
      (!expiresAt || expiresAt >= now);
    if (!isActive) continue;

    if (!activeContract) {
      activeContract = contract;
      continue;
    }
    const bestExpiry = activeContract.expiresAt
      ? new Date(activeContract.expiresAt).getTime()
      : Number.POSITIVE_INFINITY;
    const thisExpiry = expiresAt ? expiresAt.getTime() : Number.POSITIVE_INFINITY;
    if (thisExpiry > bestExpiry) {
      activeContract = contract;
    }
  }

  if (!activeContract) {
    console.log('[MEMBERSHIP] No active contract');
    return null;
  }

  console.log('[MEMBERSHIP] Active contract found:', activeContract.id);

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

      let granted = 0;
      let consumed = 0;
      let sawAmount = false;
      for (const entry of entries) {
        const amount = Number(entry?.amount);
        if (!Number.isFinite(amount)) continue;
        sawAmount = true;
        if (amount > 0) granted += amount;
        else consumed += -amount;
      }

      if (sawAmount) {
        totalLimit = granted;
        usedCount = consumed;
        remainingUses = Math.max(0, granted - consumed);
        console.log('[MEMBERSHIP] Ledger balance:', { granted, consumed, remainingUses });
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

  // Step 5: Fetch subscription name
  let subscriptionName = 'Kanta-asiakkuus';
  if (activeContract.subscriptionID) {
    try {
      const subResponse = await booklaFetch(
        `/companies/${companyId}/plugins/subscription/subscriptions/${activeContract.subscriptionID}`,
        { method: 'GET' }
      );
      if (subResponse.ok) {
        const subData = await subResponse.json();
        subscriptionName = subData.name || subscriptionName;
        console.log('[MEMBERSHIP] Subscription name:', subscriptionName);
      }
    } catch (e) {
      console.log('[MEMBERSHIP] Error fetching subscription name:', e instanceof Error ? e.message : e);
    }
  }

  // Calculate canUseSubscription based on available data
  const canUseSubscription = isUnlimited || (remainingUses !== null && remainingUses > 0);

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
    expiresAt: activeContract.expiresAt || null,
  };
}
