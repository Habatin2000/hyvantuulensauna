'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import type { Locale } from './content';

interface VibeWinterGalleryProps {
  images: { src: string; alt: string }[];
  label: string;
  locale: Locale;
}

export default function VibeWinterGallery({ images, label, locale }: VibeWinterGalleryProps) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isEn = locale === 'en';
  const isExpanded = expanded !== null;

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % images.length);
  }, [images.length]);

  const goPrevious = useCallback(() => {
    setIndex((current) => (current - 1 + images.length) % images.length);
  }, [images.length]);

  const expandNext = useCallback(() => {
    setExpanded((current) => current === null ? null : (current + 1) % images.length);
  }, [images.length]);

  const expandPrevious = useCallback(() => {
    setExpanded((current) => current === null ? null : (current - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (expanded !== null || paused || images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(goNext, 5000);
    return () => window.clearInterval(timer);
  }, [expanded, paused, images.length, goNext]);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(null);
      if (event.key === 'ArrowRight') expandNext();
      if (event.key === 'ArrowLeft') expandPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isExpanded, expandNext, expandPrevious]);

  if (images.length === 0) return null;

  const visibleImages = [0, 1, 2].map((offset) => ({
    image: images[(index + offset) % images.length],
    imageIndex: (index + offset) % images.length,
  }));
  const expandedImage = expanded === null ? null : images[expanded];

  return (
    <div
      className="vibe-julkinen-sauna-winter-gallery-content"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="vibe-julkinen-sauna-winter-gallery-grid">
        {visibleImages.map(({ image, imageIndex }) => (
          <button
            type="button"
            className="vibe-julkinen-sauna-winter-gallery-item"
            key={`${image.src}-${imageIndex}`}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setExpanded(imageIndex);
            }}
            aria-label={`${isEn ? 'Expand image' : 'Laajenna kuva'}: ${image.alt}`}
          >
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 50vw, 33vw" />
            <span className="vibe-boat-gallery-expand" aria-hidden="true"><Maximize2 size={19} /></span>
          </button>
        ))}
      </div>

      <div className="vibe-boat-gallery-controls">
        <button type="button" onClick={goPrevious} aria-label={isEn ? 'Previous images' : 'Edelliset kuvat'}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <span aria-live="polite">{index + 1} / {images.length}</span>
        <button type="button" onClick={goNext} aria-label={isEn ? 'Next images' : 'Seuraavat kuvat'}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      {expandedImage && (
        <div className="vibe-boat-lightbox" role="dialog" aria-modal="true" aria-label={label} onClick={() => setExpanded(null)}>
          <button ref={closeButtonRef} type="button" className="vibe-boat-lightbox-close" onClick={() => setExpanded(null)} aria-label={isEn ? 'Close gallery' : 'Sulje galleria'}>
            <X size={26} aria-hidden="true" />
          </button>
          <button type="button" onClick={(event) => { event.stopPropagation(); expandPrevious(); }} aria-label={isEn ? 'Previous image' : 'Edellinen kuva'}>
            <ChevronLeft size={32} aria-hidden="true" />
          </button>
          <div className="vibe-boat-lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <Image key={expandedImage.src} src={expandedImage.src} alt={expandedImage.alt} fill sizes="100vw" />
            <p>{label} · {(expanded ?? 0) + 1} / {images.length}</p>
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); expandNext(); }} aria-label={isEn ? 'Next image' : 'Seuraava kuva'}>
            <ChevronRight size={32} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
