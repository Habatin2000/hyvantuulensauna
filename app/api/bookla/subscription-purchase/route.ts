import { NextRequest, NextResponse } from 'next/server';
import { authenticateClient } from '@/app/api/bookla/lib/booking';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_API_KEY;

const PRODUCTS: Record<string, { name: string; price: number }> = {
  'ca646e7f-4a9c-4c5c-af59-b9538c49ecb3': { name: '5 x sauna card', price: 55 },
  '74e4fe83-5aa6-46e7-8248-9b39d5451a3a': { name: '10 x sauna card', price: 90 },
};

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email, firstName, lastName, phone, subscriptionId } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name and last name are required' },
        { status: 400 }
      );
    }

    const selectedId = typeof subscriptionId === 'string' ? subscriptionId : '';
    if (!PRODUCTS[selectedId]) {
      return NextResponse.json(
        { error: 'Invalid subscription selected' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedFirstName = String(firstName).trim();
    const normalizedLastName = String(lastName).trim();

    // 1. Authenticate (or create) the client with Bookla
    const auth = await authenticateClient({
      baseUrl: BOOKLA_BASE_URL,
      apiKey: API_KEY,
      companyId: COMPANY_ID,
      email: normalizedEmail,
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
    });

    console.log('[SUBSCRIPTION PURCHASE] Client authenticated:', {
      clientId: auth.clientId,
      subscriptionId: selectedId,
    });

    // 2. Purchase the subscription, Bearer token identifies the client
    const purchaseUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/plugins/subscription/client/purchases`;
    const purchaseBody: { items: { subscriptionID: string }[]; metaData?: { phone: string } } = {
      items: [{ subscriptionID: selectedId }],
    };

    if (phone) {
      purchaseBody.metaData = { phone: String(phone).trim() };
    }

    // Don't log the full body — metaData may contain the customer's phone.
    console.log('[SUBSCRIPTION PURCHASE] Request:', {
      endpoint: purchaseUrl,
      items: purchaseBody.items,
    });

    const purchaseRes = await fetch(purchaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseBody),
    });

    const purchaseText = await purchaseRes.text();
    let purchaseData: { paymentURL?: string; paymentUrl?: string } | null = null;
    try {
      purchaseData = JSON.parse(purchaseText);
    } catch {
      // not JSON
    }

    console.log('[SUBSCRIPTION PURCHASE] Response:', {
      status: purchaseRes.status,
      hasPaymentURL: Boolean(purchaseData?.paymentURL ?? purchaseData?.paymentUrl),
    });

    if (!purchaseRes.ok) {
      console.error('[SUBSCRIPTION PURCHASE] Purchase failed:', purchaseRes.status, purchaseText.slice(0, 500));
      return NextResponse.json(
        { error: 'Subscription purchase failed' },
        { status: 502 }
      );
    }

    const paymentURL = purchaseData?.paymentURL || purchaseData?.paymentUrl || null;

    if (!paymentURL) {
      console.error('[SUBSCRIPTION PURCHASE] No payment URL in Bookla response');
      return NextResponse.json(
        { error: 'Subscription purchase failed' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentURL,
      clientId: auth.clientId,
      subscriptionId: selectedId,
    });
  } catch (error) {
    console.error('[SUBSCRIPTION PURCHASE] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Subscription purchase failed' },
      { status: 500 }
    );
  }
}
