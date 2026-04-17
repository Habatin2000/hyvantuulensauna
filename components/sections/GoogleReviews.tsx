'use client';

import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";
import { Star } from 'lucide-react';

export default function GoogleReviews() {
  return (
    <section className="py-16 bg-stone-50">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium uppercase tracking-wider text-[#3b82f6]">
              Asiakasarvostelut
            </span>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
            Mitä asiakkaamme sanovat
          </h2>
          <p className="mt-3 text-stone-600">
            Katso kaikki arvostelut{' '}
            <a 
              href="https://g.co/kgs/8YJkG5p" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#3b82f6] hover:underline"
            >
              Google Business Profiilistamme
            </a>
          </p>
        </div>
        
        <div className="relative">
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
