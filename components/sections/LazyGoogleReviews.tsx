'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const GoogleReviews = dynamic(() => import('./GoogleReviews'), { ssr: false });

// Defers the Featurable widget (and its autoplaying carousel JS) until the
// section is scrolled near the viewport.
export default function LazyGoogleReviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <GoogleReviews />
      ) : (
        // Placeholder roughly matching the widget height to limit layout shift
        <div className="min-h-[420px] bg-stone-50" aria-hidden="true" />
      )}
    </div>
  );
}
