import { MetadataRoute } from 'next';
import { SITE_URL, LAST_MODIFIED } from '@/lib/site';

type ChangeFrequency = 'weekly' | 'monthly';

// Kaikki julkiset sivut (paitsi /kiitos, joka on noindex)
// path = Finnish slug (internal pathname), enPath = localized English slug
// (must match i18n/routing.ts pathnames).
const pages: Array<{ path: string; enPath: string; changeFrequency: ChangeFrequency; priority: number }> = [
  { path: '', enPath: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/saunalauttaristeilyt-helsingissa', enPath: '/sauna-boat-cruises-helsinki', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/yksityissauna', enPath: '/private-sauna-helsinki', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/julkinen-sauna', enPath: '/public-sauna-helsinki', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/toiminnastamme', enPath: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/sijainti', enPath: '/location', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/usein-kysyttya', enPath: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/galleria', enPath: '/gallery', changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Finnish lives at unprefixed URLs, English at /en (localePrefix: 'as-needed').
  // trailingSlash: true in next.config — sitemap URLs must match canonicals.
  return pages.flatMap(({ path, enPath, changeFrequency, priority }) => {
    const fiUrl = `${SITE_URL}${path}/`;
    const enUrl = `${SITE_URL}/en${enPath}/`;
    const languages = {
      fi: fiUrl,
      en: enUrl,
      'x-default': fiUrl,
    };

    return [
      {
        url: fiUrl,
        lastModified: LAST_MODIFIED,
        changeFrequency,
        priority,
        alternates: { languages },
      },
      {
        url: enUrl,
        lastModified: LAST_MODIFIED,
        changeFrequency,
        priority,
        alternates: { languages },
      },
    ];
  });
}
