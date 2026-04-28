import { NextRequest, NextResponse } from 'next/server';

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

/**
 * Authenticate a client with Bookla and get a Bearer token.
 */
async function authenticateClient(email: string, firstName: string, lastName?: string): Promise<string | null> {
  try {
    const loginUrl = `${BOOKLA_BASE_URL}/client/auth/login`;
    console.log('[AUTH] Authenticating client:', email);

    const loginPayload = {
      companyID: COMPANY_ID,
      email: email,
      externalUserID: email,
      firstName: firstName,
      lastName: lastName || '-',
    };

    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginPayload),
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error('[AUTH] Client auth failed:', loginResponse.status, errorText.slice(0, 500));
      return null;
    }

    const authData = await loginResponse.json();
    console.log('[AUTH] Client authenticated, token received');
    return authData.accessToken || null;
  } catch (e) {
    console.error('[AUTH] Client auth error:', e);
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

    // Build booking payload
    const bookingPayload: any = {
      companyID: COMPANY_ID,
      serviceID: SERVICE_ID,
      startTime: startTime,
      duration: 'PT2H',
      tickets: ticketsMap,
    };

    // Add resource if configured
    if (RESOURCE_ID) {
      bookingPayload.resourceID = RESOURCE_ID;
    }

    // Add phone to metaData
    if (client.phone) {
      bookingPayload.metaData = { phone: client.phone };
    }

    // Add subscription code for member bookings
    const isMemberBooking = Boolean(subscriptionCode);
    if (subscriptionCode) {
      bookingPayload.code = subscriptionCode;
      console.log('[BOOKING] Member booking with code:', subscriptionCode);
    }

    const bookingUrl = `${BOOKLA_BASE_URL}/client/bookings`;
    let response: Response;

    if (isMemberBooking) {
      // MEMBER FLOW: Authenticate first, then use Bearer auth
      const clientToken = await authenticateClient(
        client.email,
        client.firstName,
        client.lastName
      );

      if (clientToken) {
        console.log('[BOOKING] Using Bearer auth for member booking');
        // Don't send guest client data when using Bearer auth
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
        // Fallback: use API key with guest client
        console.warn('[BOOKING] Client auth failed, falling back to API key');
        bookingPayload.client = {
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName || '-',
        };
        
        response = await fetch(bookingUrl, {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingPayload),
        });
      }
    } else {
      // NON-MEMBER FLOW: Use API key with guest client
      bookingPayload.client = {
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName || '-',
      };
      
      console.log('[BOOKING] Sending to Bookla (guest):', JSON.stringify(bookingPayload));
      response = await fetch(bookingUrl, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });
    }

    const responseText = await response.text();
    console.log('[BOOKING] Bookla response status:', response.status);
    console.log('[BOOKING] Bookla response:', responseText.slice(0, 2000));

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

    // Safely parse JSON response
    let bookingData: any;
    try {
      bookingData = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('[BOOKING] Failed to parse Bookla response as JSON:', responseText.slice(0, 500));
      return NextResponse.json(
        { error: 'Invalid response from booking service', details: responseText.slice(0, 500) },
        { status: 502 }
      );
    }

    console.log('[BOOKING] Booking created:', JSON.stringify(bookingData).slice(0, 500));

    // Check if payment is required
    const paymentURL = bookingData.paymentURL || bookingData.paymentUrl;
    const isConfirmed = bookingData.status === 'confirmed' || !paymentURL || bookingData.price === 0;
    
    // Membership is applied when we attempted member booking and Bookla accepted it (no payment required)
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

    // Payment required
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
