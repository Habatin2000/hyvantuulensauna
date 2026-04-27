import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';

interface FinalCTAProps {
  title: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  variant?: 'light' | 'dark';
}

export default function FinalCTA({ 
  title, 
  description, 
  primaryCta, 
  secondaryCta,
  variant = 'dark' 
}: FinalCTAProps) {
  const isDark = variant === 'dark';

  return (
    <section className={`section-padding ${isDark ? 'bg-[#2563eb]' : 'bg-stone-100'}`}>
      <div className="container-padding mx-auto max-w-4xl text-center">
        <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-stone-900'}`}>
          {title}
        </h2>
        <p className={`mt-4 text-lg ${isDark ? 'text-stone-200' : 'text-stone-600'}`}>
          {description}
        </p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={primaryCta.href}>
            <Button 
              size="lg" 
              className={`font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ${isDark 
                ? 'bg-white text-[#3b82f6] hover:bg-stone-100' 
                : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
              }`}
            >
              {primaryCta.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          {secondaryCta && (
            <Link href={secondaryCta.href}>
              <Button 
                size="lg" 
                className={`font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${isDark 
                  ? 'bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#3b82f6]' 
                  : 'bg-white border-2 border-stone-200 text-stone-700 hover:border-[#3b82f6] hover:text-[#3b82f6]'
                }`}
              >
                <Phone className="mr-2 h-5 w-5" />
                {secondaryCta.text}
              </Button>
            </Link>
          )}
        </div>

        {/* Sponsors */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <span className={`text-sm font-medium uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-stone-500'}`}>
            Yhteistyössä
          </span>
          <div className="flex items-center gap-8">
            <img
              src="/images/harvia-logo.png"
              alt="Harvia"
              className={`h-14 md:h-16 w-auto ${isDark ? 'brightness-0 invert opacity-90' : 'opacity-80'}`}
            />
            <img
              src="/images/weber-logo.png"
              alt="Weber"
              className={`h-14 md:h-16 w-auto ${isDark ? 'brightness-0 invert opacity-90' : 'opacity-80'}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
