import { NextRequest, NextResponse } from 'next/server';
import { authenticateClient, booklaClientBooking } from '../../lib/booking';

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

    if (!serviceId || !resourceId || !startTime || !client?.email || !client?.firstName || !client?.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, resourceId, startTime, client.email, client.firstName, client.lastName' },
        { status: 400 }
      );
    }

    console.log('[MINICRUISE-BOOKING] Creating booking:', { serviceId, resourceId, startTime, duration: duration || 'PT1H30M', spots: spots || 1 });

    const auth = await authenticateClient({
      baseUrl: BOOKLA_BASE_URL,
      apiKey: API_KEY,
      companyId: COMPANY_ID,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
    });

    const result = await booklaClientBooking({
      baseUrl: BOOKLA_BASE_URL,
      accessToken: auth.accessToken,
      companyId: COMPANY_ID,
      serviceId: serviceId,
      resourceId: resourceId,
      startTime,
      duration: duration || 'PT1H30M',
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
        console.error('[MINICRUISE-BOOKING] Bookla rejected booking:', typeof result.error === 'string' ? result.error.slice(0, 500) : result.error);
        return NextResponse.json(
          { error: 'Virheelliset varaustiedot. Tarkista tiedot ja yritä uudelleen.', code: 'BAD_REQUEST' },
          { status: 400 }
        );
      }
      console.error('[MINICRUISE-BOOKING] Bookla API error:', status, typeof result.error === 'string' ? result.error.slice(0, 500) : result.error);
      return NextResponse.json(
        { error: 'Varauksen luominen epäonnistui. Yritä myöhemmin uudelleen.', code: 'BOOKING_FAILED' },
        { status: 502 }
      );
    }

    if (result.isConfirmed) {
      return NextResponse.json({
        success: true,
        requiresPayment: false,
        bookingId: result.bookingId,
        confirmationCode: result.data?.confirmationCode,
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

    return NextResponse.json({
      success: true,
      requiresPayment: false,
      bookingId: result.bookingId,
    });

  } catch (error) {
    console.error('[MINICRUISE-BOOKING] Unexpected error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Varauksen luominen epäonnistui', code: 'BOOKING_FAILED' },
      { status: 500 }
    );
  }
}
