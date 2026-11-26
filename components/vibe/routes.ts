import type { Locale } from './content';
import type { VibeSlug } from './pages';

type VibeRoute = 'home' | VibeSlug | 'kiitos';

export const vibeRoutes: Record<VibeRoute, Record<Locale, string>> = {
  home: { fi: '/', en: '/en/', es: '/es/', fr: '/fr/', de: '/de/' },
  avanto: {
    fi: '/avanto/',
    en: '/en/ice-swimming-sauna-helsinki/',
    es: '/es/sauna-privada-helsinki/',
    fr: '/fr/sauna-prive-helsinki/',
    de: '/de/private-sauna-helsinki/',
  },
  'julkinen-sauna': {
    fi: '/julkinen-sauna/',
    en: '/en/public-sauna-helsinki/',
    es: '/es/sauna-publica-helsinki/',
    fr: '/fr/sauna-public-helsinki/',
    de: '/de/oeffentliche-sauna-helsinki/',
  },
  saunalauttaristeilyt: {
    fi: '/saunalauttaristeilyt-helsingissa/',
    en: '/en/sauna-boat-cruises-helsinki/',
    es: '/es/cruceros-en-sauna-helsinki/',
    fr: '/fr/croisieres-sauna-helsinki/',
    de: '/de/sauna-bootstouren-helsinki/',
  },
  tapahtumat: {
    fi: '/polttarit-yritystilaisuudet/',
    en: '/en/bachelor-parties-corporate-events-helsinki/',
    es: '/es/eventos-despedidas-empresas-helsinki/',
    fr: '/fr/evenements-helsinki/',
    de: '/de/junggesellenabschiede-firmenevents-helsinki/',
  },
  sijainti: {
    fi: '/sijainti/',
    en: '/en/location/',
    es: '/es/ubicacion/',
    fr: '/fr/acces/',
    de: '/de/standort/',
  },
  meista: {
    fi: '/toiminnastamme/',
    en: '/en/about/',
    es: '/es/sobre-nosotros/',
    fr: '/fr/a-propos/',
    de: '/de/ueber-uns/',
  },
  ukk: {
    fi: '/usein-kysyttya/',
    en: '/en/faq/',
    es: '/es/preguntas-frecuentes/',
    fr: '/fr/faq/',
    de: '/de/faq/',
  },
  galleria: {
    fi: '/galleria/',
    en: '/en/gallery/',
    es: '/es/galeria/',
    fr: '/fr/galerie/',
    de: '/de/galerie/',
  },
  kiitos: {
    fi: '/kiitos/',
    en: '/en/thank-you/',
    es: '/es/gracias/',
    fr: '/fr/merci/',
    de: '/de/danke/',
  },
};

const routePairs = Object.values(vibeRoutes);
const bookingSlugs = ['avanto', 'julkinen-sauna', 'saunalauttaristeilyt'] as const;
const normalizePathname = (pathname: string) => pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

export function getVibeRoute(slug: VibeRoute, locale: Locale): string {
  return vibeRoutes[slug][locale];
}

export function getVibeBookingRoute(slug: 'avanto' | 'julkinen-sauna' | 'saunalauttaristeilyt', locale: Locale): string {
  return `${getVibeRoute(slug, locale)}#varaus`;
}

export function isVibeBookingPathname(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  return bookingSlugs.some((slug) =>
    Object.values(vibeRoutes[slug]).some((route) => normalizePathname(route) === normalized)
  );
}

export function getVibeLanguageSwitch(pathname: string, targetLocale: Locale): string {
  const normalized = normalizePathname(pathname);
  const pair = routePairs.find((routes) =>
    Object.values(routes).some((route) => normalizePathname(route) === normalized)
  );
  return pair?.[targetLocale] ?? vibeRoutes.home[targetLocale];
}
