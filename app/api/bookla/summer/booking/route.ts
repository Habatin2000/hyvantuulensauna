import { NextRequest, NextResponse } from 'next/server';
import { authenticateClient, booklaClientBooking } from '../../lib/booking';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_API_KEY;
const SUMMER_SERVICE_ID = '3ea1445e-c830-4604-a294-3dbe124446a5';

interface SummerBookingRequest {
  startTime: string;
  duration: string;
  resourceId: string;
  client: {
    email: string;
    firstName: string;
    lastName: string;
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

    // Validate required fields
    if (!startTime || !duration || !resourceId || !client?.email || !client?.firstName || !client?.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: startTime, duration, resourceId, client.email, client.firstName, client.lastName' },
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

    // Step 1: Authenticate client with Bookla
    const auth = await authenticateClient({
      baseUrl: BOOKLA_BASE_URL,
      apiKey: API_KEY,
      companyId: COMPANY_ID,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
    });

    // Step 2: Create booking via client endpoint
    const result = await booklaClientBooking({
      baseUrl: BOOKLA_BASE_URL,
      accessToken: auth.accessToken,
      companyId: COMPANY_ID,
      serviceId: SUMMER_SERVICE_ID,
      resourceId: resourceId,
      startTime,
      duration,
      spots: spots || 1,
      metaData: client.phone ? { phone: client.phone } : undefined,
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

    // Step 3: Return response based on Bookla's confirmation/payment status
    if (result.isConfirmed) {
      return NextResponse.json({
        success: true,
        requiresPayment: false,
        bookingId: result.bookingId,
        status: result.bookingStatus,
        confirmationCode: result.data?.confirmationCode || result.data?.code,
      });
    }

    if (result.paymentURL) {
      return NextResponse.json({
        success: false,
        requiresPayment: true,
        paymentUrl: result.paymentURL,
        bookingId: result.bookingId,
      });
    }

    // Fallback — booking created but no payment required and not confirmed
    return NextResponse.json({
      success: true,
      requiresPayment: false,
      bookingId: result.bookingId,
      status: result.bookingStatus,
    });

  } catch (error: any) {
    console.error('[SUMMER-BOOKING] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Varauksen luominen epäonnistui', type: error.name },
      { status: 500 }
    );
  }
}
