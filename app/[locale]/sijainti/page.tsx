import type { Metadata } from 'next';
import LocationTracker from '@/components/analytics/LocationTracker';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import { generateBreadcrumbSchema, generateHowToSchema } from '../schema';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/location' : '/sijainti'}`;

  return {
    title: isEn
      ? 'Sauna in Puotila, Helsinki'
      : 'Sauna Helsingin Puotilassa',
    description: isEn
      ? 'Find Hyvän Tuulen Sauna at Meripellontie 11C in Puotila, Helsinki. See our location and directions, and plan your visit by public transport.'
      : 'Löydä Hyvän Tuulen Sauna Helsingin Puotilasta, Meripellontie 11C. Katso sijainti ja saapumisohjeet sekä suunnittele matkasi meren äärelle.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/sijainti`,
        'en-US': `${SITE_URL}/en/location`,
        'en-GB': `${SITE_URL}/en/location`,
        'x-default': `${SITE_URL}/sijainti`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Location | Hyvän Tuulen Sauna'
        : 'Sijainti | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Come visit us at Meripellontie in Puotila! A sauna by the sea.'
        : 'Tule käymään Meripellontielle Puotilaan! Meren rannalla sijaitseva sauna.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/location-map.png',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Hyvän Tuulen Sauna location in Puotila'
            : 'Hyvän Tuulen Saunan sijainti Puotilassa',
        },
      ],
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const data = getVibePage('sijainti', safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en/location' : '/sijainti'}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Location' : 'Sijainti', url: pageUrl }
  ]);

  const howToSchema = generateHowToSchema(
    isEn ? 'Getting to Hyvän Tuulen Sauna' : 'Saapuminen Hyvän Tuulen Saunalle',
    isEn
      ? 'Instructions for reaching the Meripellontie pier in Puotila by public transport and by car.'
      : 'Ohjeet julkisilla liikennevälineillä ja autolla Meripellontien laiturille Puotilaan.',
    isEn ? [
      { name: 'Metro', text: 'Go to Rastila metro station. Walk along Meripellontie to the pier in about 15 minutes.' },
      { name: 'Bus', text: 'Several buses stop right by Meripellontie in Puotila. Get off at the Meripellontie stop.' },
      { name: 'Car', text: 'Plenty of 4-hour disc parking along Meripellontie. Arrive a few minutes before your session.' }
    ] : [
      { name: 'Metro', text: 'Mene metroasemalle Rastila. Kävele Meripellontietä pitkin laiturille noin 15 minuuttia.' },
      { name: 'Bussi', text: 'Useat bussit pysähtyvät aivan Meripellontien viereen Puotilassa. Jää pois Meripellontien pysäkillä.' },
      { name: 'Auto', text: 'Meripellontien varrella on paljon 4 tunnin kiekkopaikkoja. Saavu paikalle muutama minuutti ennen vuoroasi.' }
    ]
  );

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#location`,
    name: isEn
      ? 'Hyvän Tuulen Sauna – Meripellontie Pier'
      : 'Hyvän Tuulen Sauna – Meripellontien laituri',
    description: isEn
      ? 'Winter sauna location and ice hole at Meripellontie in Puotila, Helsinki. In summer the sauna boats depart from Kalkkihiekantori in Aurinkolahti.'
      : 'Talvisaunojen ja avannon sijainti Meripellontiellä Puotilassa, Helsingissä. Kesällä saunalautat lähtevät Kalkkihiekantorilta Aurinkolahdesta.',
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Meripellontie 11C',
      addressLocality: 'Helsinki',
      postalCode: '00970',
      addressCountry: 'FI'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 60.2078110,
      longitude: 25.1059710
    }
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
