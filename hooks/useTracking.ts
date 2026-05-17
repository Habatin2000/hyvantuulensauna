'use client';

import { getConsent } from '@/components/CookieConsent';

const IS_DEV = process.env.NODE_ENV === 'development';

function log(...args: any[]) {
  if (IS_DEV) console.log('[Tracking]', ...args);
}

/**
 * Push an event to Google Analytics dataLayer
 * Only works if analytics consent is granted
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) return;

  const consent = getConsent();
  if (!consent.analytics) {
    log('Analytics not consented, skipping event:', eventName);
    return;
  }

  const payload = {
    event: eventName,
    ...params,
  };

  window.dataLayer.push(payload);
  log('Event tracked:', eventName, params);
}

/**
 * Track a Google Ads conversion via Google Tag
 * Only works if marketing consent is granted
 */
export function trackConversion(label?: string, value?: number) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  const consent = getConsent();
  if (!consent.marketing) {
    log('Marketing not consented, skipping conversion');
    return;
  }

  const conversionId = process.env.NEXT_PUBLIC_GADS_CONVERSION_ID;
  const conversionLabel = label || process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL;
  
  if (!conversionId) {
    log('No Google Ads Conversion ID configured');
    return;
  }

  // Build send_to parameter
  const sendTo = conversionLabel 
    ? `${conversionId}/${conversionLabel}` 
    : conversionId;

  // Send conversion event through gtag
  window.gtag('event', 'conversion', {
    send_to: sendTo,
    value: value || 0,
    currency: 'EUR',
  });

  log('Conversion tracked:', conversionLabel, 'value:', value);
}

/**
 * Track Meta Pixel event
 * Only works if marketing consent is granted
 */
export function trackMetaEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;

  const consent = getConsent();
  if (!consent.marketing) {
    log('Marketing not consented, skipping Meta event:', eventName);
    return;
  }

  window.fbq('track', eventName, params);
  log('Meta event tracked:', eventName, params);
}

/**
 * Track a booking conversion across all platforms
 */
export function trackBookingConversion(bookingValue?: number) {
  const value = bookingValue || 0;

  // Google Analytics (via dataLayer → Google Tag)
  trackEvent('booking_success', {
    currency: 'EUR',
    value: value,
  });

  // Google Ads (via gtag → Google Tag)
  trackConversion(undefined, value);

  // Meta Pixel
  trackMetaEvent('Purchase', {
    currency: 'EUR',
    value: value,
  });
}

/**
 * Track a page view (useful for SPA navigation)
 */
export function trackPageView(pagePath?: string, pageTitle?: string) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  const consent = getConsent();
  if (!consent.analytics) return;

  window.gtag('event', 'page_view', {
    page_title: pageTitle || document.title,
    page_location: pagePath || window.location.href,
    send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  });

  log('Page view tracked:', pagePath || window.location.pathname);
}
