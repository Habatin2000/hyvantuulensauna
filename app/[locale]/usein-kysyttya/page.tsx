import type { Metadata } from 'next';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import { generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema } from '../schema';
import { SITE_URL } from '@/lib/site';

const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/faq' : '/usein-kysyttya'}`;

  return {
    title: isEn
      ? 'Sauna & Boat Cruise FAQ'
      : 'Usein kysyttyä saunasta ja risteilyistä',
    description: isEn
      ? 'What should you bring to the sauna, and how do you book a cruise? Find answers about public sauna sessions, private cruises, prices and bookings.'
      : 'Mitä mukaan saunaan ja miten saunalautta varataan? Löydä vastaukset yleisiin kysymyksiin saunavuoroista, risteilyistä, hinnoista ja varauksista.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/usein-kysyttya`,
        'en-US': `${SITE_URL}/en/faq`,
        'en-GB': `${SITE_URL}/en/faq`,
        'x-default': `${SITE_URL}/usein-kysyttya`,
      },
    },
    openGraph: {
      title: isEn
        ? 'FAQ | Hyvän Tuulen Sauna'
        : 'Usein Kysyttyä | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Answers to the most common questions about the sauna and sauna boats.'
        : 'Vastaukset yleisimpiin kysymyksiin saunasta ja saunalautoista.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const data = getVibePage('ukk', safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en/faq' : '/usein-kysyttya'}`;

  const faqSchema = generateFAQSchema(data.faqs ?? []);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'FAQ' : 'Usein kysyttyä', url: pageUrl }
  ]);

  const articleSchema = generateArticleSchema(
    isEn ? 'FAQ – Sauna and Sauna Boats' : 'Usein Kysyttyä | Sauna ja Saunalautta Helsinki',
    isEn
      ? 'Answers to the most common questions about sauna boat cruises, the public sauna and bookings.'
      : 'Vastaukset yleisimpiin kysymyksiin saunalauttaristeilyistä, julkisesta saunasta ja varauksista.',
    pageUrl,
    `${SITE_URL}/images/gallery-raft-sunset.webp`,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, breadcrumbSchema, articleSchema]),
        }}
      />
      <VibeInnerPage data={data} locale={safeLocale} slug="ukk" />
    </>
  );
}
