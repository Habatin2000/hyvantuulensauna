/**
 * Shared Bookla client booking helper.
 *
 * Flow:
 *   1. authenticateClient: POST /client/auth/login → accessToken + clientId
 *   2. booklaClientBooking: POST /client/bookings + Bearer → paymentURL
 *
 * No client object in booking body — Bearer token identifies the client.
 * Client data goes to Bookla via /client/auth/login (upsert).
 */

export interface BooklaAuthResult {
  accessToken: string;
  clientId: string;
}

export interface BooklaClientBookingParams {
  baseUrl: string;
  accessToken: string;
  companyId: string;
  serviceId: string;
  resourceId: string;
  startTime: string;
  duration: string;
  spots?: number;
  tickets?: Record<string, number>;
  metaData?: Record<string, unknown>;
  code?: string; // subscription code — only for public sauna
}

// Shape of the Bookla /client/bookings response (fields actually accessed).
export interface BooklaClientBookingData {
  id?: string;
  status?: string;
  paymentURL?: string;
  paymentUrl?: string;
  price?: number;
  confirmationCode?: string;
  code?: string;
  [key: string]: unknown;
}

export interface BooklaClientBookingResult {
  ok: boolean;
  status?: number;
  data?: BooklaClientBookingData;
  error?: string;
  raw?: string;
  paymentURL?: string | null;
  price?: number | null;
  bookingStatus?: string;
  bookingId?: string;
  isConfirmed?: boolean;
}

/**
 * Authenticate a client with Bookla and get a Bearer token.
 * Throws if auth fails (does NOT return null).
 */
export async function authenticateClient(params: {
  baseUrl: string;
  apiKey: string;
  companyId: string;
  email: string;
  firstName: string;
  lastName: string;
}): Promise<BooklaAuthResult> {
  const url = `${params.baseUrl}/client/auth/login`;
  const body = {
    companyID: params.companyId,
    email: params.email,
    externalUserID: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
  };

  console.log('[BOOKLA AUTH] Request:', { endpoint: url });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': params.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  // Never log the body — it contains the accessToken.
  console.log('[BOOKLA AUTH] Response:', { status: res.status });

  if (!res.ok) {
    throw new Error(`Client auth failed: ${res.status} — ${text.slice(0, 200)}`);
  }

  const data = JSON.parse(text);
  return {
    accessToken: data.accessToken,
    clientId: data.id || data.clientId,
  };
}

/**
 * Create a booking via Bookla's client endpoint.
 * Uses Bearer token — NO client object in body (token identifies client).
 */
export async function booklaClientBooking(
  params: BooklaClientBookingParams
): Promise<BooklaClientBookingResult> {
  const url = `${params.baseUrl}/client/bookings`;

  const body: {
    companyID: string;
    serviceID: string;
    resourceID: string;
    startTime: string;
    duration: string;
    spots?: number;
    tickets?: Record<string, number>;
    metaData?: Record<string, unknown>;
    code?: string;
  } = {
    companyID: params.companyId,
    serviceID: params.serviceId,
    resourceID: params.resourceId,
    startTime: params.startTime,
    duration: params.duration,
  };

  if (params.spots !== undefined) {
    body.spots = params.spots;
  }
  if (params.tickets) {
    body.tickets = params.tickets;
  }
  if (params.metaData) {
    body.metaData = params.metaData;
  }
  if (params.code) {
    body.code = params.code;
  }

  // Don't log the payload — it contains customer PII (metaData.phone, tickets).
  console.log('[BOOKLA REQUEST]', {
    endpoint: url,
    authMethod: 'Bearer',
    serviceId: params.serviceId,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: BooklaClientBookingData | null = null;
  try {
    data = JSON.parse(text);
  } catch {
    // Not valid JSON — reported below
  }

  // Don't log the raw body — it may contain customer PII.
  console.log('[BOOKLA RESPONSE]', {
    httpStatus: res.status,
    bookingStatus: data?.status ?? null,
    hasPaymentURL: Boolean(data?.paymentURL ?? data?.paymentUrl),
    price: data?.price ?? null,
    bookingId: data?.id ?? null,
  });

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: text,
    };
  }

  const isConfirmedByBookla =
    data?.status === 'confirmed' ||
    data?.price === 0;

  return {
    ok: true,
    data: data ?? undefined,
    paymentURL: data?.paymentURL || data?.paymentUrl || null,
    price: data?.price || null,
    bookingStatus: data?.status,
    bookingId: data?.id,
    isConfirmed: isConfirmedByBookla,
  };
}
