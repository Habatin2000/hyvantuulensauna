'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { getCookie, setCookie } from '@/lib/cookies';

/**
 * ConsentBanner — GDPR/EU-compliant cookie consent banner.
 *
 * Behavior:
 * - On first visit (no cookie): shows banner, analytics tags are blocked.
 * - On "Accept": grants ad_storage + analytics_storage, hides banner.
 * - On "Decline": keeps defaults denied, hides banner.
 * - Choice persists for 365 days via cookie.
 *
 * NOTE: gtag('consent', 'default', ...) is already set in app/layout.tsx
 * <head> before any gtag('config', ...) calls. This component only handles
 * the update call after user interaction.
 */

function updateGtagConsent(granted: boolean) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  });
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const isEn = locale === 'en';

  useEffect(() => {
    const consent = getCookie('analytics_consent');
    if (consent === 'granted') {
      updateGtagConsent(true);
    } else if (consent === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard: banner visibility must be set after mount to avoid SSR/CSR mismatch
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('analytics_consent', 'granted', 365);
    updateGtagConsent(true);
    setVisible(false);
  };

  const handleDecline = () => {
    setCookie('analytics_consent', 'denied', 365);
    updateGtagConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900 text-white p-4 shadow-2xl">
      <div className="container-padding mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm leading-relaxed">
          {isEn
            ? 'We use cookies and analytics to improve your experience. By accepting, you allow Google Analytics and Google Ads tracking.'
            : 'Käytämme evästeitä ja analytiikkaa parantaaksemme käyttökokemusta. Hyväksymällä sallit Google Analytics - ja Google Ads -seurannan.'}
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-stone-600 px-4 py-2 text-sm font-medium text-stone-300 hover:bg-stone-800 transition-colors"
          >
            {isEn ? 'Decline' : 'Hylkää'}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] transition-colors"
          >
            {isEn ? 'Accept' : 'Hyväksy'}
          </button>
        </div>
      </div>
    </div>
  );
}
