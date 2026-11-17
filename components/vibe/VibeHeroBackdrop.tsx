'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const images = [
  { src: '/images/gallery-sauna-group.webp', alt: '' },
  { src: '/images/gallery-sauna-interior.webp', alt: '' },
  { src: '/images/gallery-ice-swimming.webp', alt: '' },
  { src: '/images/gallery-winter-dock.webp', alt: '' },
  { src: '/images/vibe-hero-upright.webp', alt: '' },
];

export default function VibeHeroBackdrop() {
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [inView, setInView] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setPreviousIndex(index);
      setIndex((index + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [index, inView]);

  useEffect(() => {
    if (previousIndex === null) return;
    const timer = window.setTimeout(() => setPreviousIndex(null), 1000);
    return () => window.clearTimeout(timer);
  }, [previousIndex]);

  return (
    <div ref={rootRef} className="vibe-hero-backdrop" aria-hidden="true">
      {previousIndex !== null && (
        <Image className="vibe-hero-backdrop-image is-visible" src={images[previousIndex].src} alt="" fill sizes="100vw" />
      )}
      <Image
        key={images[index].src}
        className="vibe-hero-backdrop-image is-visible"
        src={images[index].src}
        alt=""
        fill
        priority={index === 0}
        sizes="100vw"
      />
    </div>
  );
}
