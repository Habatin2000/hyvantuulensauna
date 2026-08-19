'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackPageView, trackViewContent } from '@/lib/meta';

/**
 * RouteTracker — explicit GA4 page_view for Next.js App Router.
 *
 * Why this exists:
 * - gtag.js config is loaded with send_page_view: false so the initial
 *   page_view is NOT duplicated.
 * - This component sends one page_view on initial mount and one on every
 *   client-side route change.
 * - It targets GA4 only (send_to: G-2LE9R6N8P5).
 *
 * IMPORTANT: Ensure GA4 Enhanced Measurement → "Page changes based on
 * browser history events" is DISABLED in the GA4 web stream UI. If it is
 * enabled alongside this component, you will get duplicate page_view events.
 */

export default function RouteTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sendPageView = () => {
      if (!window.gtag) {
        // Retry once after a short delay in case gtag library is still loading
        setTimeout(sendPageView, 200);
        return;
      }
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
        send_to: 'G-2LE9R6N8P5',
      });
    };

    sendPageView();

    // Meta Pixel PageView on every route change (initial PageView is fired by base code)
    trackPageView();
    trackViewContent({ content_name: pathname || 'unknown' });

    // After the first render, mark as done
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [pathname]);

  return null;
}
