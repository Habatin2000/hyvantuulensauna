import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroContent } from '@/types';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  content: HeroContent;
  variant?: 'homepage' | 'page';
  banner?: string;
  ctaColor?: 'teal' | 'yellow';
}

export default function HeroSection({ 
  content, 
  variant = 'homepage',
  banner,
  ctaColor = 'teal'
}: HeroSectionProps) {
  const ctaClasses = ctaColor === 'yellow'
    ? 'bg-amber-500 hover:bg-amber-600 text-white'
    : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white';

  if (variant === 'homepage') {
    return (
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={content.image}
            alt={content.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
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
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-amber-400">
              {content.subtitle}
            </p>
            <h1 className="font-corben text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mt-6 text-base text-stone-200 sm:text-lg md:text-xl leading-relaxed">
              {content.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={content.ctaHref}>
                <Button 
                  size="lg" 
                  className={`${ctaClasses} text-base px-8 font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300`}
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

        {/* Sponsor strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/30 backdrop-blur-sm">
          <div className="container-padding mx-auto max-w-7xl py-3 flex flex-wrap items-center justify-center md:justify-end gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-white/60">
              Yhteistyössä:
            </span>
            <div className="flex items-center gap-4">
              <img
                src="/images/harvia-logo.png"
                alt="Harvia"
                className="h-10 md:h-12 w-auto brightness-0 invert opacity-80"
              />
              <img
                src="/images/weber-logo.png"
                alt="Weber"
                className="h-10 md:h-12 w-auto brightness-0 invert opacity-80"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Page variant - with background image and banner support
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.image}
          alt={content.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
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

      <div className="container-padding relative z-10 mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-amber-400">
            {content.subtitle}
          </p>
          <h1 className="font-corben text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-lg text-stone-100">
            {content.description}
          </p>
          <div className="mt-8">
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
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/30 backdrop-blur-sm">
        <div className="container-padding mx-auto max-w-7xl py-3 flex flex-wrap items-center justify-center md:justify-end gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-white/60">
            Yhteistyössä:
          </span>
          <div className="flex items-center gap-4">
            <img
              src="/images/harvia-logo.png"
              alt="Harvia"
              className="h-10 md:h-12 w-auto brightness-0 invert opacity-80"
            />
            <img
              src="/images/weber-logo.png"
              alt="Weber"
              className="h-10 md:h-12 w-auto brightness-0 invert opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
