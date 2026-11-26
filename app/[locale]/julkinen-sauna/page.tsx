import type { Metadata } from 'next';

import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import {
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateEventSchema,
  generateHowToSchema,
  getHomeLabel,
  getLanguageAlternates,
  getLocalizedPageUrl,
  getOpenGraphLocale,
  normalizePageLocale,
} from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_PATH = '/julkinen-sauna';
const PAGE_IMAGE = `${SITE_URL}/images/gallery-ice-swimming.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-11-03';

const eventLocations = {
  fi: 'Meripellontien laituri, Puotila',
  en: 'Meripellontie pier, Puotila',
  es: 'Embarcadero de Meripellontie, Puotila',
  fr: 'Quai de Meripellontie, Puotila',
  de: 'Anleger Meripellontie, Puotila',
};

const faqItemsByLocale = {
  fi: [
    { question: 'Milloin yleisiä vuoroja on?', answer: 'Yleisiä vuoroja järjestetään läpi viikon. Näet vapaat ajat varauskalenterista.' },
    { question: 'Mitä otan mukaan?', answer: 'Pyyhe, uimapuku ja juomapullo riittävät. Ota myös sään mukainen vaatetus ja tarvittaessa sandaalit.' },
    { question: 'Voinko tulla ensimmäistä kertaa?', answer: 'Kyllä. Opastamme ensikertalaisia talviuinnin pariin, ja voit myös vain saunoa.' },
    { question: 'Mitä vuoro maksaa?', answer: 'Yleinen vuoro maksaa 15 € / 2 h. Opiskelijat, eläkeläiset ja alle 15-vuotiaat saunovat hintaan 12,50 € / 2 h.' },
    { question: 'Onko käytössä pukuhuone ja WC?', answer: 'Kyllä. Myös terassi on käytössäsi vuoron ajan.' },
  ],
  en: [
    { question: 'When are public sessions available?', answer: 'Public sessions run throughout the week. See the booking calendar for available times.' },
    { question: 'What should I bring?', answer: 'Bring a towel, swimwear and a water bottle. Weather-appropriate clothing and sandals are useful too.' },
    { question: 'Can I come for my first time?', answer: 'Yes. We guide first-timers through winter swimming, and you can also simply enjoy the sauna.' },
    { question: 'How much does a session cost?', answer: 'A public session costs 15 € / 2 h. Students, pensioners and children under 15 pay 12.50 € / 2 h.' },
    { question: 'Are changing rooms and toilets available?', answer: 'Yes. You also have access to the terrace during your session.' },
  ],
  es: [
    { question: '¿Cuándo hay sesiones públicas?', answer: 'Las sesiones públicas se organizan durante toda la semana. Consulta el calendario de reservas para ver los horarios disponibles.' },
    { question: '¿Qué debo llevar?', answer: 'Trae una toalla, bañador y una botella de agua. También conviene llevar ropa adecuada para el tiempo y sandalias.' },
    { question: '¿Puedo venir por primera vez?', answer: 'Sí. Guiamos a quienes se inician en la natación invernal, y también puedes simplemente disfrutar de la sauna.' },
    { question: '¿Cuánto cuesta una sesión?', answer: 'Una sesión pública cuesta 15 € / 2 h. Estudiantes, pensionistas y menores de 15 años pagan 12,50 € / 2 h.' },
    { question: '¿Hay vestuarios y aseos?', answer: 'Sí. También puedes usar la terraza durante la sesión.' },
  ],
  fr: [
    { question: 'Quand les séances publiques ont-elles lieu ?', answer: 'Des séances publiques sont proposées tout au long de la semaine. Consultez le calendrier de réservation pour voir les horaires disponibles.' },
    { question: 'Que dois-je apporter ?', answer: 'Apportez une serviette, un maillot de bain et une bouteille d’eau. Des vêtements adaptés à la météo et des sandales sont également utiles.' },
    { question: 'Puis-je venir pour une première fois ?', answer: 'Oui. Nous accompagnons les débutants dans leur première baignade hivernale, et vous pouvez aussi simplement profiter du sauna.' },
    { question: 'Combien coûte une séance ?', answer: 'Une séance publique coûte 15 € / 2 h. Les étudiants, les retraités et les moins de 15 ans paient 12,50 € / 2 h.' },
    { question: 'Y a-t-il des vestiaires et des toilettes ?', answer: 'Oui. Vous avez également accès à la terrasse pendant votre séance.' },
  ],
  de: [
    { question: 'Wann finden öffentliche Saunazeiten statt?', answer: 'Öffentliche Saunazeiten werden die ganze Woche über angeboten. Die verfügbaren Termine finden Sie im Buchungskalender.' },
    { question: 'Was sollte ich mitbringen?', answer: 'Bringen Sie ein Handtuch, Badekleidung und eine Wasserflasche mit. Auch wettergerechte Kleidung und Sandalen sind hilfreich.' },
    { question: 'Kann ich zum ersten Mal kommen?', answer: 'Ja. Wir begleiten Anfänger beim Winterbaden, und Sie können auch einfach nur die Sauna genießen.' },
    { question: 'Was kostet eine Saunazeit?', answer: 'Eine öffentliche Saunazeit kostet 15 € / 2 h. Studierende, Rentner und Kinder unter 15 Jahren zahlen 12,50 € / 2 h.' },
    { question: 'Gibt es Umkleiden und Toiletten?', answer: 'Ja. Während Ihrer Saunazeit können Sie außerdem die Terrasse nutzen.' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('julkinen-sauna', safeLocale);
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
          width: 1200,
          height: 630,
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

export default async function PublicSaunaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('julkinen-sauna', safeLocale);
  const pageUrl = getLocalizedPageUrl(PAGE_PATH, safeLocale);
  const pageName = data.title.split(' | ')[0];

  const serviceSchema = generateServiceSchema(data.title, data.description, pageUrl, PAGE_IMAGE);

  const articleSchema = generateArticleSchema(
    data.title,
    data.description,
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const eventSchema = generateEventSchema(
    data.heroTitle,
    data.heroText,
    pageUrl,
    PAGE_IMAGE,
    '2026-11-01T09:00:00+02:00',
    '2027-04-30T21:00:00+03:00',
    eventLocations[safeLocale],
    '15',
    '2026-11-01'
  );

  const howToSchema = generateHowToSchema(
    data.timelineTitle ?? data.detailTitle,
    data.detailText,
    data.timeline?.map(step => ({ name: step.title, text: step.text })) ?? []
  );

  const faqSchema = generateFAQSchema(faqItemsByLocale[safeLocale]);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: getHomeLabel(safeLocale), url: getLocalizedPageUrl('/', safeLocale) },
    { name: pageName, url: pageUrl },
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
    </>
  );
}
