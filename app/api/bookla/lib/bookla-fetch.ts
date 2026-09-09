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

  // 15s timeout + one retry on network-level failure. Bookla occasionally
  // hangs or blips; without this, transient failures surface as 500s and
  // hung requests pile up. Only used for read/query calls — booking creation
  // deliberately uses its own fetch (no retry, no double-booking risk).
  const TIMEOUT_MS = 15000;
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await fetch(`${baseUrl}${path}`, {
        ...init,
        headers,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      lastError = err;
      console.log(`[BOOKLA FETCH] attempt ${attempt + 1} failed:`, err instanceof Error ? err.message : err);
    }
  }
  throw new Error(`Bookla request failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}
