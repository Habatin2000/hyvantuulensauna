/**
 * First-touch attribution capture for offline (webhook) conversion tracking.
 *
 * - gclid / wbraid / gbraid from the landing URL is stored in localStorage
 *   on first visit and never overwritten (first touch wins).
 * - GA4 client_id is retrieved via gtag('get', ...) once the library has
 *   loaded and cached the same way.
 *
 * Booking flows attach this data to the Bookla booking metaData, so the
 * Bookla webhook can attribute the confirmed payment back to the original
 * ad click when firing the server-side conversion.
 */

const GCLID_KEY = 'hts_gclid';
const GACID_KEY = 'hts_gacid';
const GASID_KEY = 'hts_gasid';
const GA4_ID = 'G-2LE9R6N8P5';

export interface Attribution {
  gclid?: string;
  gaClientId?: string;
  gaSessionId?: string;
}

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const clickId =
      params.get('gclid') || params.get('wbraid') || params.get('gbraid');
    if (clickId && !localStorage.getItem(GCLID_KEY)) {
      localStorage.setItem(GCLID_KEY, clickId);
    }

    if (typeof window.gtag === 'function') {
      // GA4 client_id + session_id — both are needed so the server-side
      // webhook conversion attaches to the visitor's original session and
      // traffic source instead of starting a detached one.
      if (!localStorage.getItem(GACID_KEY)) {
        window.gtag('get', GA4_ID, 'client_id', (clientId: unknown) => {
          if (typeof clientId === 'string' && clientId) {
            try {
              localStorage.setItem(GACID_KEY, clientId);
            } catch {
              /* storage unavailable */
            }
          }
        });
      }
      if (!localStorage.getItem(GASID_KEY)) {
        window.gtag('get', GA4_ID, 'session_id', (sessionId: unknown) => {
          if (typeof sessionId === 'string' && sessionId) {
            try {
              localStorage.setItem(GASID_KEY, sessionId);
            } catch {
              /* storage unavailable */
            }
          }
        });
      }
    }
  } catch {
    /* storage unavailable */
  }
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    return {
      gclid: localStorage.getItem(GCLID_KEY) || undefined,
      gaClientId: localStorage.getItem(GACID_KEY) || undefined,
      gaSessionId: localStorage.getItem(GASID_KEY) || undefined,
    };
  } catch {
    return {};
  }
}
