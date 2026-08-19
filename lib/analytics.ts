/**
 * GA4 / gtag.js analytics helpers.
 *
 * These functions send events directly via gtag.js (no GTM container).
 * They are safe to call from any client component — each helper guards
 * against SSR and missing window.gtag.
 *
 * NOTE: Google Ads conversion events (components/analytics/GoogleConversion.tsx)
 * are intentionally kept separate. GA4 purchase / begin_checkout and Ads
 * conversion events serve different reporting purposes and can fire side by side.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function getGtag() {
  if (typeof window === "undefined") return null;
  return window.gtag || null;
}

/* ------------------------------------------------------------------ */
/* Consent                                                            */
/* ------------------------------------------------------------------ */

export function updateConsentOnAccept() {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("consent", "update", {
    ad_storage: "granted",
    analytics_storage: "granted",
  });
}

/* ------------------------------------------------------------------ */
/* Booking funnel                                                     */
/* ------------------------------------------------------------------ */

export function trackBookingStarted(
  params: { value?: number; currency?: string } = {}
) {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", "begin_checkout", {
    send_to: "G-2LE9R6N8P5",
    ...params,
  });
}

export function trackBookingCompleted(params: {
  value: number;
  currency: string;
  transaction_id: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    price?: number;
    quantity?: number;
  }>;
}) {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", "purchase", {
    send_to: "G-2LE9R6N8P5",
    ...params,
  });
}

/* ------------------------------------------------------------------ */
/* Lead / form                                                        */
/* ------------------------------------------------------------------ */

export function trackLead(params: { form_name: string }) {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", "generate_lead", {
    send_to: "G-2LE9R6N8P5",
    ...params,
  });
}

/* ------------------------------------------------------------------ */
/* Generic page_view (used by RouteTracker)                           */
/* ------------------------------------------------------------------ */

export function trackPageView(params: {
  page_path: string;
  page_location: string;
  page_title: string;
}) {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", "page_view", {
    send_to: "G-2LE9R6N8P5",
    ...params,
  });
}
