import type { Metadata } from 'next';
import { summerPageHero } from '@/content/pages';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema, generateEventSchema, generateHowToSchema } from '../schema';
import SummerSaunaPageClient from './SummerSaunaPageClient';

const PAGE_URL = 'https://hyvantuulensauna.fi/saunalauttaristeilyt-helsingissa';
const PAGE_IMAGE = 'https://hyvantuulensauna.fi/images/gallery-deck-view.jpg';
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Saunalauttaristeilyt Helsingissä | Varaa kesäksi 2026',
  description: 'Varaa saunalautta Helsingistä kesäksi 2026! Kaksi ainutlaatuista saunalauttaa (Aalto ja Virta) Itä-Helsingin saaristossa. Polttarit, synttärit, tyky-päivät – täydellinen merellinen saunaelämys.',

  alternates: {
    canonical: '/saunalauttaristeilyt-helsingissa',
  },
  openGraph: {
    title: 'Saunalauttaristeilyt Helsingissä | Hyvän Tuulen Sauna',
    description: 'Varaa saunalautta kesäksi 2026! Kaksi ainutlaatuista saunalauttaa Itä-Helsingin saaristossa.',
    url: 'https://hyvantuulensauna.fi/saunalauttaristeilyt-helsingissa',
    images: [
      {
        url: '/images/gallery-deck-view.jpg',
        width: 1200,
        height: 630,
        alt: 'Saunalautta Helsingissä - Hyvän Tuulen Sauna',
      },
    ],
  },
};

// Carousel images for intro section
const introCarouselImages = [
  { id: '1', src: '/images/gallery-raft-sunset.jpg', alt: 'Saunalautta auringonlaskussa Helsingissä' },
  { id: '2', src: '/images/gallery-aalto-raft.jpeg', alt: 'Aalto-saunalautta Aurinkolahdessa' },
  { id: '3', src: '/images/gallery-virta-deck.jpeg', alt: 'Virran kansi merinäköalalla' },
  { id: '4', src: '/images/gallery-sauna-interior.jpg', alt: 'Puulämmitteinen sauna saunalautalla' },
  { id: '5', src: '/images/gallery-deck-view.jpg', alt: 'Näkymä merelle saunalautalta' },
];

export default function SummerSaunaPage() {
  const faqItems = getFAQsByCategory('summer');

  // JSON-LD schemas
  const serviceSchema = generateServiceSchema(
    'Saunalauttaristeilyt Helsingissä',
    'Kesäkauden saunalauttaristeilyt Itä-Helsingin saaristossa. Kaksi saunalauttaa: Aalto ja Virta.',
    PAGE_URL,
    PAGE_IMAGE
  );

  const faqSchema = generateFAQSchema(
    faqItems.map(item => ({ question: item.question, answer: item.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Etusivu', url: 'https://hyvantuulensauna.fi' },
    { name: 'Saunalauttaristeilyt', url: PAGE_URL }
  ]);

  const articleSchema = generateArticleSchema(
    'Saunalauttaristeilyt Helsingissä | Varaa kesäksi 2026',
    'Varaa saunalautta Helsingistä kesäksi 2026! Kaksi ainutlaatuista saunalauttaa Itä-Helsingin saaristossa.',
    PAGE_URL,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const eventSchema = generateEventSchema(
    'Saunalauttaristeilyt kesäkausi 2026',
    'Kesäkauden saunalauttaristeilyt Hyvän Tuulen Saunalla. Kaksi saunalauttaa, Aalto ja Virta.',
    PAGE_URL,
    PAGE_IMAGE,
    '2026-05-01T10:00:00+03:00',
    '2026-09-30T22:00:00+03:00',
    'Kalkkihiekantorin laivalaituri'
  );

  const howToSchema = generateHowToSchema(
    'Saunalautan varaaminen Helsingissä',
    'Näin varaat saunalauttaristeilyn Hyvän Tuulen Saunalla.',
    [
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
    />
  );
}
