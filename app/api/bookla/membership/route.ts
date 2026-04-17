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
    // Response can be {clients: [...]} or just an array
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
    console.log('[MEMBERSHIP] Contracts data:', JSON.stringify(contractsData).slice(0, 1000));
    
    // Response can be {items: [...]} or just an array
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

    // Step 3: Fetch detailed contract info using the documented plugins endpoint
    let contractDetails: any = activeContract;

    try {
      const contractUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/plugins/subscription/contracts/${activeContract.id}`;
      console.log('[MEMBERSHIP] Fetching fresh contract:', contractUrl);

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
      } else {
        const errorText = await res.text();
        console.log('[MEMBERSHIP] Contract fetch failed:', res.status, errorText.slice(0, 500));
        // Fall back to activeContract from search
      }
    } catch (e) {
      console.log('[MEMBERSHIP] Contract refresh threw error, using search result:', e);
    }

    // Step 4: Calculate remaining uses
    const limitations = contractDetails?.limitations || {};
    console.log('[MEMBERSHIP] Full limitations object:', JSON.stringify(limitations));

    const totalLimitRaw =
      contractDetails?.totalLimit ??
      limitations?.count ??
      limitations?.bookingsCount ??
      null;

    const parsedTotalLimit =
      typeof totalLimitRaw === 'number'
        ? totalLimitRaw
        : totalLimitRaw !== null && totalLimitRaw !== undefined && totalLimitRaw !== ''
          ? Number(totalLimitRaw)
          : null;

    const totalLimit = Number.isFinite(parsedTotalLimit as number) ? (parsedTotalLimit as number) : null;

    // Unlimited if Bookla uses null/0/-1 for unlimited
    const isUnlimited = totalLimit === null || totalLimit === 0 || totalLimit === -1;

    // Get direct count fields (may not exist)
    const directRemainingCount = limitations?.remainingCount ?? limitations?.remaining ?? contractDetails?.remainingCount ?? contractDetails?.remaining;
    const directUsedCount = limitations?.usedCount ?? limitations?.used ?? contractDetails?.usedCount ?? contractDetails?.used ?? contractDetails?.bookingsUsed;

    console.log('[MEMBERSHIP] Direct count fields:', { 
      directRemainingCount, 
      directUsedCount,
      limitationsKeys: Object.keys(limitations),
    });

    // Step 5: Fetch visits-ledger and parse with Bookla semantics
    let usedCount: number | null = null;
    let remainingUses: number | null = null;
    let ledgerParseConfidence: 'high' | 'medium' | 'low' | 'unknown' = 'unknown';

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
        
        // Log full entry details for debugging
        entries.forEach((entry: any, i: number) => {
          console.log(`[MEMBERSHIP] Ledger[${i}]:`, {
            id: entry.id,
            transactionType: entry.transactionType,
            amount: entry.amount,
            usageID: entry.usageID,
            createdAt: entry.createdAt,
            balance: entry.balance,
            remainingVisits: entry.remainingVisits,
          });
        });

        // STRATEGY 1: Look for explicit balance/remainingVisits fields
        const entryWithBalance = entries.find((e: any) => 
          typeof e.balance === 'number' || typeof e.remainingVisits === 'number'
        );
        
        if (entryWithBalance) {
          // Use the most recent entry's balance
          const latestEntry = entries[entries.length - 1];
          const currentBalance = latestEntry.remainingVisits ?? latestEntry.balance ?? null;
          
          if (typeof currentBalance === 'number' && totalLimit !== null) {
            remainingUses = Math.max(0, currentBalance);
            usedCount = Math.max(0, totalLimit - remainingUses);
            ledgerParseConfidence = 'high';
            console.log('[MEMBERSHIP] Using ledger balance field:', {
              remainingUses,
              usedCount,
              source: latestEntry.remainingVisits !== undefined ? 'remainingVisits' : 'balance',
            });
          }
        }
        
        // STRATEGY 2: Parse by transactionType if no balance field
        if (remainingUses === null && entries.length > 0) {
          const CONSUMPTION_TYPES = ['usage', 'consume', 'visit', 'booking', 'debit'];
          const CREDIT_TYPES = ['credit', 'topup', 'rollover', 'bonus', 'refund', 'reset', 'allocation'];
          
          let consumptionSum = 0;
          let creditSum = 0;
          let unknownTransactions: any[] = [];
          
          for (const entry of entries) {
            const txType = String(entry.transactionType || '').toLowerCase();
            const amount = Number(entry.amount ?? 0);
            const hasUsageId = Boolean(entry.usageID);
            
            if (!Number.isFinite(amount)) continue;
            
            if (CONSUMPTION_TYPES.some(t => txType.includes(t)) || hasUsageId) {
              // Consumption reduces remaining visits
              consumptionSum += Math.abs(amount);
            } else if (CREDIT_TYPES.some(t => txType.includes(t))) {
              // Credits add to available visits
              creditSum += Math.abs(amount);
            } else if (txType === '') {
              // Empty transaction type - check for usageID as hint
              if (hasUsageId) {
                consumptionSum += Math.abs(amount);
              } else {
                unknownTransactions.push(entry);
              }
            } else {
              unknownTransactions.push(entry);
            }
          }
          
          if (unknownTransactions.length === 0 && totalLimit !== null) {
            // All transactions understood - calculate with confidence
            const netUsed = Math.max(0, consumptionSum - creditSum);
            usedCount = netUsed;
            remainingUses = Math.max(0, totalLimit - netUsed);
            ledgerParseConfidence = 'medium';
            console.log('[MEMBERSHIP] Calculated from transaction types:', {
              consumptionSum,
              creditSum,
              netUsed,
              remainingUses,
            });
          } else if (unknownTransactions.length > 0) {
            // Unknown transactions present - don't guess
            console.log('[MEMBERSHIP] Unknown ledger transactions:', unknownTransactions);
            ledgerParseConfidence = 'low';
          }
        }
        
        // STRATEGY 3: Fallback to usage-only counting
        if (remainingUses === null && entries.length > 0) {
          const usageEntries = entries.filter((e: any) => 
            Boolean(e.usageID) || 
            String(e.transactionType || '').toLowerCase().includes('usage')
          );
          
          if (usageEntries.length > 0) {
            let usageSum = 0;
            for (const entry of usageEntries) {
              const amount = Number(entry.amount ?? 1); // Default to 1 if no amount
              if (Number.isFinite(amount)) {
                usageSum += Math.abs(amount);
              }
            }
            
            if (totalLimit !== null) {
              usedCount = usageSum;
              remainingUses = Math.max(0, totalLimit - usageSum);
              ledgerParseConfidence = 'medium';
              console.log('[MEMBERSHIP] Calculated from usage entries only:', {
                usageEntries: usageEntries.length,
                usageSum,
                remainingUses,
              });
            }
          }
        }
        
        // If still no values, mark as unknown
        if (remainingUses === null) {
          ledgerParseConfidence = 'unknown';
        }
      } else {
        console.log('[MEMBERSHIP] Failed to fetch visits ledger:', visitsRes.status);
      }
    } catch (e) {
      console.log('[MEMBERSHIP] Error fetching visits ledger:', e);
    }

    // Final calculation with priority: direct fields > ledger > fallback
    if (typeof directRemainingCount === 'number' && Number.isFinite(directRemainingCount)) {
      remainingUses = directRemainingCount;
      if (totalLimit !== null) {
        usedCount = totalLimit - directRemainingCount;
      }
      console.log('[MEMBERSHIP] Using direct remainingCount:', remainingUses);
    } else if (typeof directUsedCount === 'number' && Number.isFinite(directUsedCount) && totalLimit !== null) {
      usedCount = directUsedCount;
      remainingUses = Math.max(0, totalLimit - directUsedCount);
      console.log('[MEMBERSHIP] Using direct usedCount:', usedCount);
    } else if (remainingUses === null) {
      // Ledger couldn't parse - leave as null for safe fallback
      console.log('[MEMBERSHIP] Could not determine usage from ledger, leaving null');
    }
    
    // Safety: never allow used > totalLimit unless explicitly documented
    if (usedCount !== null && totalLimit !== null && usedCount > totalLimit) {
      console.log('[MEMBERSHIP] Warning: usedCount > totalLimit, this may indicate rollover/credits not accounted for', {
        usedCount,
        totalLimit,
        ledgerParseConfidence,
      });
      // Keep the values but flag for investigation
    }

    // Step 5: Fetch subscription name
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

    // Calculate canUseSubscription based on available data
    const canUseSubscription = isUnlimited || (remainingUses !== null && remainingUses > 0);
    
    console.log('[MEMBERSHIP] Final usage calculation:', {
      totalLimit,
      isUnlimited,
      usedCount,
      remainingUses,
      canUseSubscription,
      ledgerParseConfidence,
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
      // Debug info for troubleshooting
      _ledgerParseConfidence: ledgerParseConfidence,
    });

  } catch (error) {
    console.error('[MEMBERSHIP] Error:', error);
    return NextResponse.json(
      { isMember: false, error: 'Membership check failed' },
      { status: 500 }
    );
  }
}
