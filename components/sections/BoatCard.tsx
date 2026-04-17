'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Flame, Ruler, Utensils, ChevronDown, ChevronUp, Check, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

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
  idealFor: string[];
  imageOffset?: string;
  onBookClick?: () => void;
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
  idealFor,
  imageOffset,
  onBookClick,
}: BoatCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <Card className="overflow-hidden border-stone-200">
      {/* Lightbox / Fullscreen */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Sulje"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white font-medium">
            {selectedImage + 1} / {images.length}
          </div>

          {/* Prev button */}
          <button
            onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Edellinen"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Next button */}
          <button
            onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Seuraava"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Main lightbox image */}
          <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4">
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-full overflow-x-auto px-4 py-2">
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

      {/* Main Image / Gallery */}
      <div className="relative">
        <div 
          className="relative aspect-[16/9] overflow-hidden cursor-pointer group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: imageOffset || 'center' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
          
          {/* Gallery Grid when expanded */}
          {galleryOpen && (
            <div className="absolute inset-0 bg-black/80 p-3" onClick={(e) => e.stopPropagation()}>
              <div className="grid h-full grid-cols-4 grid-rows-2 gap-1.5">
                {images.slice(0, 8).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setSelectedImage(index);
                      setLightboxOpen(true);
                    }}
                    className={`relative overflow-hidden rounded-md ${
                      selectedImage === index ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery Toggle Button */}
        <button
          onClick={() => setGalleryOpen(!galleryOpen)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-stone-800 shadow-lg transition-all hover:bg-white"
        >
          {galleryOpen ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Sulje
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              {images.length} kuvaa
            </>
          )}
        </button>
      </div>

      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-stone-900">{name}</h3>
        </div>

        {/* Description */}
        <div className="mb-4 space-y-2">
          {description.split('\n\n').slice(0, 2).map((paragraph, index) => (
            <p key={index} className="text-sm text-stone-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Itinerary */}
        {itinerary && (
          <div className="mb-4 rounded-lg bg-[#3b82f6]/5 p-3 border border-[#3b82f6]/10">
            <p className="text-xs font-semibold text-[#3b82f6] uppercase tracking-wider mb-2">
              Matkasuunnitelma
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              {itinerary}
            </p>
          </div>
        )}

        {/* Specs - tighter grid */}
        <div className="mb-4 grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center rounded-lg bg-stone-50 p-2 text-center">
            <Users className="h-4 w-4 text-[#3b82f6] mb-1" />
            <p className="text-xs font-semibold text-stone-900">{specs.maxPeople}</p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-stone-50 p-2 text-center">
            <Flame className="h-4 w-4 text-[#3b82f6] mb-1" />
            <p className="text-xs font-semibold text-stone-900">{specs.kiuas}</p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-stone-50 p-2 text-center">
            <Ruler className="h-4 w-4 text-[#3b82f6] mb-1" />
            <p className="text-xs font-semibold text-stone-900">{specs.length}</p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-stone-50 p-2 text-center">
            <Utensils className="h-4 w-4 text-[#3b82f6] mb-1" />
            <p className="text-xs font-semibold text-stone-900">{specs.grill}</p>
          </div>
        </div>

        {/* Features - compact */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {features.slice(0, 4).map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1 rounded-full bg-[#3b82f6]/10 px-2 py-0.5 text-xs text-[#3b82f6]"
              >
                <Check className="h-3 w-3" />
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Ideal for - compact */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {idealFor.slice(0, 3).map((item) => (
              <Badge key={item} variant="secondary" className="bg-stone-100 text-stone-700 hover:bg-stone-100 text-xs px-2 py-0.5">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between border-t border-stone-200 pt-4">
          <div>
            <p className="text-2xl font-bold text-stone-900">{pricing.basePrice}€</p>
            <p className="text-xs text-stone-500">/{pricing.unit} (min. 3h)</p>
          </div>
          <Button 
            size="lg"
            onClick={onBookClick}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Varaa nyt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
