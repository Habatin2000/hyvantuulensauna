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

    const data = await response.json();

    if (!response.ok) {
      console.error('[MINICRUISE-BOOKING] Bookla error:', response.status, data);
      return NextResponse.json(
        { error: data.message || 'Booking failed' },
        { status: response.status }
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
    console.error('[MINICRUISE-BOOKING] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
