'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface SquareGalleryProps {
  images: GalleryImage[];
  title?: string;
}

export default function SquareGallery({ images, title }: SquareGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) return null;

  // Duplicate images for infinite loop effect
  const duplicatedImages = [...images, ...images];

  return (
    <section className="py-8 bg-stone-50">
      <div className="container-padding mx-auto max-w-7xl">
        {title && (
          <h2 className="mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl">
            {title}
          </h2>
        )}
        
        <div className="relative">
          {/* Image Carousel with smooth sliding */}
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
            >
              {duplicatedImages.map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="relative aspect-square w-1/2 md:w-1/4 flex-shrink-0 p-2"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl shadow-md">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 4 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-lg transition-all hover:bg-white hover:scale-105"
                aria-label="Edellinen"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-lg transition-all hover:bg-white hover:scale-105"
                aria-label="Seuraava"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {images.length > 4 && (
            <div className="mt-4 flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-[#3b82f6] w-6' : 'bg-stone-300 w-2 hover:bg-stone-400'
                  }`}
                  aria-label={`Siirry kuvaan ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
