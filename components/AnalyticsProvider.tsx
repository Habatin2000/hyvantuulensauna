'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { getConsent } from './CookieConsent';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
const GADS_CONVERSION_ID = process.env.NEXT_PUBLIC_GADS_CONVERSION_ID;
const IS_DEV = process.env.NODE_ENV === 'development';

function log(...args: any[]) {
  if (IS_DEV) {
    console.log('[Analytics]', ...args);
  }
}

export default function AnalyticsProvider() {
  useEffect(() => {
    const consent = getConsent();
    log('Initial consent state:', consent);

    const handleConsentUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      log('Consent updated:', detail);

      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: detail.analytics ? 'granted' : 'denied',
          ad_storage: detail.marketing ? 'granted' : 'denied',
          ad_user_data: detail.marketing ? 'granted' : 'denied',
          ad_personalization: detail.marketing ? 'granted' : 'denied',
        });
        log('gtag consent updated');
      }
    };

    window.addEventListener('consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('consent-updated', handleConsentUpdate);
  }, []);

  if (!GOOGLE_TAG_ID) {
    log('No GOOGLE_TAG_ID configured, skipping Google Tag');
    return null;
  }

  return (
    <>
      {/* Google Tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
        onLoad={() => log('Google Tag script loaded')}
        onError={() => log('Google Tag script failed to load')}
      />
      <Script
        id="google-tag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Default consent — denied until user accepts
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
            
            // Configure Google Tag (GA4)
            gtag('config', '${GOOGLE_TAG_ID}', {
              send_page_view: false,
              ${GA_MEASUREMENT_ID ? `send_to: '${GA_MEASUREMENT_ID}',` : ''}
            });
            
            ${GADS_CONVERSION_ID ? `
            // Configure Google Ads conversion tracking
            gtag('config', '${GADS_CONVERSION_ID}');
            ` : ''}
            
            ${IS_DEV ? `console.log('[Analytics] Google Tag configured:', '${GOOGLE_TAG_ID}');` : ''}
          `,
        }}
      />
    </>
  );
}

// Extend window type for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
