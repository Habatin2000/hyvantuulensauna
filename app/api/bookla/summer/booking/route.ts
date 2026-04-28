import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_BOOKING_API_KEY || process.env.BOOKLA_API_KEY;
const SUMMER_SERVICE_ID = '3ea1445e-c830-4604-a294-3dbe124446a5';

interface SummerBookingRequest {
  startTime: string;
  duration: string;
  resourceId: string;
  client: {
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  };
  spots?: number;
}

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration', missing: { companyId: !COMPANY_ID, apiKey: !API_KEY } },
      { status: 400 }
    );
  }

  let responseText = '';
  try {
    const body: SummerBookingRequest = await request.json();
    console.log('[SUMMER-BOOKING] Request:', JSON.stringify(body));

    const { startTime, duration, resourceId, client, spots } = body;

    // Validate required fields
    if (!startTime || !duration || !resourceId || !client?.email || !client?.firstName) {
      return NextResponse.json(
        { error: 'Missing required fields: startTime, duration, resourceId, client.email, client.firstName' },
        { status: 400 }
      );
    }

    // Validate minimum duration (3 hours)
    const durationMatch = duration.match(/PT(\d+)H/);
    if (!durationMatch || parseInt(durationMatch[1]) < 3) {
      return NextResponse.json(
        { error: 'Minimi varausaika on 3 tuntia', code: 'MIN_DURATION' },
        { status: 400 }
      );
    }

    // Build booking payload for Bookla (company endpoint)
    const bookingPayload: any = {
      resourceID: resourceId,
      startTime,
      duration,
      spots: spots || 1,
      client: {
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName || '-',
      },
    };

    // Add phone to metaData
    if (client.phone) {
      bookingPayload.metaData = { phone: client.phone };
    }

    console.log('[SUMMER-BOOKING] Sending to Bookla:', JSON.stringify(bookingPayload));

    const bookingUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${SUMMER_SERVICE_ID}/bookings`;
    const response = await fetch(bookingUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingPayload),
    });

    responseText = await response.text();
    console.log('[SUMMER-BOOKING] Bookla response status:', response.status);
    console.log('[SUMMER-BOOKING] Bookla response:', responseText.slice(0, 2000));

    if (!response.ok) {
      if (response.status === 409) {
        return NextResponse.json(
          { error: 'Tämä aika on jo varattu. Valitse toinen aika.', code: 'SLOT_UNAVAILABLE' },
          { status: 409 }
        );
      }

      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Virheelliset varaustiedot. Tarkista tiedot ja yritä uudelleen.', code: 'BAD_REQUEST', details: responseText },
          { status: 400 }
        );
      }

      // Bookla API returned an error — return it directly so frontend can show it
      return NextResponse.json(
        { error: 'Bookla API error', status: response.status, details: responseText },
        { status: 502 }
      );
    }

    // Safely parse JSON response
    let bookingData: any;
    try {
      bookingData = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('[SUMMER-BOOKING] Failed to parse Bookla response as JSON:', responseText.slice(0, 500));
      return NextResponse.json(
        { error: 'Invalid response from booking service', details: responseText.slice(0, 500) },
        { status: 502 }
      );
    }

    console.log('[SUMMER-BOOKING] Booking created:', JSON.stringify(bookingData).slice(0, 500));

    // Check for payment URL
    if (bookingData.paymentURL || bookingData.paymentUrl) {
      console.log('[SUMMER-BOOKING] Payment required');
      return NextResponse.json({
        success: false,
        requiresPayment: true,
        paymentUrl: bookingData.paymentURL || bookingData.paymentUrl,
        bookingId: bookingData.id,
      });
    }

    // Confirmed without payment
    return NextResponse.json({
      success: true,
      requiresPayment: false,
      bookingId: bookingData.id,
      status: bookingData.status || 'confirmed',
      confirmationCode: bookingData.confirmationCode || bookingData.code,
    });

  } catch (error: any) {
    console.error('[SUMMER-BOOKING] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Varauksen luominen epäonnistui', type: error.name },
      { status: 500 }
    );
  }
}
