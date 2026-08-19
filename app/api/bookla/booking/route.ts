import { NextRequest, NextResponse } from 'next/server';
import { authenticateClient, booklaClientBooking } from '../lib/booking';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const RESOURCE_ID = process.env.BOOKLA_PUBLIC_RESOURCE_ID;
const API_KEY = process.env.BOOKLA_BOOKING_API_KEY || process.env.BOOKLA_API_KEY;

// Time validation helpers
const TIME_ZONE = 'Europe/Helsinki';

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

// No hardcoded time validation — Bookla is the source of truth for slot validity

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !SERVICE_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { startTime, tickets, client, subscriptionCode, resourceId: bodyResourceId } = body;

    if (!startTime || !tickets || !client?.email || !client?.firstName || !client?.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: startTime, tickets, client.email, client.firstName, client.lastName' },
        { status: 400 }
      );
    }

    // Log time info for debugging
    const { dow, hour, localDate } = getHelsinkiDate(startTime);
    console.log('[BOOKING] Selected slot:', { dow, hour, localDate });

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
      // Never log the subscription code — it authorizes free bookings.
      console.log('[BOOKING] Member booking with subscription code');
    }

    // Compute total spots from tickets
    const totalSpots = Object.values(ticketsMap).reduce((sum, qty) => sum + qty, 0);

    // Determine effective resourceID: prefer the one from the selected slot, fallback to env
    const effectiveResourceId = bodyResourceId || RESOURCE_ID || '';

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
      serviceId: SERVICE_ID,
      resourceId: effectiveResourceId,
      startTime,
      duration: 'PT2H',
      spots: totalSpots,
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
      console.error('[BOOKING] Bookla API error:', status, typeof result.error === 'string' ? result.error.slice(0, 500) : result.error);
      return NextResponse.json(
        { error: 'Varauksen luominen epäonnistui. Yritä myöhemmin uudelleen.', code: 'BOOKING_FAILED' },
        { status: 502 }
      );
    }

    // Step 3: Handle member code fallback
    // If code was sent but Bookla still returns paymentURL → code expired/used
    // Let user pay normally, don't throw error
    if (isMemberBooking && result.isConfirmed) {
      return NextResponse.json({
        success: true,
        requiresPayment: false,
        membershipApplied: true,
        bookingId: result.bookingId,
        status: result.bookingStatus,
        confirmationCode: result.data?.confirmationCode || result.data?.code,
      });
    }

    if (result.paymentURL) {
      if (isMemberBooking) {
        console.warn('[BOOKING] Member code sent but payment still required — falling through to payment flow');
      }
      return NextResponse.json({
        success: false,
        requiresPayment: true,
        membershipApplied: false,
        paymentURL: result.paymentURL,
        bookingId: result.bookingId,
      });
    }

    return NextResponse.json({
      success: true,
      requiresPayment: false,
      membershipApplied: false,
      bookingId: result.bookingId,
      status: result.bookingStatus,
      confirmationCode: result.data?.confirmationCode || result.data?.code,
    });

  } catch (error) {
    console.error('[BOOKING] Unexpected error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Varauksen luominen epäonnistui', code: 'BOOKING_FAILED' },
      { status: 500 }
    );
  }
}
