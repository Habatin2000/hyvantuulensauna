'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import type { Locale } from './content';

const galleryCopy = {
  fi: {
    expandImage: 'Laajenna kuva',
    previousImage: 'Edellinen kuva',
    nextImage: 'Seuraava kuva',
    closeGallery: 'Sulje galleria',
  },
  en: {
    expandImage: 'Expand image',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    closeGallery: 'Close gallery',
  },
  es: {
    expandImage: 'Ampliar imagen',
    previousImage: 'Imagen anterior',
    nextImage: 'Imagen siguiente',
    closeGallery: 'Cerrar galería',
  },
  fr: {
    expandImage: 'Agrandir l’image',
    previousImage: 'Image précédente',
    nextImage: 'Image suivante',
    closeGallery: 'Fermer la galerie',
  },
  de: {
    expandImage: 'Bild vergrößern',
    previousImage: 'Vorheriges Bild',
    nextImage: 'Nächstes Bild',
    closeGallery: 'Galerie schließen',
  },
} as const;

interface VibeBoatGalleryProps {
  images: { src: string; alt: string }[];
  label: string;
  badge: string;
  className: string;
  sizes: string;
  locale: Locale;
}

export default function VibeBoatGallery({ images, label, badge, className, sizes, locale }: VibeBoatGalleryProps) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const current = images[index];
  const copy = galleryCopy[locale];

  const goNext = useCallback(() => {
    setIndex((currentIndex) => (currentIndex + 1) % images.length);
  }, [images.length]);

  const goPrevious = useCallback(() => {
    setIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (expanded || paused || images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(goNext, 5000);
    return () => window.clearInterval(timer);
  }, [expanded, paused, images.length, goNext]);

  useEffect(() => {
    if (!expanded) return;

    const previousOverflow = document.body.style.overflow;
    const expandButton = expandButtonRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false);
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      expandButton?.focus();
    };
  }, [expanded, goNext, goPrevious]);

  if (!current) return null;

  return (
    <div
      className={`${className} vibe-boat-gallery`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button
        ref={expandButtonRef}
        type="button"
        className="vibe-boat-gallery-main"
        onClick={() => setExpanded(true)}
        aria-label={`${copy.expandImage}: ${current.alt}`}
      >
        <Image key={current.src} src={current.src} alt={current.alt} fill sizes={sizes} />
        <span className="vibe-boat-gallery-expand" aria-hidden="true"><Maximize2 size={19} /></span>
      </button>

      <span>{badge}</span>

      <div className="vibe-boat-gallery-controls">
        <button type="button" onClick={goPrevious} aria-label={copy.previousImage}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <span aria-live="polite">{index + 1} / {images.length}</span>
        <button type="button" onClick={goNext} aria-label={copy.nextImage}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      {expanded && (
        <div className="vibe-boat-lightbox" role="dialog" aria-modal="true" aria-label={label} onClick={() => setExpanded(false)}>
          <button ref={closeButtonRef} type="button" className="vibe-boat-lightbox-close" onClick={() => setExpanded(false)} aria-label={copy.closeGallery}>
            <X size={26} aria-hidden="true" />
          </button>
          <button type="button" className="vibe-boat-lightbox-previous" onClick={(event) => { event.stopPropagation(); goPrevious(); }} aria-label={copy.previousImage}>
            <ChevronLeft size={32} aria-hidden="true" />
          </button>
          <div className="vibe-boat-lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" />
            <p>{label} · {index + 1} / {images.length}</p>
          </div>
          <button type="button" className="vibe-boat-lightbox-next" onClick={(event) => { event.stopPropagation(); goNext(); }} aria-label={copy.nextImage}>
            <ChevronRight size={32} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
