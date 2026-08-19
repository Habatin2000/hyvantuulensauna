'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";
import { Star } from 'lucide-react';

export default function GoogleReviews() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const isEn = locale === 'en';

  useEffect(() => {
    const container = widgetRef.current;
    if (!container) return;

    // The third-party Featurable widget renders outside React, so its markup
    // can't be fixed at the source. Still needed: patch missing aria-labels
    // and avatar alt attributes after it renders (and on later DOM changes).
    const patchAccessibility = () => {
      // Featurable widget uses aria-description, but Lighthouse wants aria-label
      container.querySelectorAll('button[aria-description]:not([aria-label])').forEach((btn) => {
        const desc = btn.getAttribute('aria-description');
        if (desc) btn.setAttribute('aria-label', desc);
      });
      // Reviewer avatars load without alt text
      container.querySelectorAll('img:not([alt])').forEach((img) => {
        img.setAttribute('alt', '');
      });
    };

    patchAccessibility();

    const observer = new MutationObserver(patchAccessibility);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-stone-50">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
              {isEn ? 'Customer reviews' : 'Asiakasarvostelut'}
            </span>
          </div>
          <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
            {isEn ? 'What our customers say' : 'Mitä asiakkaamme sanovat'}
          </h2>
          <p className="mt-3 text-stone-600">
            {isEn ? 'See all reviews on our' : 'Katso kaikki arvostelut'}{' '}
            <a 
              href="https://g.co/kgs/8YJkG5p" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              {isEn ? 'Google Business Profile' : 'Google Business Profiilistamme'}
            </a>
          </p>
        </div>
        
        <div ref={widgetRef} className="relative min-h-[420px] overflow-hidden">
          <ReactGoogleReviews
            layout="carousel"
            featurableId="e7dc207d-e31b-44a3-b616-7c576651271f"
            carouselAutoplay={true}
            carouselSpeed={5000}
            maxItems={3}
            reviewVariant="card"
            theme="light"
          />
        </div>
      </div>
      
      {/* Custom styles for Featurable widget */}
      <style jsx global>{`
        .featurable-carousel {
          --featurable-primary: #3b82f6;
        }
        .featurable-carousel .featurable-review-card {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }
      `}</style>
    </section>
  );
}
