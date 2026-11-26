import { MetadataRoute } from 'next';
import { SITE_URL, LAST_MODIFIED } from '@/lib/site';
import { routing } from '@/i18n/routing';
import { vibeRoutes } from '@/components/vibe/routes';

type ChangeFrequency = 'weekly' | 'monthly';
type PublicPage = keyof typeof vibeRoutes;

// /kiitos is deliberately excluded because it is noindex.
const pages: Array<{ slug: PublicPage; changeFrequency: ChangeFrequency; priority: number }> = [
  { slug: 'home', changeFrequency: 'weekly', priority: 1.0 },
  { slug: 'saunalauttaristeilyt', changeFrequency: 'weekly', priority: 0.9 },
  { slug: 'julkinen-sauna', changeFrequency: 'weekly', priority: 0.8 },
  { slug: 'avanto', changeFrequency: 'weekly', priority: 0.8 },
  { slug: 'tapahtumat', changeFrequency: 'monthly', priority: 0.7 },
  { slug: 'meista', changeFrequency: 'monthly', priority: 0.7 },
  { slug: 'sijainti', changeFrequency: 'monthly', priority: 0.7 },
  { slug: 'ukk', changeFrequency: 'monthly', priority: 0.6 },
  { slug: 'galleria', changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ slug, changeFrequency, priority }) => {
    const localizedUrls = Object.fromEntries(
      routing.locales.map((locale) => [locale, `${SITE_URL}${vibeRoutes[slug][locale]}`])
    );
    const languages = {
      ...localizedUrls,
      'x-default': localizedUrls[routing.defaultLocale],
    };

    return routing.locales.map((locale) => ({
      url: localizedUrls[locale],
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
