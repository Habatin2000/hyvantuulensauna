import { NextRequest, NextResponse } from 'next/server';

/**
 * Bookla → Google offline conversion webhook.
 *
 * Bookla delivers webhooks via Convoy (x-convoy-signature: t=...,v1=...).
 * Auth accepts EITHER:
 *   - ?key=<BOOKLA_WEBHOOK_SECRET> query param, OR
 *   - a valid Convoy HMAC-SHA256 signature computed with the same secret
 *     (set Bookla's webhook signing secret to the same value in their UI).
 *
 * When a booking reaches a confirmed/paid state, we fire a GA4 `purchase`
 * via the Measurement Protocol (deduped by transaction_id). Google Ads picks
 * it up through the linked GA4 property.
 *
 * Attribution chain: the booking flow stored gclid + GA4 client id + item
 * name + value in the booking's Bookla metaData; the webhook payload echoes
 * them back. No server-side storage needed.
 *
 * Setup:
 *   - BOOKLA_WEBHOOK_SECRET: shared key (?key= or Convoy signing secret)
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

/** Bookla webhook envelope: { id, data: <object>, type, createdAt }. */
function normalize(payload: Record<string, unknown>): NormalizedEvent {
  const booking =
    payload.booking && typeof payload.booking === 'object'
      ? (payload.booking as Record<string, unknown>)
      : payload.data && typeof payload.data === 'object'
        ? (payload.data as Record<string, unknown>)
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
  const sessionId = str(meta.gasid) || undefined;
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
    // Required for the event to count as engaged + attach to the original
    // session (traffic source) instead of a detached one.
    engagement_time_msec: 100,
    ...(sessionId && { session_id: sessionId }),
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
    ga4Status: res.status,
    bookingId: evt.bookingId,
    status: evt.status,
    paymentStatus: evt.paymentStatus,
    value,
    itemName,
    hasGclid: Boolean(gclid),
    hasSession: Boolean(sessionId),
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify a Convoy webhook signature header: "t=<unix>,v1=<hex hmac>".
 * Convoy signs "<timestamp>.<raw body>" with the endpoint secret.
 */
async function verifyConvoySignature(
  header: string,
  rawBody: string,
  secret: string
): Promise<boolean> {
  const parts: Record<string, string> = {};
  for (const kv of header.split(',')) {
    const idx = kv.indexOf('=');
    if (idx > 0) parts[kv.slice(0, idx).trim()] = kv.slice(idx + 1).trim();
  }
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;

  // Convoy scheme: HMAC("<t>.<body>"); fallback: HMAC(body)
  for (const candidate of [`${t}.${rawBody}`, rawBody]) {
    const hex = await hmacSha256Hex(secret, candidate);
    if (timingSafeEqual(hex, v1)) return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  const secret = process.env.BOOKLA_WEBHOOK_SECRET;
  const rawBody = await request.text();

  // Debug: log exactly what Bookla/Convoy sends so auth issues are visible.
  let eventType: unknown = null;
  try {
    eventType = (JSON.parse(rawBody) as Record<string, unknown>).type ?? null;
  } catch {
    /* logged below via bodyPreview */
  }
  console.log('[BOOKLA-WEBHOOK] incoming:', {
    eventType,
    hasKeyParam: request.nextUrl.searchParams.has('key'),
    userAgent: request.headers.get('user-agent'),
    convoySignature: request.headers.get('x-convoy-signature'),
    convoyMsgId: request.headers.get('x-convoy-msg-id'),
    bodyPreview: rawBody.slice(0, 200),
  });

  let authorized = true;
  if (secret) {
    const key = request.nextUrl.searchParams.get('key');
    const convoySig = request.headers.get('x-convoy-signature');
    authorized =
      (key !== null && key === secret) ||
      (convoySig != null && (await verifyConvoySignature(convoySig, rawBody, secret)));
  }

  if (!authorized) {
    console.log('[BOOKLA-WEBHOOK] 401 — key param and Convoy signature both failed');
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
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
