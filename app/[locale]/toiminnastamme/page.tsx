import type { Metadata } from 'next';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import { generateBreadcrumbSchema, generateArticleSchema } from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-crew.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/about' : '/toiminnastamme'}`;

  return {
    title: isEn ? 'Our Story' : 'Meidän tarinamme',
    description: isEn
      ? "Discover the story of Hyvän Tuulen Sauna. We've offered sauna boat cruises and sauna experiences in Helsinki since 2018. Learn more about us."
      : 'Tutustu Hyvän Tuulen Saunan tarinaan. Olemme tarjonneet saunalauttaristeilyjä ja saunaelämyksiä Helsingissä vuodesta 2018. Lue lisää toiminnastamme.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/toiminnastamme`,
        'en-US': `${SITE_URL}/en/about`,
        'en-GB': `${SITE_URL}/en/about`,
        'x-default': `${SITE_URL}/toiminnastamme`,
      },
    },
    openGraph: {
      title: isEn
        ? 'About Us | Hyvän Tuulen Sauna'
        : 'Toiminnastamme | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Discover our story. Sauna boat cruises in Helsinki with 8 years of experience.'
        : 'Tutustu tarinaamme. 8 vuoden kokemuksella saunalauttaristeilyjä Helsingissä.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-crew.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Hyvän Tuulen Sauna team'
            : 'Hyvän Tuulen Saunan tiimi',
        },
      ],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const data = getVibePage('meista', safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en/about' : '/toiminnastamme'}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'About Us' : 'Toiminnastamme', url: pageUrl }
  ]);

  const articleSchema = generateArticleSchema(
    isEn ? 'About Us | Hyvän Tuulen Sauna Oy' : 'Toiminnastamme | Hyvän Tuulen Sauna Oy',
    isEn
      ? 'Discover the story of Hyvän Tuulen Sauna. We have offered sauna boat cruises and sauna experiences in Helsinki since 2018.'
      : 'Tutustu Hyvän Tuulen Saunan tarinaan. Olemme tarjonneet saunalauttaristeilyjä ja saunaelämyksiä Helsingissä jo vuodesta 2018.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isEn ? 'About Us' : 'Toiminnastamme',
    description: isEn
      ? 'The story, values and team of Hyvän Tuulen Sauna.'
      : 'Hyvän Tuulen Saunan tarina, arvot ja tiimi.',
    url: pageUrl,
    mainEntity: {
      '@id': `${SITE_URL}/#organization`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, articleSchema, aboutPageSchema]),
        }}
      />
      <VibeInnerPage data={data} locale={safeLocale} slug="meista" />
    </>
  );
}
