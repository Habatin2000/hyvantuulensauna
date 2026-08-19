/**
 * Shared Bookla API helper.
 *
 * Injects env config (BOOKLA_BASE_URL / BOOKLA_COMPANY_ID / BOOKLA_API_KEY)
 * and the X-API-Key header, and normalizes network errors to Error.message.
 * Returns the raw Response — route-specific status handling stays in routes.
 */

export interface BooklaConfig {
  baseUrl: string;
  companyId?: string;
  apiKey?: string;
}

export function getBooklaConfig(options?: { preferBookingKey?: boolean }): BooklaConfig {
  return {
    baseUrl: process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1',
    companyId: process.env.BOOKLA_COMPANY_ID,
    apiKey: options?.preferBookingKey
      ? process.env.BOOKLA_BOOKING_API_KEY || process.env.BOOKLA_API_KEY
      : process.env.BOOKLA_API_KEY,
  };
}

export async function booklaFetch(
  path: string,
  init: RequestInit = {},
  apiKey?: string
): Promise<Response> {
  const { baseUrl, apiKey: defaultKey } = getBooklaConfig();
  const key = apiKey ?? defaultKey;
  if (!key) {
    throw new Error('Missing Bookla API key');
  }

  const headers = new Headers(init.headers);
  headers.set('X-API-Key', key);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    return await fetch(`${baseUrl}${path}`, { ...init, headers });
  } catch (err) {
    throw new Error(`Bookla request failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
