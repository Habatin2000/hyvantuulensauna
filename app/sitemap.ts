import { MetadataRoute } from 'next';

const LAST_MODIFIED = '2026-04-14';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hyvantuulensauna.fi';
  
  // Pääsivut
  const mainPages = [
    {
      url: baseUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/saunalauttaristeilyt-helsingissa`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/yksityissauna`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/julkinen-sauna`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/toiminnastamme`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sijainti`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/usein-kysyttya`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/galleria`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  return mainPages;
}
