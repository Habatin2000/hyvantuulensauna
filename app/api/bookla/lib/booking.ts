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

  console.log('[BOOKLA-BOOKING] Request URL:', url);
  console.log('[BOOKLA-BOOKING] Request body:', JSON.stringify(body));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': params.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseText = await response.text();
  console.log('[BOOKLA-BOOKING] Response status:', response.status);
  console.log('[BOOKLA-BOOKING] Response body:', responseText.slice(0, 2000));

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: responseText,
    };
  }

  try {
    const data = JSON.parse(responseText);
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: 502,
      error: 'Invalid JSON response from Bookla',
      raw: responseText,
    };
  }
}
