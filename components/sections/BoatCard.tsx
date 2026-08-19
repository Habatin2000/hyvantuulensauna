'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Flame, Ruler, Utensils, Check, X, ChevronLeft, ChevronRight, ChevronDown, Maximize2 } from 'lucide-react';
import { useModalA11y } from '@/hooks/useModalA11y';

interface BoatImage {
  id: string;
  src: string;
  alt: string;
}

interface BoatCardProps {
  id: string;
  name: string;
  tagline: string;
  description: string;
  itinerary: string;
  specs: {
    maxPeople: string;
    kiuas: string;
    length: string;
    grill: string;
  };
  features: string[];
  images: BoatImage[];
  pricing: {
    basePrice: number;
    currency: string;
    unit: string;
  };
  priceNote?: string;
  pricingLabel?: ReactNode;
  idealFor: string[];
  imageOffset?: string;
  onBookClick?: () => void;
  compact?: boolean;
}

export default function BoatCard({
  name,
  tagline,
  description,
  itinerary,
  specs,
  features,
  images,
  pricing,
  priceNote,
  pricingLabel,
  idealFor,
  imageOffset,
  onBookClick,
  compact = false,
}: BoatCardProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const locale = useLocale();
  const isEn = locale === 'en';
  const lightboxRef = useModalA11y<HTMLDivElement>(
    lightboxOpen,
    () => setLightboxOpen(false),
    'button[aria-label]',
  );

  return (
    <>
      <Card className="group min-w-0 overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-lg shadow-stone-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-stone-900/10">
        {/* Main image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ objectPosition: imageOffset || 'center' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 hover:bg-black/20"
            aria-label={isEn ? 'Open image gallery' : 'Avaa kuvagalleria'}
          >
            <Maximize2 className="h-8 w-8 text-white opacity-0 drop-shadow-lg transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>

        {/* Thumbnail strip */}
        {!compact && (
          <div className="flex gap-2 overflow-x-auto border-b border-stone-100 bg-stone-50 px-4 py-3">
            {images.slice(0, 8).map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                  selectedImage === index
                    ? 'ring-2 ring-amber-500 ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        <CardContent className={compact ? 'p-4' : 'p-6 md:p-8'}>
          {/* Tagline + name */}
          <div className={compact ? 'mb-2' : 'mb-4'}>
            <p className="mb-1 break-words text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 md:text-xs">
              {tagline}
            </p>
            <h3 className={`break-words font-bold text-stone-900 ${compact ? 'text-lg' : 'text-2xl md:text-3xl'}`}>
              {name}
            </h3>
          </div>

          {/* Description */}
          <div className={compact ? 'mb-3' : 'mb-5'}>
            {description.split('\n\n').slice(0, compact ? 1 : 2).map((paragraph, index) => (
              <p
                key={index}
                className={`break-words text-stone-600 leading-relaxed ${compact ? 'text-[11px] line-clamp-2' : 'text-sm md:text-base'}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Itinerary */}
          {itinerary && !compact && (
            <div className="mb-5 min-w-0">
              <button
                type="button"
                onClick={() => setShowItinerary((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-left transition-colors hover:bg-stone-100"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {isEn ? 'Itinerary' : 'Matkasuunnitelma'}
                </span>
                <ChevronDown className={`h-4 w-4 text-stone-500 transition-transform ${showItinerary ? 'rotate-180' : ''}`} />
              </button>
              {showItinerary && (
                <div className="mt-2 border-l-4 border-amber-500 bg-stone-50 p-4">
                  <p className="break-words text-sm leading-relaxed text-stone-700">
                    {itinerary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Specs */}
          <div className={`flex flex-wrap ${compact ? 'mb-3 gap-3' : 'mb-6 gap-4 md:gap-6'}`}>
            <div className="flex items-center gap-2">
              <Users className={`text-[#3b82f6] ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
              <span className={`font-medium text-stone-700 ${compact ? 'text-[10px]' : 'text-xs md:text-sm'}`}>{specs.maxPeople}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className={`text-[#3b82f6] ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
              <span className={`font-medium text-stone-700 ${compact ? 'text-[10px]' : 'text-xs md:text-sm'}`}>{specs.kiuas}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className={`text-[#3b82f6] ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
              <span className={`font-medium text-stone-700 ${compact ? 'text-[10px]' : 'text-xs md:text-sm'}`}>{specs.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className={`text-[#3b82f6] ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
              <span className={`font-medium text-stone-700 ${compact ? 'text-[10px]' : 'text-xs md:text-sm'}`}>{specs.grill}</span>
            </div>
          </div>

          {/* Features */}
          <div className={compact ? 'mb-3' : 'mb-6'}>
            <div className={`flex flex-wrap ${compact ? 'gap-1' : 'gap-2'}`}>
              {features.slice(0, compact ? 3 : 5).map((feature) => (
                <span
                  key={feature}
                  className={`inline-flex max-w-full items-center gap-1 whitespace-normal break-words rounded-full border border-amber-200 bg-amber-50 text-amber-800 ${compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs font-medium'}`}
                >
                  <Check className={compact ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Ideal for */}
          <div className={compact ? 'mb-3' : 'mb-6'}>
            <div className={`flex flex-wrap ${compact ? 'gap-1' : 'gap-2'}`}>
              {idealFor.slice(0, compact ? 2 : 3).map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className={`max-w-full whitespace-normal break-words bg-stone-100 text-stone-600 hover:bg-stone-100 ${compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className={`flex flex-col gap-3 border-t border-stone-100 sm:flex-row sm:items-center sm:justify-between ${compact ? 'pt-3' : 'pt-5'}`}>
            <div className="min-w-0">
              {pricingLabel ? (
                <div className={compact ? 'text-sm' : 'text-base'}>{pricingLabel}</div>
              ) : (
                <>
                  <p className={`break-words font-bold text-stone-900 ${compact ? 'text-xl' : 'text-3xl'}`}>
                    {pricing.basePrice}€
                  </p>
                  <p className={`text-stone-500 ${compact ? 'text-[9px]' : 'text-xs'}`}>
                    /{pricing.unit} {priceNote}
                  </p>
                </>
              )}
            </div>
            <Button
              onClick={onBookClick}
              className={`w-full bg-[#3b82f6] text-white font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-lg sm:w-auto ${compact ? 'rounded-full px-4 py-1.5 text-xs' : 'rounded-full px-6 py-3 text-sm'}`}
            >
              {isEn ? 'Book now' : 'Varaa nyt'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? `${name} image gallery` : `${name} kuvagalleria`}
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label={isEn ? 'Close' : 'Sulje'}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
            {selectedImage + 1} / {images.length}
          </div>

          <button
            onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            aria-label={isEn ? 'Previous' : 'Edellinen'}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            aria-label={isEn ? 'Next' : 'Seuraava'}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="relative h-full max-h-[85vh] w-full max-w-6xl px-4">
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 z-10 flex max-w-full -translate-x-1/2 gap-2 overflow-x-auto px-4 py-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                  selectedImage === index ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
