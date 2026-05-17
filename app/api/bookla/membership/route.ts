import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_API_KEY;

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log('[MEMBERSHIP] Checking membership for:', normalizedEmail);

    // Step 1: Find client by email
    const clientSearchUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/clients/search?email=${encodeURIComponent(normalizedEmail)}`;
    const clientResponse = await fetch(clientSearchUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!clientResponse.ok) {
      const errorText = await clientResponse.text();
      console.log('[MEMBERSHIP] Client search failed:', clientResponse.status, errorText.slice(0, 500));
      return NextResponse.json({ isMember: false });
    }

    const clientData = await clientResponse.json();
    const clientsArray = clientData.clients || clientData;
    const clients = Array.isArray(clientsArray) ? clientsArray : [];

    const matchingClient = clients.find((c: any) =>
      String(c.email ?? '').toLowerCase() === normalizedEmail
    );

    if (!matchingClient) {
      console.log('[MEMBERSHIP] No client found');
      return NextResponse.json({ isMember: false });
    }

    const clientId = matchingClient.id;
    console.log('[MEMBERSHIP] Using client:', { email: normalizedEmail, clientId });

    // Step 2: Search subscription contracts
    const contractsUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/plugins/subscription/contracts/search`;
    const contractsResponse = await fetch(contractsUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientIDs: [clientId],
        status: 'active',
      }),
    });

    if (!contractsResponse.ok) {
      const errorText = await contractsResponse.text();
      console.log('[MEMBERSHIP] Contracts search failed:', contractsResponse.status, errorText.slice(0, 500));
      return NextResponse.json({ isMember: false, clientId });
    }

    const contractsData = await contractsResponse.json();
    const contracts = contractsData.items || contractsData || [];
    const contractList = Array.isArray(contracts) ? contracts : [];
    const now = new Date();

    // Find active contract
    const activeContract = contractList.find((contract: any) => {
      const status = String(contract.status ?? '').toLowerCase();
      const activeFrom = contract.activeFrom ? new Date(contract.activeFrom) : null;
      const expiresAt = contract.expiresAt ? new Date(contract.expiresAt) : null;

      return status === 'active' &&
        (!activeFrom || activeFrom <= now) &&
        (!expiresAt || expiresAt >= now);
    });

    if (!activeContract) {
      console.log('[MEMBERSHIP] No active contract');
      return NextResponse.json({ isMember: false, clientId });
    }

    console.log('[MEMBERSHIP] Active contract found:', activeContract.id);

    // Step 3: Fetch detailed contract info
    let contractDetails: any = activeContract;
    try {
      const contractUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/plugins/subscription/contracts/${activeContract.id}`;
      const res = await fetch(contractUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        contractDetails = await res.json();
        console.log('[MEMBERSHIP] Fresh contract loaded');
      }
    } catch (e) {
      console.log('[MEMBERSHIP] Contract refresh failed, using search result:', e);
    }

    // Step 4: Calculate remaining uses
    const limitations = contractDetails?.limitations || {};

    const totalLimitRaw =
      contractDetails?.totalLimit ??
      limitations?.count ??
      limitations?.bookingsCount ??
      null;

    const totalLimit =
      typeof totalLimitRaw === 'number' && Number.isFinite(totalLimitRaw)
        ? totalLimitRaw
        : null;

    const isUnlimited = totalLimit === null || totalLimit === 0 || totalLimit === -1;

    // Direct count fields from contract/limitations
    const directRemainingCount =
      limitations?.remainingCount ??
      limitations?.remaining ??
      contractDetails?.remainingCount ??
      contractDetails?.remaining ??
      null;

    const directUsedCount =
      limitations?.usedCount ??
      limitations?.used ??
      contractDetails?.usedCount ??
      contractDetails?.used ??
      contractDetails?.bookingsUsed ??
      null;

    // Step 5: Fetch visits-ledger for remaining uses
    let usedCount: number | null = null;
    let remainingUses: number | null = null;

    try {
      const ledgerUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/plugins/subscription/contracts/${activeContract.id}/visits-ledger`;
      console.log('[MEMBERSHIP] Fetching visits ledger:', ledgerUrl);

      const visitsRes = await fetch(ledgerUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (visitsRes.ok) {
        const ledgerData = await visitsRes.json();
        const entries = Array.isArray(ledgerData) ? ledgerData : ledgerData.items || [];

        console.log('[MEMBERSHIP] Ledger entries count:', entries.length);

        // Strategy 1: Use explicit balance/remainingVisits from the latest entry
        const latestEntry = entries[entries.length - 1];
        if (latestEntry && (typeof latestEntry.remainingVisits === 'number' || typeof latestEntry.balance === 'number')) {
          const currentBalance = latestEntry.remainingVisits ?? latestEntry.balance ?? null;
          if (typeof currentBalance === 'number') {
            remainingUses = Math.max(0, currentBalance);
            if (totalLimit !== null) {
              usedCount = Math.max(0, totalLimit - remainingUses);
            }
            console.log('[MEMBERSHIP] Using ledger balance:', { remainingUses, usedCount });
          }
        }

        // Strategy 2: Sum usage entries if no balance field
        if (remainingUses === null && entries.length > 0 && totalLimit !== null) {
          let usageSum = 0;
          for (const entry of entries) {
            const hasUsageId = Boolean(entry.usageID);
            const txType = String(entry.transactionType || '').toLowerCase();
            const isConsumption = hasUsageId || ['usage', 'consume', 'visit', 'booking', 'debit'].some(t => txType.includes(t));
            if (isConsumption) {
              const amount = Number(entry.amount ?? 1);
              if (Number.isFinite(amount)) {
                usageSum += Math.abs(amount);
              }
            }
          }
          usedCount = usageSum;
          remainingUses = Math.max(0, totalLimit - usageSum);
          console.log('[MEMBERSHIP] Calculated from usage entries:', { usageSum, remainingUses });
        }
      } else {
        console.log('[MEMBERSHIP] Failed to fetch visits ledger:', visitsRes.status);
      }
    } catch (e) {
      console.log('[MEMBERSHIP] Error fetching visits ledger:', e);
    }

    // Final priority: direct fields > ledger > fallback
    if (typeof directRemainingCount === 'number' && Number.isFinite(directRemainingCount)) {
      remainingUses = Math.max(0, directRemainingCount);
      if (totalLimit !== null) {
        usedCount = Math.max(0, totalLimit - directRemainingCount);
      }
      console.log('[MEMBERSHIP] Using direct remainingCount:', remainingUses);
    } else if (typeof directUsedCount === 'number' && Number.isFinite(directUsedCount) && totalLimit !== null) {
      usedCount = directUsedCount;
      remainingUses = Math.max(0, totalLimit - directUsedCount);
      console.log('[MEMBERSHIP] Using direct usedCount:', usedCount);
    }

    // Step 6: Fetch subscription name
    let subscriptionName = 'Kanta-asiakkuus';
    if (activeContract.subscriptionID) {
      try {
        const subscriptionUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/plugins/subscription/subscriptions/${activeContract.subscriptionID}`;
        const subResponse = await fetch(subscriptionUrl, {
          method: 'GET',
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json',
          },
        });
        if (subResponse.ok) {
          const subData = await subResponse.json();
          subscriptionName = subData.name || subscriptionName;
          console.log('[MEMBERSHIP] Subscription name:', subscriptionName);
        }
      } catch (e) {
        console.log('[MEMBERSHIP] Error fetching subscription name:', e);
      }
    }

    // Active membership verification
    const canUseSubscription = isUnlimited || (remainingUses !== null && remainingUses > 0);

    console.log('[MEMBERSHIP] Final usage calculation:', {
      totalLimit,
      isUnlimited,
      usedCount,
      remainingUses,
      canUseSubscription,
    });

    return NextResponse.json({
      isMember: true,
      contractId: activeContract.id,
      subscriptionId: activeContract.subscriptionID,
      subscriptionName,
      code: activeContract.code,
      clientId,
      remainingUses: isUnlimited ? null : remainingUses,
      totalLimit: isUnlimited ? null : totalLimit,
      usedCount,
      isUnlimited,
      canUseSubscription,
      expiresAt: activeContract.expiresAt || null,
    });

  } catch (error) {
    console.error('[MEMBERSHIP] Error:', error);
    return NextResponse.json(
      { isMember: false, error: 'Membership check failed' },
      { status: 500 }
    );
  }
}
