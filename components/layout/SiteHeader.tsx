'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Menu, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { mainNavigation, footerNavigation } from '@/content/navigation';
import MobileNav from './MobileNav';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const t = useTranslations('nav');

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container-padding mx-auto flex h-16 max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/images/logo.png"
                alt=""
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-pacifico text-lg text-[#3b82f6]">
              Hyvän Tuulen Sauna
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavigation.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:text-[#3b82f6]"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* CTA + Language + Mobile Menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <Link
              href={`tel:${footerNavigation.contact.phone.replace(/\s/g, '')}`}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-md text-stone-600 hover:text-[#3b82f6] hover:bg-stone-100 transition-colors"
              aria-label={t('phone')}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link href="/saunalauttaristeilyt-helsingissa#boats" className="hidden sm:block">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                {t('bookNow')}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              aria-label={t('openMenu')}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
