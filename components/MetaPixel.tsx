'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getConsent } from './CookieConsent';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    setMarketingConsent(consent.marketing);

    const handleConsentUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setMarketingConsent(detail.marketing);
    };

    window.addEventListener('consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('consent-updated', handleConsentUpdate);
  }, []);

  // Trigger PageView when script loads or consent changes
  useEffect(() => {
    if (!marketingConsent || !scriptLoaded || typeof window === 'undefined') return;
    if (!window.fbq) return;

    window.fbq('track', 'PageView');
  }, [marketingConsent, scriptLoaded]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      {marketingConsent && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
      {/* NoScript fallback */}
      {marketingConsent && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}
