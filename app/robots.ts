import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/kiitos',
        '/en/thank-you',
        '/es/gracias',
        '/fr/merci',
        '/de/danke',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
