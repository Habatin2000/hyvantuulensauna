import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_API_KEY;

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration', missing: { companyId: !COMPANY_ID, apiKey: !API_KEY } },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { serviceId, resourceId, startTime, duration, client, spots } = body;

    if (!serviceId || !startTime || !client) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('[MINICRUISE-BOOKING] Creating booking:', { serviceId, resourceId, startTime });

    const bookingUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${serviceId}/bookings`;
    
    const requestBody: any = {
      startTime,
      duration: duration || 'PT1H30M',
      client: {
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone || '',
      },
      spots: spots || 1,
    };

    if (resourceId) {
      requestBody.resourceId = resourceId;
    }

    const response = await fetch(bookingUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log('[MINICRUISE-BOOKING] Bookla response status:', response.status);
    console.log('[MINICRUISE-BOOKING] Bookla response:', responseText.slice(0, 2000));

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Bookla API error', status: response.status, details: responseText },
        { status: 502 }
      );
    }

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('[MINICRUISE-BOOKING] Failed to parse Bookla response as JSON:', responseText.slice(0, 500));
      return NextResponse.json(
        { error: 'Invalid response from booking service', details: responseText.slice(0, 500) },
        { status: 502 }
      );
    }

    console.log('[MINICRUISE-BOOKING] Success:', data.id);

    return NextResponse.json({
      success: true,
      bookingId: data.id,
      confirmationCode: data.confirmationCode,
      requiresPayment: data.requiresPayment || false,
      paymentUrl: data.paymentUrl || null,
    });

  } catch (error: any) {
    console.error('[MINICRUISE-BOOKING] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking', type: error.name },
      { status: 500 }
    );
  }
}
