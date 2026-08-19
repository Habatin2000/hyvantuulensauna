'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('nav');

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.7;
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-3 mb-3 rounded-2xl border border-white/20 bg-stone-900/80 backdrop-blur-xl p-2 shadow-2xl shadow-black/30">
        <div className="flex gap-2">
          <Link
            href="/saunalauttaristeilyt-helsingissa#boats"
            className="flex-1 rounded-xl bg-white/10 px-3 py-2.5 text-center text-xs font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('private')}
          </Link>
          <Link
            href="/julkinen-sauna#varaus"
            className="flex-1 rounded-xl bg-[#3b82f6] px-3 py-2.5 text-center text-xs font-semibold text-white shadow-lg shadow-[#3b82f6]/30 transition-all hover:bg-[#2563eb] hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('public')}
          </Link>
        </div>
      </div>
    </div>
  );
}
