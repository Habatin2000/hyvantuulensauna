import type { Metadata } from 'next';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import { getAllFAQs } from '@/content/faq';
import { generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/usein-kysyttya`;

  return {
    title: isEn
      ? 'FAQ – Sauna and Sauna Boats'
      : 'Usein kysyttyä – sauna ja saunalautat',
    description: isEn
      ? 'Answers to the most common questions about sauna boat cruises, the public sauna and bookings. Find information on prices, opening hours and practices.'
      : 'Vastaukset yleisimpiin kysymyksiin saunalauttaristeilyistä, julkisesta saunasta ja varauksista. Löydä tietoa hinnoista, aukioloajoista ja käytännöistä.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/usein-kysyttya`,
        'en-US': `${SITE_URL}/en/usein-kysyttya`,
        'en-GB': `${SITE_URL}/en/usein-kysyttya`,
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
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/usein-kysyttya`;

  const allFaqs = getAllFAQs(safeLocale);

  // JSON-LD FAQ schema for rich snippets
  const faqSchema = generateFAQSchema(
    allFaqs.map(item => ({ question: item.question, answer: item.answer }))
  );

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
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, breadcrumbSchema, articleSchema]),
        }}
      />

      {/* Hero */}
      <section className="section-padding bg-[#3b82f6]">
        <div className="container-padding mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isEn ? 'Frequently asked questions' : 'Usein kysyttyä'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {isEn
              ? 'Find answers to the most common questions about our sauna, sauna boats and bookings.'
              : 'Löydä vastaukset yleisimpiin kysymyksiin saunastamme, saunalautoista ja varauksista.'}
          </p>
        </div>
      </section>

      {/* Visible date + FAQ */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <p className="text-sm text-stone-500 mb-6 text-center">
            {isEn ? 'Updated' : 'Päivitetty'} {new Date(DATE_MODIFIED).toLocaleDateString(isEn ? 'en-GB' : 'fi-FI')}
          </p>
          <FAQAccordion
            items={allFaqs}
            title={isEn ? 'All questions' : 'Kaikki kysymykset'}
            locale={safeLocale}
          />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            {isEn ? "Didn't find an answer?" : 'Etkö löytänyt vastausta?'}
          </h2>
          <p className="text-stone-600 mb-8">
            {isEn
              ? 'Contact us directly – we are happy to help with any questions!'
              : 'Ota yhteyttä suoraan – autamme mielellämme kaikissa kysymyksissä!'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+358442313546"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb]"
            >
              {isEn ? 'Call us' : 'Soita meille'}
            </a>
            <a
              href="mailto:info@hyvantuulensauna.fi"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
            >
              {isEn ? 'Send email' : 'Lähetä sähköposti'}
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA
        title={isEn ? 'Ready to book?' : 'Valmis varaamaan?'}
        description={isEn
          ? 'Book your own sauna experience now and enjoy an unforgettable day at sea.'
          : 'Varaa oma saunaelämyksesi nyt ja koe unohtumaton päivä merellä.'}
        primaryCta={{
          text: isEn ? 'Book a sauna boat' : 'Varaa saunalautta',
          href: isEn ? '/en/saunalauttaristeilyt-helsingissa#boats' : '/saunalauttaristeilyt-helsingissa#boats',
        }}
        secondaryCta={{
          text: isEn ? 'Public sauna' : 'Julkinen sauna',
          href: isEn ? '/en/julkinen-sauna' : '/julkinen-sauna',
        }}
        variant="dark"
      />
    </>
  );
}
