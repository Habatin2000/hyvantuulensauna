/**
 * Shared Bookla booking helper.
 * All booking routes (summer, minicruise, public sauna) use this function
 * to communicate with Bookla's Create Booking endpoint.
 *
 * Bookla docs:
 *   POST /companies/{COMPANY_ID}/bookings
 *   Header: x-api-key
 *   Body:  serviceID (required), resourceID (required), startTime, duration,
 *          spots | tickets, client, metaData, code
 */

export interface BooklaBookingClient {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}

export interface BooklaBookingParams {
  baseUrl: string;
  apiKey: string;
  companyId: string;
  serviceId: string;
  resourceId?: string;
  startTime: string;
  duration: string;
  client: BooklaBookingClient;
  spots?: number;
  tickets?: Record<string, number>;
  metaData?: Record<string, any>;
  code?: string; // subscription code for members
}

export interface BooklaBookingResult {
  ok: boolean;
  status?: number;
  data?: any;
  error?: string;
  raw?: string;
}

export async function booklaBooking(params: BooklaBookingParams): Promise<BooklaBookingResult> {
  const url = `${params.baseUrl}/companies/${params.companyId}/bookings`;

  const body: any = {
    serviceID: params.serviceId,
    startTime: params.startTime,
    duration: params.duration,
    client: {
      email: params.client.email,
      firstName: params.client.firstName,
      lastName: params.client.lastName || '-',
    },
  };

  if (params.resourceId) {
    body.resourceID = params.resourceId;
  }
  if (params.spots !== undefined) {
    body.spots = params.spots;
  }
  if (params.tickets) {
    body.tickets = params.tickets;
  }
  if (params.metaData) {
    body.metaData = params.metaData;
  }
  if (params.client.phone) {
    body.client.phone = params.client.phone;
  }
  if (params.code) {
    body.code = params.code;
  }

  // DIAGNOSTIC LOGGING — Phase 1
  console.log('[BOOKLA REQUEST]', {
    endpoint: url,
    authMethod: 'x-api-key',
    headers: { 'x-api-key': '***' + params.apiKey.slice(-4), 'Content-Type': 'application/json' },
    payload: JSON.stringify(body, null, 2),
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': params.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseText = await response.text();

  let parsedData: any = null;
  try {
    parsedData = JSON.parse(responseText);
  } catch {
    // Not valid JSON — will be reported below
  }

  // DIAGNOSTIC LOGGING — Phase 1
  console.log('[BOOKLA RESPONSE]', {
    status: response.status,
    body: responseText,
    parsedPaymentURL: parsedData?.paymentURL || parsedData?.paymentUrl || null,
    parsedPrice: parsedData?.price || null,
    parsedStatus: parsedData?.status || null,
    parsedBookingId: parsedData?.id || null,
    parsedMessage: parsedData?.message || null,
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: responseText,
    };
  }

  if (!parsedData) {
    return {
      ok: false,
      status: 502,
      error: 'Invalid JSON response from Bookla',
      raw: responseText,
    };
  }

  return { ok: true, data: parsedData };
}
