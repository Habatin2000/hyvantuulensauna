import { NextRequest, NextResponse } from 'next/server';
import { getBooklaConfig } from '../lib/bookla-fetch';
import { findActiveMembership } from '../lib/membership';

export async function POST(request: NextRequest) {
  const { companyId, apiKey } = getBooklaConfig();
  if (!companyId || !apiKey) {
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

    const membership = await findActiveMembership(email);

    if (!membership) {
      return NextResponse.json({ isMember: false });
    }

    // Never return the subscription code or clientId here — the code
    // authorizes free bookings and is only applied server-side by the
    // booking route (see app/api/bookla/lib/membership.ts). The contractId
    // is inert without API credentials and is returned for cross-referencing
    // with the Bookla admin.
    return NextResponse.json({
      isMember: true,
      contractId: membership.contractId,
      subscriptionId: membership.subscriptionId,
      subscriptionName: membership.subscriptionName,
      remainingUses: membership.remainingUses,
      totalLimit: membership.totalLimit,
      usedCount: membership.usedCount,
      isUnlimited: membership.isUnlimited,
      canUseSubscription: membership.canUseSubscription,
      expiresAt: membership.expiresAt,
    });

  } catch (error) {
    console.error('[MEMBERSHIP] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { isMember: false, error: 'Membership check failed' },
      { status: 500 }
    );
  }
}
