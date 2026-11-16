import type { Metadata } from 'next';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import { generateServiceSchema, generateBreadcrumbSchema, generateArticleSchema } from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_IMAGE = `${SITE_URL}/images/saunaboat-winter-sun.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-11-04';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/bachelor-parties-corporate-events-helsinki' : '/polttarit-yritystilaisuudet'}`;

  return {
    title: isEn
      ? 'Bachelor Parties & Corporate Events on a Sauna Boat | Hyvän Tuulen Sauna'
      : 'Polttarit ja yritystilaisuudet saunalautalla | Hyvän Tuulen Sauna',
    description: isEn
      ? 'Host your bachelor party, birthday or corporate event on a sauna boat in Helsinki. Private winter saunas in Puotila in winter, sauna boat cruises in summer. Book now!'
      : 'Järjestä polttarit, synttärit tai yritystilaisuus saunalautalla Helsingissä. Talvella yksityiset talvisaunat Puotilassa, kesällä saunalauttaristeilyt. Varaa nyt!',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/polttarit-yritystilaisuudet`,
        'en-US': `${SITE_URL}/en/bachelor-parties-corporate-events-helsinki`,
        'en-GB': `${SITE_URL}/en/bachelor-parties-corporate-events-helsinki`,
        'x-default': `${SITE_URL}/polttarit-yritystilaisuudet`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Bachelor Parties & Corporate Events | Hyvän Tuulen Sauna'
        : 'Polttarit ja yritystilaisuudet | Hyvän Tuulen Sauna',
      description: isEn
        ? 'A private sauna boat for your party — winter saunas in Puotila, summer cruises in the archipelago.'
        : 'Saunalautta yksityiseen juhlaan — talvikaudella talvisaunat Puotilassa, kesällä risteilyt saaristossa.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/saunaboat-winter-sun.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Sauna boats Aalto and Virta - Hyvän Tuulen Sauna'
            : 'Saunalautat Aalto ja Virta - Hyvän Tuulen Sauna',
        },
      ],
    },
  };
}

export default async function OccasionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const data = getVibePage('tapahtumat', safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en/bachelor-parties-corporate-events-helsinki' : '/polttarit-yritystilaisuudet'}`;

  const serviceSchema = generateServiceSchema(
    isEn ? 'Bachelor parties and corporate events on a sauna boat' : 'Polttarit ja yritystilaisuudet saunalautalla',
    isEn
      ? 'Private sauna boat for parties and corporate events in Helsinki. Winter saunas in Puotila in winter, sauna boat cruises in summer.'
      : 'Yksityinen saunalautta juhliin ja yritystilaisuuksiin Helsingissä. Talvikaudella talvisaunat Puotilassa, kesällä saunalauttaristeilyt.',
    pageUrl,
    PAGE_IMAGE
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Bachelor parties & corporate events' : 'Polttarit ja yritystilaisuudet', url: pageUrl },
  ]);

  const articleSchema = generateArticleSchema(
    isEn ? 'Bachelor Parties & Corporate Events on a Sauna Boat in Helsinki' : 'Polttarit ja yritystilaisuudet saunalautalla Helsingissä',
    isEn
      ? 'A private sauna boat for your party or corporate event in Helsinki. Winter saunas in Puotila, summer cruises in the archipelago.'
      : 'Yksityinen saunalautta juhlaan tai yritystilaisuuteen Helsingissä. Talvikaudella talvisaunat Puotilassa, kesällä risteilyt saaristossa.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbSchema, articleSchema]),
        }}
      />
      <VibeInnerPage data={data} locale={safeLocale} slug="tapahtumat" />
    </>
  );
}
