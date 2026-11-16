import type { Metadata } from 'next';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import { generateServiceSchema, generateBreadcrumbSchema, generateArticleSchema, generateHowToSchema } from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-ice-swimming.webp`;
const DATE_PUBLISHED = '2026-10-01';
const DATE_MODIFIED = '2026-10-01';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/ice-swimming-sauna-helsinki' : '/avanto'}`;

  return {
    title: isEn
      ? 'Ice Swimming & Wood-Fired Sauna'
      : 'Avantouinti ja sauna Helsingissä',
    description: isEn
      ? "Try ice swimming and warm up in a wood-fired sauna by the sea in Puotila, Helsinki. Join a public session or book a private sauna for your group."
      : 'Koe avantouinti ja puusaunan lämpö meren äärellä Puotilassa, Helsingissä. Tule yleiselle saunavuorolle tai varaa yksityinen sauna omalle porukallesi.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/avanto`,
        'en-US': `${SITE_URL}/en/ice-swimming-sauna-helsinki`,
        'en-GB': `${SITE_URL}/en/ice-swimming-sauna-helsinki`,
        'x-default': `${SITE_URL}/avanto`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Ice Swimming & Sauna in Helsinki | Hyvän Tuulen Sauna'
        : 'Avantouinti ja puulämmitteinen sauna Helsingissä | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Ice swimming and a wood-fired sauna by the sea in Puotila.'
        : 'Avantouinti ja puulämmitteinen sauna meren äärellä Puotilassa.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-ice-swimming.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Ice swimming in Helsinki - Hyvän Tuulen Sauna'
            : 'Avantouinti Helsingissä - Hyvän Tuulen Sauna',
        },
      ],
    },
  };
}

export default async function AvantoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const data = getVibePage('avanto', safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en/ice-swimming-sauna-helsinki' : '/avanto'}`;

  const serviceSchema = {
    ...generateServiceSchema(
      isEn ? 'Ice swimming and sauna in Helsinki' : 'Avantouinti ja sauna Helsingissä',
      isEn
        ? 'Ice swimming and wood-fired sauna in a maritime setting in Puotila, Helsinki. Public sessions and private bookings all year round.'
        : 'Avantouinti ja puulämmitteinen sauna merellisessä ympäristössä Puotilassa. Julkiset vuorot ja yksityisvaraukset ympäri vuoden.',
      pageUrl,
      PAGE_IMAGE
    ),
    offers: [
      {
        '@type': 'Offer',
        name: isEn ? 'Sauna boat Aalto — private session 2 h' : 'Aalto-sauna — yksityinen vuoro 2 h',
        price: '140',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      },
      {
        '@type': 'Offer',
        name: isEn ? 'Sauna boat Virta — private session 2 h' : 'Virta-sauna — yksityinen vuoro 2 h',
        price: '120',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      },
    ],
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Ice swimming & sauna' : 'Avanto ja saunatila', url: pageUrl },
  ]);

  const articleSchema = generateArticleSchema(
    isEn ? 'Ice Swimming & Sauna in Helsinki' : 'Avantouinti ja puulämmitteinen sauna Helsingissä',
    isEn
      ? 'Ice swimming and a wood-fired sauna by the sea in Puotila, Helsinki.'
      : 'Avantouinti ja puulämmitteinen sauna meren äärellä Puotilassa, Helsingissä.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const howToSchema = generateHowToSchema(
    data.timelineTitle ?? (isEn ? 'Your visit' : 'Saunavuorosi'),
    data.detailText,
    data.timeline?.map(step => ({ name: step.title, text: step.text })) ?? []
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbSchema, articleSchema, howToSchema]),
        }}
      />
      <VibeInnerPage data={data} locale={safeLocale} slug="avanto" />
    </>
  );
}
