/**
 * Meta Pixel event helpers.
 *
 * These wrap window.fbq so any component can fire standard Pixel events.
 * Safe to call from client components — guards SSR and missing fbq.
 * No consent gating: Pixel base code loads unconditionally.
 * TODO(GDPR): Meta Pixel still fires without consent — gate it behind the
 * same analytics_consent choice that ConsentBanner manages for gtag.
 */

declare global {
  interface Window {
    fbq?: (
      command: 'track' | 'trackCustom',
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

function getFbq() {
  if (typeof window === 'undefined') return null;
  return window.fbq || null;
}

export function trackMeta(event: string, params?: Record<string, unknown>) {
  const fbq = getFbq();
  if (!fbq) return;
  fbq('track', event, params);
}

export function trackMetaCustom(event: string, params?: Record<string, unknown>) {
  const fbq = getFbq();
  if (!fbq) return;
  fbq('trackCustom', event, params);
}

/* ------------------------------------------------------------------ */
/* Standard events                                                    */
/* ------------------------------------------------------------------ */

export function trackPageView(params?: Record<string, unknown>) {
  trackMeta('PageView', params);
}

export function trackViewContent(params: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('ViewContent', params);
}

export function trackSearch(params: { search_string?: string } = {}) {
  trackMeta('Search', params);
}

export function trackAddToCart(params: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('AddToCart', params);
}

export function trackAddToWishlist(params: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('AddToWishlist', params);
}

export function trackInitiateCheckout(params: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('InitiateCheckout', params);
}

export function trackAddPaymentInfo(params: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('AddPaymentInfo', params);
}

export function trackPurchase(params: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  currency: string;
  value: number;
  transaction_id?: string;
  num_items?: number;
} = { currency: 'EUR', value: 0 }) {
  trackMeta('Purchase', params);
}

export function trackLead(params: {
  content_name?: string;
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('Lead', params);
}

export function trackCompleteRegistration(params: {
  content_name?: string;
  status?: string;
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('CompleteRegistration', params);
}

export function trackContact(params: { content_name?: string } = {}) {
  trackMeta('Contact', params);
}

export function trackCustomizeProduct(params: {
  content_name?: string;
  content_ids?: string[];
} = {}) {
  trackMeta('CustomizeProduct', params);
}

export function trackDonate(params: { currency?: string; value?: number } = {}) {
  trackMeta('Donate', params);
}

export function trackFindLocation(params: { content_name?: string } = {}) {
  trackMeta('FindLocation', params);
}

export function trackSchedule(params: {
  content_name?: string;
  content_ids?: string[];
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('Schedule', params);
}

export function trackStartTrial(params: {
  currency?: string;
  value?: number;
} = {}) {
  trackMeta('StartTrial', params);
}

export function trackSubmitApplication(params: { content_name?: string } = {}) {
  trackMeta('SubmitApplication', params);
}

export function trackSubscribe(params: {
  currency?: string;
  value?: number;
  content_name?: string;
} = {}) {
  trackMeta('Subscribe', params);
}
