import { NextRequest, NextResponse } from 'next/server';
import { booklaBooking } from '../../lib/booking';

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

  try {
    const body: SummerBookingRequest = await request.json();
    console.log('[SUMMER-BOOKING] Request:', JSON.stringify(body));

    const { startTime, duration, resourceId, client, spots } = body;

    if (!startTime || !duration || !resourceId || !client?.email || !client?.firstName) {
      return NextResponse.json(
        { error: 'Missing required fields: startTime, duration, resourceId, client.email, client.firstName' },
        { status: 400 }
      );
    }

    const durationMatch = duration.match(/PT(\d+)H/);
    if (!durationMatch || parseInt(durationMatch[1]) < 3) {
      return NextResponse.json(
        { error: 'Minimi varausaika on 3 tuntia', code: 'MIN_DURATION' },
        { status: 400 }
      );
    }

    console.log('[SUMMER-BOOKING] Calling booklaBooking with:', {
      serviceId: SUMMER_SERVICE_ID,
      resourceId,
      startTime,
      duration,
      spots: spots || 1,
      clientEmail: client.email,
    });

    const result = await booklaBooking({
      baseUrl: BOOKLA_BASE_URL,
      apiKey: API_KEY,
      companyId: COMPANY_ID,
      serviceId: SUMMER_SERVICE_ID,
      resourceId: resourceId,
      startTime,
      duration,
      client: {
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
      },
      spots: spots || 1,
      metaData: client.phone ? { phone: client.phone } : undefined,
    });

    console.log('[SUMMER-BOOKING] booklaBooking result:', {
      ok: result.ok,
      status: result.status,
      hasData: !!result.data,
      error: result.error?.slice(0, 500),
    });

    if (!result.ok) {
      const status = result.status || 502;
      if (status === 409) {
        return NextResponse.json(
          { error: 'Tämä aika on jo varattu. Valitse toinen aika.', code: 'SLOT_UNAVAILABLE' },
          { status: 409 }
        );
      }
      if (status === 400) {
        return NextResponse.json(
          { error: 'Virheelliset varaustiedot. Tarkista tiedot ja yritä uudelleen.', code: 'BAD_REQUEST', details: result.error },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Bookla API error', status, details: result.error },
        { status: 502 }
      );
    }

    const bookingData = result.data;

    if (bookingData.paymentURL || bookingData.paymentUrl) {
      return NextResponse.json({
        success: false,
        requiresPayment: true,
        paymentUrl: bookingData.paymentURL || bookingData.paymentUrl,
        bookingId: bookingData.id,
      });
    }

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
