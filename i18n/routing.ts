import { defineRouting } from 'next-intl/routing';

// Internal pathnames are the Finnish slugs; English gets its own slugs.
// Finnish has no entry per key on purpose: next-intl falls back to the
// internal pathname for locales without an entry.
// The map is deliberately typed as a loose Record: internal links also carry
// hash-only ('#varaus') and tel: hrefs through the navigation APIs, so strict
// pathname typing (literal keys) would reject those valid usages.
const pathnames: Record<string, string | { en: string }> = {
  '/': '/',
  '/saunalauttaristeilyt-helsingissa': { en: '/sauna-boat-cruises-helsinki' },
  '/julkinen-sauna': { en: '/public-sauna-helsinki' },
  '/yksityissauna': { en: '/private-sauna-helsinki' },
  '/sijainti': { en: '/location' },
  '/toiminnastamme': { en: '/about' },
  '/usein-kysyttya': { en: '/faq' },
  '/galleria': { en: '/gallery' },
  '/kiitos': { en: '/thank-you' },
};

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fi', 'en'],

  // Used when no locale matches
  defaultLocale: 'fi',
  localePrefix: 'as-needed',

  // Disable cookie-based locale detection so URL alone determines the language.
  // This prevents the middleware from redirecting / to /en/ after the user has
  // once visited the English version.
  localeDetection: false,

  pathnames,
});
