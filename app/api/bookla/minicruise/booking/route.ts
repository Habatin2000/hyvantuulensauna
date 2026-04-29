import { NextRequest, NextResponse } from 'next/server';
import { authenticateClient, booklaClientBooking } from '../../lib/booking';

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

    if (!serviceId || !startTime || !client?.email || !client?.firstName || !client?.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, startTime, client.email, client.firstName, client.lastName' },
        { status: 400 }
      );
    }

    console.log('[MINICRUISE-BOOKING] Creating booking:', { serviceId, resourceId, startTime, duration: duration || 'PT1H30M', spots: spots || 1, clientEmail: client.email });

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
      return NextResponse.json(
        { error: 'Bookla API error', status, details: result.error },
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

  } catch (error: any) {
    console.error('[MINICRUISE-BOOKING] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking', type: error.name },
      { status: 500 }
    );
  }
}
