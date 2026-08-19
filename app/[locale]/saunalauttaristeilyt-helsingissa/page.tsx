import type { Metadata } from 'next';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema, generateEventSchema, generateHowToSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import SummerSaunaPageClient from './SummerSaunaPageClient';
import type { Locale } from '@/content/pages';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-deck-view.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-06-08';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/saunalauttaristeilyt-helsingissa`;

  return {
    title: isEn
      ? 'Sauna Boat Cruises in Helsinki 2026'
      : 'Saunalauttaristeilyt Helsingissä 2026',
    description: isEn
      ? 'Book a sauna boat in Helsinki for summer 2026! Two unique sauna boats, Aalto and Virta, in the Eastern Helsinki archipelago. Departing from Kalkkihiekantori, Vuosaari. Bachelor parties, birthdays, team days.'
      : 'Varaa saunalautta Helsingistä kesäksi 2026! Kaksi ainutlaatuista saunalauttaa, Aalto ja Virta, Itä-Helsingin saaristossa. Lähtö Kalkkihiekantorilta, Vuosaari. Polttarit, synttärit, tyky-päivät.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/saunalauttaristeilyt-helsingissa`,
        'en-US': `${SITE_URL}/en/saunalauttaristeilyt-helsingissa`,
        'en-GB': `${SITE_URL}/en/saunalauttaristeilyt-helsingissa`,
        'x-default': `${SITE_URL}/saunalauttaristeilyt-helsingissa`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Sauna Boat Cruises in Helsinki | Hyvän Tuulen Sauna'
        : 'Saunalauttaristeilyt Helsingissä | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Book a sauna boat for summer 2026! Two unique sauna boats in the Eastern Helsinki archipelago.'
        : 'Varaa saunalautta kesäksi 2026! Kaksi ainutlaatuista saunalauttaa Itä-Helsingin saaristossa.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-deck-view.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Sauna boat in Helsinki - Hyvän Tuulen Sauna'
            : 'Saunalautta Helsingissä - Hyvän Tuulen Sauna',
        },
      ],
    },
  };
}

export default async function SummerSaunaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';

  const faqItems = getFAQsByCategory('summer', safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/saunalauttaristeilyt-helsingissa`;

  const serviceSchema = generateServiceSchema(
    isEn ? 'Sauna Boat Cruises in Helsinki | Aalto and Virta' : 'Saunalauttaristeilyt Helsingissä | Aalto ja Virta',
    isEn
      ? 'Summer season sauna boat cruises in Eastern Helsinki archipelago. Two sauna boats, Aalto and Virta, departing from Kalkkihiekantori in Vuosaari.'
      : 'Kesäkauden saunalauttaristeilyt Itä-Helsingin saaristossa. Kaksi saunalauttaa, Aalto ja Virta, lähtevät Kalkkihiekantorilta Vuosaaressa.',
    pageUrl,
    PAGE_IMAGE
  );

  const faqSchema = generateFAQSchema(
    faqItems.map(item => ({ question: item.question, answer: item.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Sauna Boat Cruises' : 'Saunalauttaristeilyt', url: pageUrl }
  ]);

  const articleSchema = generateArticleSchema(
    isEn ? 'Sauna Boat Cruises in Helsinki 2026 | Aalto & Virta | Kalkkihiekantori' : 'Saunalauttaristeilyt Helsingissä 2026 | Aalto ja Virta | Kalkkihiekantori',
    isEn
      ? 'Book a sauna boat in Helsinki for summer 2026! Two unique sauna boats, Aalto and Virta, in the Eastern Helsinki archipelago. Departing from Kalkkihiekantori, Vuosaari.'
      : 'Varaa saunalautta Helsingistä kesäksi 2026! Kaksi ainutlaatuista saunalauttaa, Aalto ja Virta, Itä-Helsingin saaristossa. Lähtö Kalkkihiekantorilta, Vuosaari.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const eventSchema = generateEventSchema(
    isEn ? 'Sauna boat cruise season 2026' : 'Saunalauttaristeilyt kesäkausi 2026',
    isEn
      ? 'Summer season sauna boat cruises with Hyvän Tuulen Sauna. Two sauna boats, Aalto and Virta.'
      : 'Kesäkauden saunalauttaristeilyt Hyvän Tuulen Saunalla. Kaksi saunalauttaa, Aalto ja Virta.',
    pageUrl,
    PAGE_IMAGE,
    '2026-05-01T10:00:00+03:00',
    '2026-09-30T22:00:00+03:00',
    isEn ? 'Kalkkihiekantori boat pier' : 'Kalkkihiekantorin laivalaituri',
    '525',
    '2026-05-01'
  );

  const howToSchema = generateHowToSchema(
    isEn ? 'Booking a sauna boat in Helsinki' : 'Saunalautan varaaminen Helsingissä',
    isEn
      ? 'How to book a sauna boat cruise with Hyvän Tuulen Sauna.'
      : 'Näin varaat saunalauttaristeilyn Hyvän Tuulen Saunalla.',
    isEn ? [
      { name: 'Choose a boat', text: 'Choose Aalto (for larger groups) or Virta (for smaller groups).' },
      { name: 'Choose a day', text: 'Open the booking calendar and choose a suitable day from May to September.' },
      { name: 'Choose a time', text: 'Choose an available time slot (minimum 3 hours).' },
      { name: 'Fill in details', text: 'Fill in your contact details and confirm the booking by email.' }
    ] : [
      { name: 'Valitse lautta', text: 'Valitse Aalto (isommille ryhmille) tai Virta (pienemmälle porukalle).' },
      { name: 'Valitse päivä', text: 'Avaa varauskalenteri ja valitse sopiva päivä touko-syyskuulta.' },
      { name: 'Valitse aika', text: 'Valitse käytettävissä oleva aikaväli (minimi 3 tuntia).' },
      { name: 'Täytä tiedot', text: 'Täytä yhteystietosi ja vahvista varaus sähköpostilla.' }
    ]
  );

  return (
    <SummerSaunaPageClient 
      faqItems={faqItems}
      serviceSchema={serviceSchema}
      faqSchema={faqSchema}
      breadcrumbSchema={breadcrumbSchema}
      articleSchema={articleSchema}
      eventSchema={eventSchema}
      howToSchema={howToSchema}
      dateModified={DATE_MODIFIED}
      locale={safeLocale}
    />
  );
}
