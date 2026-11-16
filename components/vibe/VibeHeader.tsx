'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import type { Locale } from './content';
import { getVibeBookingRoute, getVibeLanguageSwitch, getVibeRoute } from './routes';

export default function VibeHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const isEn = locale === 'en';
  const home = getVibeRoute('home', locale);
  const hasBookingCalendar = /\/(?:avanto|julkinen-sauna|saunalauttaristeilyt-helsingissa|ice-swimming-sauna-helsinki|public-sauna-helsinki|sauna-boat-cruises-helsinki)\/?$/.test(pathname);
  const bookingHref = hasBookingCalendar ? `${pathname}#varaus` : getVibeBookingRoute('avanto', locale);
  const links = [
    { href: `${home}#elamykset`, fi: 'Elämykset', en: 'Experiences' },
    { href: getVibeRoute('julkinen-sauna', locale), fi: 'Yleinen sauna', en: 'Public sauna' },
    { href: getVibeRoute('avanto', locale), fi: 'Yksityinen sauna', en: 'Private sauna' },
    { href: getVibeRoute('saunalauttaristeilyt', locale), fi: 'Saunalauttaristeilyt', en: 'Sauna boat cruises' },
    { href: getVibeRoute('tapahtumat', locale), fi: 'Tapahtumat', en: 'Events' },
    { href: getVibeRoute('sijainti', locale), fi: 'Sijainti ja info', en: 'Location & info' },
  ];

  useEffect(() => {
    document.body.classList.toggle('vibe-nav-open', open);
    if (open) firstLink.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('vibe-nav-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="vibe-header">
      <div className="vibe-header-inner">
        <Link href={home} className="vibe-brand" aria-label={isEn ? 'Home' : 'Etusivu'}>
          <Image src="/images/logo.png" alt="" width={42} height={42} priority />
          <span>Hyvän Tuulen Sauna</span>
        </Link>
        <nav className="vibe-desktop-nav" aria-label={isEn ? 'Main navigation' : 'Päävalikko'}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>{isEn ? link.en : link.fi}</a>
          ))}
        </nav>
        <div className="vibe-header-actions">
          <Link className="vibe-language" href={getVibeLanguageSwitch(pathname, isEn ? 'fi' : 'en')}>
            {isEn ? 'FI' : 'EN'}
          </Link>
          <Link className="vibe-book" href={bookingHref}>
            {isEn ? 'Book a sauna' : 'Varaa sauna'}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="vibe-menu-button"
            aria-label={open ? (isEn ? 'Close menu' : 'Sulje valikko') : (isEn ? 'Open menu' : 'Avaa valikko')}
            aria-expanded={open}
            aria-controls="vibe-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div id="vibe-mobile-menu" className={`vibe-mobile-menu ${open ? 'is-open' : ''}`} inert={!open}>
        <nav aria-label={isEn ? 'Mobile navigation' : 'Mobiilivalikko'}>
          {links.map((link, index) => (
            <a
              key={link.href}
              ref={index === 0 ? firstLink : undefined}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              <span>0{index + 1}</span>
              {isEn ? link.en : link.fi}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
          <Link href={bookingHref} onClick={() => setOpen(false)} className="vibe-mobile-book">
            {isEn ? 'Book a private sauna' : 'Varaa yksityinen sauna'}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
