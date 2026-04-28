import { NextRequest, NextResponse } from 'next/server';
import { booklaBooking } from '../../lib/booking';

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

    if (!serviceId || !startTime || !client?.email || !client?.firstName) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, startTime, client.email, client.firstName' },
        { status: 400 }
      );
    }

    console.log('[MINICRUISE-BOOKING] Creating booking:', { serviceId, resourceId, startTime });

    const result = await booklaBooking({
      baseUrl: BOOKLA_BASE_URL,
      apiKey: API_KEY,
      companyId: COMPANY_ID,
      serviceId: serviceId,
      resourceId: resourceId,
      startTime,
      duration: duration || 'PT1H30M',
      client: {
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
      },
      spots: spots || 1,
    });

    if (!result.ok) {
      const status = result.status || 502;
      return NextResponse.json(
        { error: 'Bookla API error', status, details: result.error },
        { status: 502 }
      );
    }

    const data = result.data;
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
