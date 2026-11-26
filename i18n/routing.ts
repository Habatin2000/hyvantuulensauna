import { defineRouting } from 'next-intl/routing';

// Internal pathnames are the Finnish slugs; every other locale has public slugs.
// Finnish has no entry per key on purpose: next-intl falls back to the
// internal pathname for locales without an entry.
// The map is deliberately typed as a loose Record: internal links also carry
// hash-only ('#varaus') and tel: hrefs through the navigation APIs, so strict
// pathname typing (literal keys) would reject those valid usages.
const pathnames: Record<string, string | { en: string; es: string; fr: string; de: string }> = {
  '/': '/',
  '/saunalauttaristeilyt-helsingissa': {
    en: '/sauna-boat-cruises-helsinki',
    es: '/cruceros-en-sauna-helsinki',
    fr: '/croisieres-sauna-helsinki',
    de: '/sauna-bootstouren-helsinki',
  },
  '/julkinen-sauna': {
    en: '/public-sauna-helsinki',
    es: '/sauna-publica-helsinki',
    fr: '/sauna-public-helsinki',
    de: '/oeffentliche-sauna-helsinki',
  },
  '/avanto': {
    en: '/ice-swimming-sauna-helsinki',
    es: '/sauna-privada-helsinki',
    fr: '/sauna-prive-helsinki',
    de: '/private-sauna-helsinki',
  },
  '/polttarit-yritystilaisuudet': {
    en: '/bachelor-parties-corporate-events-helsinki',
    es: '/eventos-despedidas-empresas-helsinki',
    fr: '/evenements-helsinki',
    de: '/junggesellenabschiede-firmenevents-helsinki',
  },
  '/sijainti': {
    en: '/location',
    es: '/ubicacion',
    fr: '/acces',
    de: '/standort',
  },
  '/toiminnastamme': {
    en: '/about',
    es: '/sobre-nosotros',
    fr: '/a-propos',
    de: '/ueber-uns',
  },
  '/usein-kysyttya': {
    en: '/faq',
    es: '/preguntas-frecuentes',
    fr: '/faq',
    de: '/faq',
  },
  '/galleria': {
    en: '/gallery',
    es: '/galeria',
    fr: '/galerie',
    de: '/galerie',
  },
  '/kiitos': {
    en: '/thank-you',
    es: '/gracias',
    fr: '/merci',
    de: '/danke',
  },
};

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fi', 'en', 'es', 'fr', 'de'],

  // Used when no locale matches
  defaultLocale: 'fi',
  localePrefix: 'as-needed',

  // Disable cookie-based locale detection so URL alone determines the language.
  // This prevents the middleware from redirecting / to /en/ after the user has
  // once visited the English version.
  localeDetection: false,

  pathnames,
});
