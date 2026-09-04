/**
 * TEMPORARY localhost-only diagnostic. DO NOT DEPLOY.
 * DELETE THIS FILE BEFORE COMMITTING.
 *
 * GET /api/debug-validate?email=...&startTime=...
 * Runs the exact booking-time eligibility path (membership lookup → client
 * auth → codes/validate) without creating any booking.
 */
import { NextRequest, NextResponse } from 'next/server';
import { findActiveMembership } from '../bookla/lib/membership';
import { authenticateClient, validateClientCode } from '../bookla/lib/booking';

const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const RESOURCE_ID = process.env.BOOKLA_PUBLIC_RESOURCE_ID;

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const email = request.nextUrl.searchParams.get('email');
  const startTime = request.nextUrl.searchParams.get('startTime');
  if (!email || !startTime) {
    return NextResponse.json({ error: 'email and startTime required' }, { status: 400 });
  }

  const membership = await findActiveMembership(email);
  if (!membership) {
    return NextResponse.json({ membership: null });
  }

  const auth = await authenticateClient({
    baseUrl: process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1',
    apiKey: process.env.BOOKLA_BOOKING_API_KEY || process.env.BOOKLA_API_KEY || '',
    companyId: process.env.BOOKLA_COMPANY_ID || '',
    email,
    firstName: 'Debug',
    lastName: 'Check',
  });

  const canApply = await validateClientCode({
    baseUrl: process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1',
    accessToken: auth.accessToken,
    code: membership.code || '',
    companyId: process.env.BOOKLA_COMPANY_ID || '',
    serviceId: SERVICE_ID || '',
    resourceId: RESOURCE_ID || '',
    startTime,
    duration: 'PT2H',
    spots: 1,
    tickets: { '74ef0b6e-c3d2-4da2-aecc-cd8d0b1a09ee': 1 },
  });

  return NextResponse.json({
    membership: {
      contractId: membership.contractId,
      remainingUses: membership.remainingUses,
      totalLimit: membership.totalLimit,
      canUseSubscription: membership.canUseSubscription,
      expiresAt: membership.expiresAt,
    },
    canApply,
  });
}
