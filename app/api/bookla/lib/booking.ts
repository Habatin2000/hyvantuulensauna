/**
 * Shared Bookla booking helpers.
 *
 * Two approaches:
 *   1. authenticateClient + booklaClientBooking: Bearer token auth (legacy)
 *   2. booklaApiKeyBooking: X-API-Key auth with explicit client object (matches omni-lingual-web)
 *
 * For subscription/member bookings, approach #2 is preferred because Bookla's
 * subscription plugin requires the client object to be present in the booking payload.
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
  resourceId?: string;
  startTime: string;
  duration: string;
  spots?: number;
  tickets?: Record<string, number>;
  metaData?: Record<string, any>;
  code?: string;
  client?: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export interface BooklaCompanyBookingParams {
  baseUrl: string;
  apiKey: string;
  companyId: string;
  serviceId: string;
  resourceId: string;
  startTime: string;
  duration: string;
  clientId: string;
  tickets?: Record<string, number>;
  metaData?: Record<string, any>;
  code?: string;
}

export interface BooklaBookingResult {
  ok: boolean;
  status?: number;
  data?: any;
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

  console.log('[BOOKLA AUTH] Request:', { endpoint: url, email: params.email });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': params.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log('[BOOKLA AUTH] Response:', { status: res.status, body: text.slice(0, 500) });

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
 * Create a booking via Bookla's client endpoint using Bearer token.
 * Uses Bearer token — NO client object in body (token identifies client).
 */
export async function booklaClientBooking(
  params: BooklaClientBookingParams
): Promise<BooklaBookingResult> {
  const url = `${params.baseUrl}/client/bookings`;

  const body: any = {
    companyID: params.companyId,
    serviceID: params.serviceId,
    startTime: params.startTime,
    duration: params.duration,
  };

  if (params.resourceId) {
    body.resourceID = params.resourceId;
  }

  // Include client object when provided (required for subscription plugin)
  if (params.client) {
    body.client = {
      email: params.client.email,
      firstName: params.client.firstName,
      lastName: params.client.lastName,
    };
    if (params.client.phone) {
      body.client.phone = params.client.phone;
    }
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
  if (params.code) {
    body.code = params.code;
    // Also send in pluginData — Bookla's subscription plugin may read from here
    body.pluginData = {
      subscriptionCode: params.code,
    };
  }

  console.log('[BOOKLA REQUEST]', {
    endpoint: url,
    authMethod: 'Bearer',
    payload: JSON.stringify(body, null, 2),
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
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    // Not valid JSON — reported below
  }

  console.log('[BOOKLA RESPONSE]', {
    httpStatus: res.status,
    bookingStatus: data?.status ?? null,
    paymentURL: data?.paymentURL ?? data?.paymentUrl ?? null,
    price: data?.price ?? null,
    bookingId: data?.id ?? null,
    body: text.slice(0, 1000),
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
    (!data?.paymentURL && !data?.paymentUrl) ||
    data?.price === 0;

  return {
    ok: true,
    data,
    paymentURL: data?.paymentURL || data?.paymentUrl || null,
    price: data?.price || null,
    bookingStatus: data?.status,
    bookingId: data?.id,
    isConfirmed: isConfirmedByBookla,
  };
}

/**
 * Create a booking via Bookla's company/merchant endpoint using X-API-Key auth.
 * The company endpoint may handle subscription codes differently than the client endpoint.
 */
export async function booklaCompanyBooking(
  params: BooklaCompanyBookingParams
): Promise<BooklaBookingResult> {
  const url = `${params.baseUrl}/companies/${params.companyId}/bookings`;

  const body: any = {
    clientID: params.clientId,
    serviceID: params.serviceId,
    resourceID: params.resourceId,
    startTime: params.startTime,
    duration: params.duration,
  };

  if (params.tickets) {
    body.tickets = params.tickets;
  }
  if (params.metaData) {
    body.metaData = params.metaData;
  }
  if (params.code) {
    body.code = params.code;
  }

  console.log('[BOOKLA REQUEST]', {
    endpoint: url,
    authMethod: 'X-API-Key (company)',
    payload: JSON.stringify(body, null, 2),
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-API-Key': params.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    // Not valid JSON — reported below
  }

  console.log('[BOOKLA RESPONSE]', {
    httpStatus: res.status,
    bookingStatus: data?.status ?? null,
    paymentURL: data?.paymentURL ?? data?.paymentUrl ?? null,
    price: data?.price ?? null,
    bookingId: data?.id ?? null,
    body: text.slice(0, 1000),
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
    (!data?.paymentURL && !data?.paymentUrl) ||
    data?.price === 0;

  return {
    ok: true,
    data,
    paymentURL: data?.paymentURL || data?.paymentUrl || null,
    price: data?.price || null,
    bookingStatus: data?.status,
    bookingId: data?.id,
    isConfirmed: isConfirmedByBookla,
  };
}
