import type { Metadata } from 'next';
import SubscriptionPurchase from '@/components/booking/SubscriptionPurchase';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema, generateEventSchema, generateHowToSchema } from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-ice-swimming.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-11-03';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/public-sauna-helsinki' : '/julkinen-sauna'}`;

  return {
    title: isEn
      ? 'Public Sauna in Helsinki'
      : 'Yleinen sauna Helsingissä',
    description: isEn
      ? 'Enjoy a public sauna session by the sea in Puotila. Two wood-fired saunas, winter swimming, an ice hole and a relaxed atmosphere. View sessions and book!'
      : 'Nauti yleisestä saunavuorosta meren äärellä Puotilassa. Kaksi puusaunaa, talviuintia, avanto ja rento tunnelma. Katso saunavuorot ja varaa!',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/julkinen-sauna`,
        'en-US': `${SITE_URL}/en/public-sauna-helsinki`,
        'en-GB': `${SITE_URL}/en/public-sauna-helsinki`,
        'x-default': `${SITE_URL}/julkinen-sauna`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Public Sauna in Helsinki | Hyvän Tuulen Sauna'
        : 'Yleinen Sauna Helsingissä | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Come to a public sauna session by the sea in Puotila! Wood-fired saunas and winter swimming.'
        : 'Tule yleiselle saunavuorolle meren äärelle Puotilaan! Puusaunat ja talviuintia.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-ice-swimming.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Public sauna in Helsinki - Hyvän Tuulen Sauna'
            : 'Yleinen sauna Helsingissä - Hyvän Tuulen Sauna',
        },
      ],
    },
  };
}

export default async function PublicSaunaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const data = getVibePage('julkinen-sauna', safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en/public-sauna-helsinki' : '/julkinen-sauna'}`;

  const serviceSchema = generateServiceSchema(
    isEn ? 'Public sauna in Helsinki' : 'Yleinen sauna Helsingissä',
    isEn
      ? 'Open public sauna sessions in Puotila. Wood-fired saunas, winter swimming and an ice hole by the sea.'
      : 'Avoimet yleiset saunavuorot Puotilassa. Puulämmitteiset saunat, talviuinti ja avanto meren äärellä.',
    pageUrl,
    PAGE_IMAGE
  );

  const articleSchema = generateArticleSchema(
    isEn ? 'Public Sauna in Helsinki | Sauna Session by the Sea' : 'Yleinen Sauna Helsingissä | Saunavuoro Merellä',
    isEn
      ? 'Come to a public sauna session by the sea in Puotila! Wood-fired saunas, winter swimming and a relaxed atmosphere.'
      : 'Tule yleiselle saunavuorolle meren äärelle Puotilaan! Puulämmitteiset saunat, talviuinti ja rento tunnelma.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const eventSchema = generateEventSchema(
    isEn ? 'Public winter swimming and sauna session' : 'Yleinen talviuinti- ja saunavuoro',
    isEn
      ? 'Open public sauna session in Puotila. Two wood-fired saunas, a large ice hole and guidance for winter swimming.'
      : 'Avoin yleinen saunavuoro Puotilassa. Kaksi puusaunaa, iso avanto ja ohjaus talviuintiin.',
    pageUrl,
    PAGE_IMAGE,
    '2026-11-01T09:00:00+02:00',
    '2027-04-30T21:00:00+03:00',
    isEn ? 'Meripellontie pier, Puotila' : 'Meripellontien laituri, Puotila',
    '15',
    '2026-11-01'
  );

  const howToSchema = generateHowToSchema(
    data.timelineTitle ?? (isEn ? 'Your first visit' : 'Ensimmäinen kertasi'),
    data.detailText,
    data.timeline?.map(step => ({ name: step.title, text: step.text })) ?? []
  );

  const faqItems = isEn ? [
    { question: 'When are public sessions available?', answer: 'Public sessions run throughout the week. See the booking calendar for available times.' },
    { question: 'What should I bring?', answer: 'Bring a towel, swimwear and a water bottle. Weather-appropriate clothing and sandals are useful too.' },
    { question: 'Can I come for my first time?', answer: 'Yes. We guide first-timers through winter swimming, and you can also simply enjoy the sauna.' },
    { question: 'How much does a session cost?', answer: 'A public session costs 15 € / 2 h. Students, pensioners and children under 15 pay 12.50 € / 2 h.' },
    { question: 'Are changing rooms and toilets available?', answer: 'Yes. You also have access to the terrace during your session.' },
  ] : [
    { question: 'Milloin yleisiä vuoroja on?', answer: 'Yleisiä vuoroja järjestetään läpi viikon. Näet vapaat ajat varauskalenterista.' },
    { question: 'Mitä otan mukaan?', answer: 'Pyyhe, uimapuku ja juomapullo riittävät. Ota myös sään mukainen vaatetus ja tarvittaessa sandaalit.' },
    { question: 'Voinko tulla ensimmäistä kertaa?', answer: 'Kyllä. Opastamme ensikertalaisia talviuinnin pariin, ja voit myös vain saunoa.' },
    { question: 'Mitä vuoro maksaa?', answer: 'Yleinen vuoro maksaa 15 € / 2 h. Opiskelijat, eläkeläiset ja alle 15-vuotiaat saunovat hintaan 12,50 € / 2 h.' },
    { question: 'Onko käytössä pukuhuone ja WC?', answer: 'Kyllä. Myös terassi on käytössäsi vuoron ajan.' },
  ];

  const faqSchema = generateFAQSchema(faqItems);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Public Sauna' : 'Yleinen sauna', url: pageUrl }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, articleSchema, eventSchema, howToSchema, faqSchema, breadcrumbSchema]),
        }}
      />
      <VibeInnerPage data={data} locale={safeLocale} slug="julkinen-sauna" />
      <SubscriptionPurchase locale={safeLocale} />
    </>
  );
}
