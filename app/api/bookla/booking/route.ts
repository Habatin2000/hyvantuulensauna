import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const RESOURCE_ID = process.env.BOOKLA_PUBLIC_RESOURCE_ID;
const API_KEY = process.env.BOOKLA_BOOKING_API_KEY || process.env.BOOKLA_API_KEY;

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

/**
 * Authenticate a client with Bookla and get a Bearer token.
 * Uses POST /client/auth/login which acts as an upsert.
 */
async function authenticateClient(email: string, firstName: string, lastName?: string): Promise<string | null> {
  try {
    const url = `${BOOKLA_BASE_URL}/client/auth/login`;
    const body = {
      companyID: COMPANY_ID,
      email: email,
      externalUserID: email,
      firstName: firstName,
      lastName: lastName || '-',
    };

    console.log('[BOOKLA AUTH] Request:', { endpoint: url, email });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log('[BOOKLA AUTH] Response:', { status: res.status, body: text.slice(0, 500) });

    if (!res.ok) {
      console.error('[BOOKLA AUTH] Client auth failed:', res.status, text.slice(0, 200));
      return null;
    }

    const data = JSON.parse(text);
    return data.accessToken || null;
  } catch (e) {
    console.error('[BOOKLA AUTH] Error:', e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !SERVICE_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration', missing: { companyId: !COMPANY_ID, serviceId: !SERVICE_ID, apiKey: !API_KEY } },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { startTime, tickets, client, subscriptionCode, contractId } = body;

    if (!startTime || !tickets || !client?.email || !client?.firstName || !client?.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: startTime, tickets, client.email, client.firstName, client.lastName' },
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
        { error: 'Valitse vähintään yksi lippu' },
        { status: 400 }
      );
    }

    const totalTickets = Object.values(ticketsMap).reduce((sum, qty) => sum + qty, 0);
    if (totalTickets > 17) {
      return NextResponse.json(
        { error: 'Maksimi 17 lippua per varaus' },
        { status: 400 }
      );
    }

    const memberCode = contractId || subscriptionCode;
    const isMemberBooking = Boolean(memberCode);
    if (isMemberBooking) {
      console.log('[BOOKING] Member booking with code:', memberCode);
    }

    // Build booking payload (same structure for both flows)
    const bookingPayload: any = {
      companyID: COMPANY_ID,
      serviceID: SERVICE_ID,
      startTime: startTime,
      duration: 'PT2H',
    };

    if (RESOURCE_ID) {
      bookingPayload.resourceID = RESOURCE_ID;
    }

    if (Object.keys(ticketsMap).length > 0) {
      bookingPayload.tickets = ticketsMap;
    }

    if (client.phone) {
      bookingPayload.metaData = { phone: client.phone };
    }

    if (memberCode) {
      bookingPayload.code = memberCode;
    }

    const bookingUrl = `${BOOKLA_BASE_URL}/client/bookings`;
    let response: Response;

    if (isMemberBooking) {
      // MEMBER FLOW: Authenticate client first to get Bearer token,
      // then create booking with Bearer auth so Bookla can apply the subscription code.
      const clientToken = await authenticateClient(client.email, client.firstName, client.lastName);

      if (clientToken) {
        console.log('[BOOKING] Using Bearer auth for member booking');
        // Don't send guest client data when using Bearer auth - the client is already identified
        const memberPayload = { ...bookingPayload };
        delete memberPayload.client;

        console.log('[BOOKING] Sending to Bookla (Bearer):', JSON.stringify(memberPayload));
        response = await fetch(bookingUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${clientToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberPayload),
        });
      } else {
        // Fallback: use API key with guest client if auth fails
        console.warn('[BOOKING] Client auth failed, falling back to API key with guest client');
        bookingPayload.client = {
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName || '-',
        };
        console.log('[BOOKING] Sending to Bookla (API key fallback):', JSON.stringify(bookingPayload));
        response = await fetch(bookingUrl, {
          method: 'POST',
          headers: {
            'X-API-Key': API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingPayload),
        });
      }
    } else {
      // NON-MEMBER FLOW: clean payload without resourceID or code
      const guestPayload: any = {
        companyID: COMPANY_ID,
        serviceID: SERVICE_ID,
        startTime,
        duration: 'PT2H',
        client: {
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName || '',
        },
        tickets: ticketsMap,
      };

      if (RESOURCE_ID) {
        guestPayload.resourceID = RESOURCE_ID;
      }

      if (client.phone) {
        guestPayload.metaData = { phone: client.phone };
      }

      console.log('[BOOKING] Sending to Bookla (guest):', JSON.stringify(guestPayload));
      response = await fetch(bookingUrl, {
        method: 'POST',
        headers: {
          'X-API-Key': API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestPayload),
      });
    }

    const responseText = await response.text();
    console.log('[BOOKING] Bookla response status:', response.status);
    console.log('[BOOKING] Bookla response:', responseText.slice(0, 1000));

    if (!response.ok) {
      if (response.status === 409) {
        return NextResponse.json(
          { error: 'Tämä aika on jo varattu. Valitse toinen aika.', code: 'SLOT_UNAVAILABLE' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Bookla API error', status: response.status, details: responseText },
        { status: 502 }
      );
    }

    const bookingData = JSON.parse(responseText);
    console.log('[BOOKING] Booking created:', JSON.stringify(bookingData).slice(0, 500));

    // Check if Bookla actually confirmed the booking
    const isConfirmedByBookla =
      bookingData.status === 'confirmed' ||
      (!bookingData.paymentURL && !bookingData.paymentUrl) ||
      bookingData.price === 0;

    if (isMemberBooking && isConfirmedByBookla) {
      console.log('[BOOKING] Member booking confirmed by Bookla (code used):', memberCode);
      return NextResponse.json({
        success: true,
        requiresPayment: false,
        membershipApplied: true,
        bookingId: bookingData.id,
        status: bookingData.status || 'confirmed',
        confirmationCode: bookingData.confirmationCode || bookingData.code,
      });
    }

    if (isMemberBooking && !isConfirmedByBookla) {
      console.warn('[BOOKING] Member code sent but Bookla still requires payment. Code may be invalid:', memberCode);
      console.warn('[BOOKING] Bookla status:', bookingData.status, 'price:', bookingData.price);
      // Fall through to payment flow so the user can still complete the booking
    }

    if (bookingData.paymentURL || bookingData.paymentUrl) {
      return NextResponse.json({
        success: false,
        requiresPayment: true,
        membershipApplied: false,
        paymentURL: bookingData.paymentURL || bookingData.paymentUrl,
        bookingId: bookingData.id,
      });
    }

    return NextResponse.json({
      success: true,
      requiresPayment: false,
      membershipApplied: false,
      bookingId: bookingData.id,
      status: bookingData.status,
      confirmationCode: bookingData.confirmationCode || bookingData.code,
    });

  } catch (error: any) {
    console.error('[BOOKING] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Varauksen luominen epäonnistui', type: error.name },
      { status: 500 }
    );
  }
}
