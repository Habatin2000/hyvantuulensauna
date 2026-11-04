import { NextRequest, NextResponse } from 'next/server';

/**
 * Bookla → Google offline conversion webhook.
 *
 * Bookla POSTs booking events here (configured in the Bookla dashboard).
 * When a booking reaches a confirmed/paid state, we fire:
 *   1. a GA4 `purchase` event via the Measurement Protocol (deduped against
 *      any client-side event by transaction_id), and
 *   2. the Google Ads conversion to AW-17838327897 with the real value —
 *      only ever for actually paid bookings, so bidding optimizes on
 *      revenue, not on booking intent.
 *
 * Attribution chain: the booking flow stored gclid + GA4 client id + item
 * name + value in the booking's Bookla metaData; the webhook payload echoes
 * them back. No server-side storage needed.
 *
 * Setup:
 *   - BOOKLA_WEBHOOK_SECRET (optional but recommended): shared key in ?key=
 *   - GA4_API_SECRET: GA4 → Admin → Data streams → Web → Measurement Protocol
 */

const GA4_ID = 'G-2LE9R6N8P5';
const SITE_URL = 'https://www.hyvantuulensauna.fi';

const PAID_STATUSES = new Set([
  'confirmed',
  'paid',
  'succeeded',
  'success',
  'completed',
  'approved',
]);
const FAILED_STATUSES = new Set([
  'cancelled',
  'canceled',
  'failed',
  'refunded',
  'declined',
  'expired',
  'rejected',
  'unpaid',
  'pending',
]);

interface NormalizedEvent {
  bookingId: string;
  status: string;
  paymentStatus: string;
  metaData: Record<string, unknown>;
  payloadPrice: number | null; // euros, if the payload carries one
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : v != null ? String(v) : '';
}

/** Bookla's webhook payload shape isn't in the public spec — extract defensively. */
function normalize(payload: Record<string, unknown>): NormalizedEvent {
  const booking =
    payload.booking && typeof payload.booking === 'object'
      ? (payload.booking as Record<string, unknown>)
      : payload;
  const payment =
    booking.payment && typeof booking.payment === 'object'
      ? (booking.payment as Record<string, unknown>)
      : null;

  const meta =
    (booking.metaData as Record<string, unknown>) ??
    (payload.metaData as Record<string, unknown>) ??
    {};

  let payloadPrice: number | null = null;
  for (const key of ['price', 'total', 'totalPrice', 'amount', 'value']) {
    const raw = booking[key] ?? payload[key];
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) {
      // Bookla prices are cents; amounts < 1000 treated as euros are unusual
      // for this business, so assume cents when the number looks like cents.
      payloadPrice = n >= 1000 ? n / 100 : n;
      break;
    }
  }

  return {
    bookingId: str(booking.id ?? booking.bookingID ?? payload.bookingId ?? payload.id),
    status: str(booking.status ?? payload.status ?? payload.event ?? '').toLowerCase(),
    paymentStatus: str(
      booking.paymentStatus ?? payload.paymentStatus ?? payment?.status ?? ''
    ).toLowerCase(),
    metaData: meta,
    payloadPrice,
  };
}

async function sendConversion(evt: NormalizedEvent): Promise<void> {
  const apiSecret = process.env.GA4_API_SECRET;
  if (!apiSecret) {
    console.log('[BOOKLA-WEBHOOK] GA4_API_SECRET not set — conversion skipped for', evt.bookingId);
    return;
  }

  const meta = evt.metaData;
  const valueFromMeta = Number(meta.anvalue);
  const value = Number.isFinite(valueFromMeta) && valueFromMeta > 0 ? valueFromMeta : (evt.payloadPrice ?? 0);
  const itemName = str(meta.anitem) || 'Varaus';
  const gclid = str(meta.gclid) || undefined;
  const clientId = str(meta.gacid) || `bookla_${evt.bookingId}`;

  const eventParams: Record<string, unknown> = {
    transaction_id: evt.bookingId,
    value,
    currency: 'EUR',
    items: [
      {
        item_id: itemName,
        item_name: itemName,
        price: value,
        quantity: 1,
      },
    ],
    page_title: 'Kiitos varauksestasi',
    page_location: `${SITE_URL}/kiitos${gclid ? `?gclid=${encodeURIComponent(gclid)}` : ''}`,
  };

  const res = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_ID}&api_secret=${apiSecret}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        events: [{ name: 'purchase', params: eventParams }],
      }),
    }
  );

  if (!res.ok) {
    console.error('[BOOKLA-WEBHOOK] GA4 MP failed:', res.status, await res.text().catch(() => ''));
    return;
  }

  // The Google Ads side picks this up through the linked GA4 property
  // (purchase must be marked as a key event and imported in Google Ads —
  // see setup instructions). No separate Ads API call is made here.
  console.log('[BOOKLA-WEBHOOK] Conversion sent:', {
    bookingId: evt.bookingId,
    status: evt.status,
    paymentStatus: evt.paymentStatus,
    value,
    itemName,
    hasGclid: Boolean(gclid),
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.BOOKLA_WEBHOOK_SECRET;
  const key = request.nextUrl.searchParams.get('key');
  if (secret && key !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ received: false, error: 'invalid json' }, { status: 400 });
  }

  // Always log the raw payload first — Bookla's exact webhook shape is
  // confirmed in production via these logs.
  console.log('[BOOKLA-WEBHOOK] payload:', JSON.stringify(payload).slice(0, 3000));

  const evt = normalize(payload);

  if (!evt.bookingId) {
    return NextResponse.json({ received: true, ignored: 'no-booking-id' });
  }

  const failed =
    FAILED_STATUSES.has(evt.status) || FAILED_STATUSES.has(evt.paymentStatus);
  const paid =
    PAID_STATUSES.has(evt.status) || PAID_STATUSES.has(evt.paymentStatus);

  if (failed || !paid) {
    return NextResponse.json({
      received: true,
      ignored: `status=${evt.status || 'unknown'}/${evt.paymentStatus || 'unknown'}`,
    });
  }

  try {
    await sendConversion(evt);
  } catch (err) {
    console.error('[BOOKLA-WEBHOOK] sendConversion error:', err);
  }

  return NextResponse.json({ received: true, converted: evt.bookingId });
}

// Bookla dashboards often send a GET probe when saving the webhook URL.
export async function GET() {
  return NextResponse.json({ ok: true, service: 'hyvantuulensauna-webhook' });
}
