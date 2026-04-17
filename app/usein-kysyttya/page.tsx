import type { Metadata } from 'next';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import { getAllFAQs } from '@/content/faq';
import { generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema } from '../schema';

const PAGE_URL = 'https://hyvantuulensauna.fi/usein-kysyttya';
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Usein Kysyttyä | Sauna ja Saunalautta Helsinki',
  description: 'Vastaukset yleisimpiin kysymyksiin saunalauttaristeilyistä, julkisesta saunasta ja varauksista. Löydä tietoa hinnoista, aukioloajoista ja käytännöistä.',

  alternates: {
    canonical: '/usein-kysyttya',
  },
  openGraph: {
    title: 'Usein Kysyttyä | Hyvän Tuulen Sauna',
    description: 'Vastaukset yleisimpiin kysymyksiin saunasta ja saunalautoista.',
    url: 'https://hyvantuulensauna.fi/usein-kysyttya',
  },
};

export default function FAQPage() {
  const allFaqs = getAllFAQs();

  // JSON-LD FAQ schema for rich snippets
  const faqSchema = generateFAQSchema(
    allFaqs.map(item => ({ question: item.question, answer: item.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Etusivu', url: 'https://hyvantuulensauna.fi' },
    { name: 'Usein kysyttyä', url: PAGE_URL }
  ]);

  const articleSchema = generateArticleSchema(
    'Usein Kysyttyä | Sauna ja Saunalautta Helsinki',
    'Vastaukset yleisimpiin kysymyksiin saunalauttaristeilyistä, julkisesta saunasta ja varauksista.',
    PAGE_URL,
    'https://hyvantuulensauna.fi/images/gallery-raft-sunset.jpg',
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
            Usein kysyttyä
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Löydä vastaukset yleisimpiin kysymyksiin saunastamme, 
            saunalautoista ja varauksista.
          </p>
        </div>
      </section>

      {/* Visible date + FAQ */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <p className="text-sm text-stone-500 mb-6 text-center">
            Päivitetty {new Date(DATE_MODIFIED).toLocaleDateString('fi-FI')}
          </p>
          <FAQAccordion 
            items={allFaqs}
            title="Kaikki kysymykset"
          />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            Etkö löytänyt vastausta?
          </h2>
          <p className="text-stone-600 mb-8">
            Ota yhteyttä suoraan – autamme mielellämme kaikissa kysymyksissä!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:+358442313546"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb]"
            >
              Soita meille
            </a>
            <a 
              href="mailto:info@hyvantuulensauna.fi"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
            >
              Lähetä sähköposti
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA
        title="Valmis varaamaan?"
        description="Varaa oma saunaelämyksesi nyt ja koe unohtumaton päivä merellä."
        primaryCta={{ text: 'Varaa saunalautta', href: '/saunalauttaristeilyt-helsingissa' }}
        secondaryCta={{ text: 'Julkinen sauna', href: '/julkinen-sauna' }}
        variant="dark"
      />
    </>
  );
}
