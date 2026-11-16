import type { Locale } from './content';
import type { VibeSlug } from './pages';

export const vibeRoutes: Record<'home' | VibeSlug, Record<Locale, string>> = {
  home: { fi: '/', en: '/en/' },
  avanto: { fi: '/avanto/', en: '/en/ice-swimming-sauna-helsinki/' },
  'julkinen-sauna': { fi: '/julkinen-sauna/', en: '/en/public-sauna-helsinki/' },
  saunalauttaristeilyt: { fi: '/saunalauttaristeilyt-helsingissa/', en: '/en/sauna-boat-cruises-helsinki/' },
  tapahtumat: { fi: '/polttarit-yritystilaisuudet/', en: '/en/bachelor-parties-corporate-events-helsinki/' },
  sijainti: { fi: '/sijainti/', en: '/en/location/' },
  meista: { fi: '/toiminnastamme/', en: '/en/about/' },
  ukk: { fi: '/usein-kysyttya/', en: '/en/faq/' },
  galleria: { fi: '/galleria/', en: '/en/gallery/' },
};

const routePairs = Object.values(vibeRoutes);

export function getVibeRoute(slug: 'home' | VibeSlug, locale: Locale): string {
  return vibeRoutes[slug][locale];
}

export function getVibeBookingRoute(slug: 'avanto' | 'julkinen-sauna' | 'saunalauttaristeilyt', locale: Locale): string {
  return `${getVibeRoute(slug, locale)}#varaus`;
}

export function getVibeLanguageSwitch(pathname: string, targetLocale: Locale): string {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const pair = routePairs.find((routes) => routes.fi === normalized || routes.en === normalized);
  if (!pair) return targetLocale === 'en' ? '/en/' : '/';
  return pair[targetLocale];
}
