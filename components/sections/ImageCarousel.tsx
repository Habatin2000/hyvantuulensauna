'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  id: string;
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  title?: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  return (
    <section className="py-8 bg-stone-50">
      <div className="container-padding mx-auto max-w-7xl">
        {title && (
          <h2 className="mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl">
            {title}
          </h2>
        )}
        
        <div className="relative mx-auto max-w-3xl">
          {/* Main Image - smaller aspect ratio */}
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-lg transition-all hover:bg-white hover:scale-105"
              aria-label="Edellinen kuva"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-lg transition-all hover:bg-white hover:scale-105"
              aria-label="Seuraava kuva"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnails - smaller */}
          <div className="mt-3 flex justify-center gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-[#3b82f6] ring-offset-2'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
