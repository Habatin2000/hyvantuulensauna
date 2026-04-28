import { NextRequest, NextResponse } from 'next/server';
import { booklaBooking } from '../lib/booking';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const RESOURCE_ID = process.env.BOOKLA_PUBLIC_RESOURCE_ID;
const API_KEY = process.env.BOOKLA_API_KEY;

// Time validation helpers
const TIME_ZONE = 'Europe/Helsinki';
const NEW_SCHEDULE_CUTOVER = '2026-03-20';

const getHelsinkiDate = (dateStr: string): { dow: number; hour: number; localDate: string } => {
  const date = new Date(dateStr);
  const helsinkiStr = date.toLocaleString('en-US', { timeZone: TIME_ZONE });
  const helsinkiDate = new Date(helsinkiStr);
  const y = helsinkiDate.getFullYear();
  const m = String(helsinkiDate.getMonth() + 1).padStart(2, '0');
  const d = String(helsinkiDate.getDate()).padStart(2, '0');
  return {
    dow: helsinkiDate.getDay(),
    hour: helsinkiDate.getHours(),
    localDate: `${y}-${m}-${d}`,
  };
};

const isValidPublicSlot = (dow: number, hour: number, localDate: string): boolean => {
  const isMonThu = dow >= 1 && dow <= 4;
  const isWeekend = dow === 0 || dow === 6;
  
  if (isMonThu) {
    const useNewSchedule = localDate >= NEW_SCHEDULE_CUTOVER;
    return useNewSchedule ? [17, 19].includes(hour) : [16, 18, 20].includes(hour);
  }
  if (isWeekend) {
    return [10, 12, 14].includes(hour);
  }
  return false; // Friday - no public slots
};

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !SERVICE_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration', missing: { companyId: !COMPANY_ID, serviceId: !SERVICE_ID, apiKey: !API_KEY } },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { startTime, tickets, client, subscriptionCode } = body;

    if (!startTime || !tickets || !client?.email || !client?.firstName) {
      return NextResponse.json(
        { error: 'Missing required fields: startTime, tickets, client.email, client.firstName' },
        { status: 400 }
      );
    }

    // Validate business hours
    const { dow, hour, localDate } = getHelsinkiDate(startTime);
    console.log('[BOOKING] Time validation:', { dow, hour, localDate });

    if (!isValidPublicSlot(dow, hour, localDate)) {
      return NextResponse.json(
        { error: 'Julkiset saunavuorot: Ma-To 16-22, La-Su 10-16', code: 'INVALID_TIME_SLOT' },
        { status: 400 }
      );
    }

    // Build tickets map (Bookla expects {ticketId: quantity}, not array)
    const ticketsMap: Record<string, number> = {};
    for (const ticket of tickets) {
      if (ticket.ticketID && ticket.quantity > 0) {
        ticketsMap[ticket.ticketID] = ticket.quantity;
      }
    }

    if (Object.keys(ticketsMap).length === 0) {
      return NextResponse.json(
        { error: 'At least one ticket required' },
        { status: 400 }
      );
    }

    const isMemberBooking = Boolean(subscriptionCode);
    if (isMemberBooking) {
      console.log('[BOOKING] Member booking with code:', subscriptionCode);
    }

    console.log('[BOOKING] Calling booklaBooking with:', {
      serviceId: SERVICE_ID,
      resourceId: RESOURCE_ID,
      startTime,
      duration: 'PT2H',
      tickets: ticketsMap,
      clientEmail: client.email,
      isMemberBooking,
    });

    const result = await booklaBooking({
      baseUrl: BOOKLA_BASE_URL,
      apiKey: API_KEY,
      companyId: COMPANY_ID,
      serviceId: SERVICE_ID,
      resourceId: RESOURCE_ID || undefined,
      startTime,
      duration: 'PT2H',
      client: {
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
      },
      tickets: ticketsMap,
      metaData: client.phone ? { phone: client.phone } : undefined,
      code: subscriptionCode || undefined,
    });

    if (!result.ok) {
      const status = result.status || 502;
      if (status === 409) {
        return NextResponse.json(
          { error: 'Tämä aika on jo varattu. Valitse toinen aika.', code: 'SLOT_UNAVAILABLE' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Bookla API error', status, details: result.error },
        { status: 502 }
      );
    }

    const bookingData = result.data;
    console.log('[BOOKING] Booking created:', JSON.stringify(bookingData).slice(0, 500));

    const paymentURL = bookingData.paymentURL || bookingData.paymentUrl;
    const isConfirmed = bookingData.status === 'confirmed' || !paymentURL || bookingData.price === 0;
    const membershipApplied = isMemberBooking && !paymentURL;

    if (isConfirmed) {
      return NextResponse.json({
        success: true,
        requiresPayment: false,
        membershipApplied,
        bookingId: bookingData.id,
        status: bookingData.status,
        confirmationCode: bookingData.confirmationCode || bookingData.code,
      });
    }

    return NextResponse.json({
      success: false,
      requiresPayment: true,
      membershipApplied: false,
      paymentURL,
      bookingId: bookingData.id,
    });

  } catch (error: any) {
    console.error('[BOOKING] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Varauksen luominen epäonnistui', type: error.name },
      { status: 500 }
    );
  }
}
