import { MetadataRoute } from 'next';
import { SITE_URL, LAST_MODIFIED } from '@/lib/site';

type ChangeFrequency = 'weekly' | 'monthly';

// Kaikki julkiset sivut (paitsi /kiitos, joka on noindex)
const pages: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/saunalauttaristeilyt-helsingissa', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/yksityissauna', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/julkinen-sauna', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/toiminnastamme', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/sijainti', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/usein-kysyttya', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/galleria', changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Finnish lives at unprefixed URLs, English at /en (localePrefix: 'as-needed').
  // trailingSlash: true in next.config — sitemap URLs must match canonicals.
  return pages.flatMap(({ path, changeFrequency, priority }) => {
    const fiUrl = `${SITE_URL}${path}/`;
    const enUrl = `${SITE_URL}/en${path}/`;
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
