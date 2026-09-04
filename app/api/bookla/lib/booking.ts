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
  // Canonical client identity: normalize here so every flow upserts the same
  // Bookla client regardless of casing/whitespace as typed by the customer.
  // Case/whitespace variants would otherwise create duplicate Bookla clients.
  const email = params.email.trim().toLowerCase();
  const firstName = params.firstName.trim();
  const lastName = params.lastName.trim();

  // Bookla dedupes clients by externalUserID — but existing records may carry
  // any external id (e.g. a UUID from a previous signup or import), while we
  // default to the email. Sending a different externalUserID makes Bookla
  // provision a duplicate. So: reuse the existing record's externalUserID
  // when one is found, fall back to the email for genuinely new customers.
  const externalUserID =
    (await findExternalUserIdForEmail(params, email)) ?? email;

  const url = `${params.baseUrl}/client/auth/login`;
  const body = {
    companyID: params.companyId,
    email,
    externalUserID,
    firstName,
    lastName,
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
 * Looks up an existing Bookla client's externalUserID by email (merchant
 * endpoint). Returns null when no client matches or on any failure — callers
 * fall back to using the email as the external id. Never logs PII.
 */
async function findExternalUserIdForEmail(
  params: { baseUrl: string; apiKey: string; companyId: string },
  email: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${params.baseUrl}/companies/${params.companyId}/clients/search?email=${encodeURIComponent(email)}`,
      { headers: { 'x-api-key': params.apiKey } }
    );
    if (!res.ok) {
      console.log('[BOOKLA AUTH] Client pre-lookup failed:', res.status);
      return null;
    }
    const data = await res.json();
    const clientsArray = data.clients || data;
    const clients = Array.isArray(clientsArray) ? clientsArray : [];
    const match = clients.find(
      (c: { email?: string; externalUserID?: string }) =>
        String(c.email ?? '').toLowerCase() === email &&
        typeof c.externalUserID === 'string' &&
        c.externalUserID.length > 0
    );
    console.log('[BOOKLA AUTH] Client pre-lookup:', match ? 'existing client found' : 'no existing client');
    return match?.externalUserID ?? null;
  } catch {
    console.log('[BOOKLA AUTH] Client pre-lookup threw, continuing without it');
    return null;
  }
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

export interface BooklaCodeValidateParams {
  baseUrl: string;
  accessToken: string;
  /** Subscription code — embedded in the URL path, never log it or the URL. */
  code: string;
  companyId: string;
  serviceId: string;
  resourceId: string;
  startTime: string;
  duration: string;
  spots?: number;
  tickets?: Record<string, number>;
}

/**
 * Authoritative eligibility check: POST /client/codes/{code}/validate asks
 * Bookla whether a subscription code applies to a specific booking context.
 *
 * Returns the `canApply` verdict, or null when validation is unavailable
 * (network error, non-OK status, unparsable body) — callers should then fall
 * back to their local eligibility check instead of blocking the booking.
 */
export async function validateClientCode(
  params: BooklaCodeValidateParams
): Promise<boolean | null> {
  const url = `${params.baseUrl}/client/codes/${encodeURIComponent(params.code)}/validate`;

  const body: {
    companyID: string;
    serviceID: string;
    resourceID: string;
    startTime: string;
    duration: string;
    spots?: number;
    tickets?: Record<string, number>;
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

  // Log nothing but the outcome — the URL embeds the subscription code.
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    console.log('[BOOKLA VALIDATE] Request failed (network)');
    return null;
  }

  if (!res.ok) {
    console.log('[BOOKLA VALIDATE] Non-OK status:', res.status);
    return null;
  }

  try {
    const data = await res.json();
    if (typeof data?.canApply !== 'boolean') {
      console.log('[BOOKLA VALIDATE] Response missing canApply');
      return null;
    }
    console.log('[BOOKLA VALIDATE] canApply:', data.canApply);
    // TEMPORARY DEBUG4: log price-after-code + plugin details (no code/PII).
    console.log('[BOOKLA DEBUG4] validate detail:', JSON.stringify({ price: data.price, pluginNameSpace: data.pluginNameSpace, pluginResponse: data.pluginResponse }).slice(0, 800));
    return data.canApply;
  } catch {
    console.log('[BOOKLA VALIDATE] Could not parse response');
    return null;
  }
}
