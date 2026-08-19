'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { HeroContent } from '@/types';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface HeroSectionProps {
  content: HeroContent;
  variant?: 'homepage' | 'page';
  banner?: string;
}

export default function HeroSection({ 
  content, 
  variant = 'homepage',
  banner
}: HeroSectionProps) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const ctaClasses = 'bg-[#3b82f6] hover:bg-[#2563eb] text-white';

  const heroImages = content.images && content.images.length > 0
    ? content.images
    : [content.image];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (heroImages.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length, isPaused]);

  const pauseLabel = isPaused
    ? (isEn ? 'Play slideshow' : 'Toista kuvakaruselli')
    : (isEn ? 'Pause slideshow' : 'Keskeytä kuvakaruselli');

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  if (variant === 'homepage') {
    return (
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Images Carousel with Ken Burns */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => {
            // Mount only the active slide plus the first slide (LCP) to avoid
            // downloading every hero image on page load.
            const isMounted = index === 0 || index === currentIndex;
            return (
              <div
                key={img + index}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className={`absolute inset-[-5%] transition-transform duration-[8000ms] ease-out ${
                    index === currentIndex ? 'motion-safe:scale-110' : 'scale-100'
                  }`}
                >
                  {isMounted && (
                    <Image
                      src={img}
                      alt={index === 0 ? content.title : ''}
                      fill
                      priority={index === 0}
                      className="object-cover [image-rendering:-webkit-optimize-contrast]"
                      sizes="100vw"
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/60 to-stone-900/40" />
        </div>

        {/* Marquee Banner */}
        {banner && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-black overflow-hidden py-2">
            <div className="animate-marquee flex whitespace-nowrap">
              <span className="text-white text-sm font-semibold uppercase tracking-wider mx-8">
                {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp;
              </span>
              <span className="text-white text-sm font-semibold uppercase tracking-wider mx-8">
                {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp;
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container-padding relative z-10 mx-auto max-w-7xl py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-amber-400 animate-fade-in-up">
              {content.subtitle}
            </p>
            <h1 className="font-corben text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] animate-fade-in-up animation-delay-100">
              {content.title}
            </h1>
            <p className="mt-6 text-base text-stone-200 sm:text-lg md:text-xl leading-relaxed animate-fade-in-up animation-delay-200">
              {content.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up animation-delay-300">
              <Link href={content.ctaHref}>
                <Button 
                  size="lg" 
                  className={`${ctaClasses} text-sm px-6 font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300`}
                >
                  {content.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {content.secondaryCta && (
                <Link href={content.secondaryCta.href}>
                  <Button 
                    size="lg" 
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-stone-900 transition-all duration-300 text-base px-8 font-semibold shadow-lg"
                  >
                    {content.secondaryCta.text}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
              aria-label={isEn ? 'Previous image' : 'Edellinen kuva'}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
              aria-label={isEn ? 'Next image' : 'Seuraava kuva'}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot Indicators + pause/play (WCAG 2.2.2) */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={pauseLabel}
              aria-pressed={isPaused}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/40"
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </button>
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={isEn ? `Go to image ${index + 1}` : `Siirry kuvaan ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Sponsor strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
          <div className="container-padding mx-auto max-w-7xl py-3 flex flex-wrap items-center justify-center md:justify-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-white/80">
              {isEn ? 'In cooperation with:' : 'Yhteistyössä:'}
            </span>
            <div className="flex items-center gap-4">
              <Image
                src="/images/harvia-logo.png"
                alt="Harvia"
                width={80}
                height={45}
                className="h-8 md:h-10 w-auto brightness-0 invert opacity-80"
              />
              <Image
                src="/images/weber-logo.png"
                alt="Weber"
                width={40}
                height={40}
                className="h-8 md:h-10 w-auto brightness-0 invert opacity-80"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Page variant - with background image and banner support
  return (
    <section className="relative min-h-[420px] md:min-h-[520px] py-16 md:py-24 overflow-hidden">
      {/* Background Images Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => {
          const isMounted = index === 0 || index === currentIndex;
          return (
            <div
              key={img + index}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className={`absolute inset-[-5%] transition-transform duration-[8000ms] ease-out ${
                  index === currentIndex ? 'motion-safe:scale-110' : 'scale-100'
                }`}
              >
                {isMounted && (
                  <Image
                    src={img}
                    alt={index === 0 ? content.title : ''}
                    fill
                    priority={index === 0}
                    className="object-cover [image-rendering:-webkit-optimize-contrast]"
                    sizes="100vw"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-stone-900/50" />
      </div>

      {/* Marquee Banner */}
      {banner && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-black overflow-hidden py-2">
          <div className="animate-marquee flex whitespace-nowrap">
            <span className="text-white text-sm font-semibold uppercase tracking-wider mx-8">
              {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp;
            </span>
            <span className="text-white text-sm font-semibold uppercase tracking-wider mx-8">
              {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp; {banner} &nbsp;•&nbsp;
            </span>
          </div>
        </div>
      )}

      {/* Pause/play for autoplaying carousel (WCAG 2.2.2) */}
      {heroImages.length > 1 && (
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={pauseLabel}
          aria-pressed={isPaused}
          className="absolute bottom-16 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      )}

      <div className="container-padding relative z-10 mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-amber-400">
            {content.subtitle}
          </p>
          <h1 className="font-corben text-3xl font-bold text-white sm:text-4xl md:text-[2.5rem]">
            {content.title}
            </h1>
          <p className="mt-3 text-base text-stone-100">
            {content.description}
          </p>
          <div className="mt-6">
            <Link href={content.ctaHref}>
              <Button 
                size="lg" 
                className={`${ctaClasses} text-base px-8 font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300`}
              >
                {content.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sponsor strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="container-padding mx-auto max-w-7xl py-3 flex flex-wrap items-center justify-center md:justify-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-white/80">
            {isEn ? 'In cooperation with:' : 'Yhteistyössä:'}
          </span>
          <div className="flex items-center gap-4">
            <Image
              src="/images/harvia-logo.png"
              alt="Harvia"
              width={96}
              height={54}
              className="h-10 md:h-12 w-auto brightness-0 invert opacity-80"
            />
            <Image
              src="/images/weber-logo.png"
              alt="Weber"
              width={48}
              height={48}
              className="h-10 md:h-12 w-auto brightness-0 invert opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
