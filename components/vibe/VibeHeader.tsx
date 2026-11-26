'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import type { Locale } from './content';
import { getVibeBookingRoute, getVibeLanguageSwitch, getVibeRoute, isVibeBookingPathname } from './routes';

const locales: Locale[] = ['fi', 'en', 'es', 'fr', 'de'];
const languageNames: Record<Locale, string> = {
  fi: 'Suomi',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

const headerCopy: Record<Locale, {
  home: string;
  mainNavigation: string;
  mobileNavigation: string;
  languageSelector: string;
  book: string;
  mobileBook: string;
  openMenu: string;
  closeMenu: string;
}> = {
  fi: {
    home: 'Etusivu',
    mainNavigation: 'Päävalikko',
    mobileNavigation: 'Mobiilivalikko',
    languageSelector: 'Valitse kieli',
    book: 'Varaa sauna',
    mobileBook: 'Varaa yksityinen sauna',
    openMenu: 'Avaa valikko',
    closeMenu: 'Sulje valikko',
  },
  en: {
    home: 'Home',
    mainNavigation: 'Main navigation',
    mobileNavigation: 'Mobile navigation',
    languageSelector: 'Select language',
    book: 'Book a sauna',
    mobileBook: 'Book a private sauna',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  es: {
    home: 'Inicio',
    mainNavigation: 'Navegación principal',
    mobileNavigation: 'Navegación móvil',
    languageSelector: 'Seleccionar idioma',
    book: 'Reservar',
    mobileBook: 'Reservar una sauna privada',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  fr: {
    home: 'Accueil',
    mainNavigation: 'Navigation principale',
    mobileNavigation: 'Navigation mobile',
    languageSelector: 'Choisir la langue',
    book: 'Réserver',
    mobileBook: 'Réserver un sauna privé',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  de: {
    home: 'Startseite',
    mainNavigation: 'Hauptnavigation',
    mobileNavigation: 'Mobile Navigation',
    languageSelector: 'Sprache auswählen',
    book: 'Buchen',
    mobileBook: 'Private Sauna buchen',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
  },
};

export default function VibeHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const languageDetails = useRef<HTMLDetailsElement>(null);
  const c = headerCopy[locale];
  const home = getVibeRoute('home', locale);
  const bookingHref = isVibeBookingPathname(pathname) ? `${pathname}#varaus` : getVibeBookingRoute('avanto', locale);
  const links = [
    { href: `${home}#elamykset`, fi: 'Elämykset', en: 'Experiences', es: 'Experiencias', fr: 'Expériences', de: 'Erlebnisse' },
    { href: getVibeRoute('julkinen-sauna', locale), fi: 'Yleinen sauna', en: 'Public sauna', es: 'Sauna pública', fr: 'Sauna public', de: 'Öffentliche Sauna' },
    { href: `${getVibeRoute('julkinen-sauna', locale)}#sarjakortit`, fi: 'Sarjakortit', en: 'Sauna cards', es: 'Tarjetas', fr: 'Cartes', de: 'Saunakarten' },
    { href: getVibeRoute('avanto', locale), fi: 'Yksityinen sauna', en: 'Private sauna', es: 'Sauna privada', fr: 'Sauna privé', de: 'Private Sauna' },
    { href: getVibeRoute('saunalauttaristeilyt', locale), fi: 'Saunalauttaristeilyt', en: 'Sauna boat cruises', es: 'Cruceros', fr: 'Croisières', de: 'Saunafahrten' },
    { href: getVibeRoute('tapahtumat', locale), fi: 'Tapahtumat', en: 'Events', es: 'Eventos', fr: 'Événements', de: 'Events' },
    { href: getVibeRoute('sijainti', locale), fi: 'Sijainti ja info', en: 'Location & info', es: 'Ubicación', fr: 'Infos', de: 'Infos' },
  ];

  useEffect(() => {
    document.body.classList.toggle('vibe-nav-open', open);
    if (open) firstLink.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        if (languageDetails.current?.open) {
          languageDetails.current.open = false;
          languageDetails.current.querySelector('summary')?.focus();
        }
      }
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
        <Link href={home} className="vibe-brand" aria-label={c.home}>
          <Image src="/images/logo.png" alt="" width={42} height={42} priority />
          <span>Hyvän Tuulen Sauna</span>
        </Link>
        <nav className="vibe-desktop-nav" aria-label={c.mainNavigation}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>{link[locale]}</a>
          ))}
        </nav>
        <div className="vibe-header-actions">
          <details className="vibe-language" ref={languageDetails}>
            <summary
              aria-label={c.languageSelector}
              title={c.languageSelector}
              onClick={() => setOpen(false)}
            >
              {locale.toUpperCase()}
              <ChevronDown size={13} aria-hidden="true" />
            </summary>
            <nav className="vibe-language-menu" aria-label={c.languageSelector}>
              {locales.map((option) => (
                <Link
                  key={option}
                  className="vibe-language-option"
                  href={getVibeLanguageSwitch(pathname, option)}
                  hrefLang={option}
                  lang={option}
                  aria-current={option === locale ? 'page' : undefined}
                  onClick={() => {
                    setOpen(false);
                    if (languageDetails.current) languageDetails.current.open = false;
                  }}
                >
                  <span>{languageNames[option]}</span>
                  <span>{option.toUpperCase()}</span>
                </Link>
              ))}
            </nav>
          </details>
          <Link className="vibe-book" href={bookingHref}>
            {c.book}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="vibe-menu-button"
            aria-label={open ? c.closeMenu : c.openMenu}
            aria-expanded={open}
            aria-controls="vibe-mobile-menu"
            onClick={() => {
              if (languageDetails.current) languageDetails.current.open = false;
              setOpen((value) => !value);
            }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div id="vibe-mobile-menu" className={`vibe-mobile-menu ${open ? 'is-open' : ''}`} inert={!open}>
        <nav aria-label={c.mobileNavigation}>
          {links.map((link, index) => (
            <a
              key={link.href}
              ref={index === 0 ? firstLink : undefined}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              <span>0{index + 1}</span>
              {link[locale]}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
          <Link href={bookingHref} onClick={() => setOpen(false)} className="vibe-mobile-book">
            {c.mobileBook}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
