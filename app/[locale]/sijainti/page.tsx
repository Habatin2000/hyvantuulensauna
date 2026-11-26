import type { Metadata } from 'next';
import LocationTracker from '@/components/analytics/LocationTracker';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import {
  generateBreadcrumbSchema,
  generateHowToSchema,
  getHomeLabel,
  getLanguageAlternates,
  getLocalizedPageUrl,
  getOpenGraphLocale,
  normalizePageLocale,
  ORGANIZATION_ID,
} from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_PATH = '/sijainti';
const PAGE_IMAGE = `${SITE_URL}/images/location-map.png`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('sijainti', safeLocale);
  const pageUrl = getLocalizedPageUrl(PAGE_PATH, safeLocale);

  return {
    title: { absolute: data.title },
    description: data.description,
    alternates: {
      canonical: pageUrl,
      languages: getLanguageAlternates(PAGE_PATH),
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: pageUrl,
      locale: getOpenGraphLocale(safeLocale),
      images: [
        {
          url: PAGE_IMAGE,
          width: 1116,
          height: 583,
          alt: data.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [{ url: PAGE_IMAGE, alt: data.imageAlt }],
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('sijainti', safeLocale);
  const pageUrl = getLocalizedPageUrl(PAGE_PATH, safeLocale);
  const pageName = data.title.split(' | ')[0];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: getHomeLabel(safeLocale), url: getLocalizedPageUrl('/', safeLocale) },
    { name: pageName, url: pageUrl },
  ]);

  const howToSchema = generateHowToSchema(
    data.detailTitle,
    data.detailText,
    data.features.map(feature => ({ name: feature.title, text: feature.text }))
  );

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': ORGANIZATION_ID,
    name: 'Hyvän Tuulen Sauna',
    description: data.description,
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Meripellontie 11C',
      addressLocality: 'Helsinki',
      postalCode: '00970',
      addressCountry: 'FI',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 60.2078110,
      longitude: 25.1059710,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, howToSchema, localBusinessSchema]),
        }}
      />
      <LocationTracker />
      <VibeInnerPage data={data} locale={safeLocale} slug="sijainti" />
    </>
  );
}
