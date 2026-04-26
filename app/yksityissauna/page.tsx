import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import BoatComparisonCards from '@/components/sections/BoatComparisonCards';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import { privatePageHero, useCases } from '@/content/pages';
import { boats } from '@/content/boats';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema, generateArticleSchema } from '../schema';

const PAGE_URL = 'https://hyvantuulensauna.fi/yksityissauna';
const PAGE_IMAGE = 'https://hyvantuulensauna.fi/images/gallery-sauna-steam.jpg';
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Tapahtumat ja Yksityissauna | Helsinki',
  description: 'Järjestä tapahtumasi tai yksityistilaisuutesi Hyvän Tuulen Saunalla. Polttarit, synttärit, tyky-päivät ja yritystilaisuudet – täydelliset puitteet merellisessä ympäristössä.',

  alternates: {
    canonical: '/yksityissauna',
  },
  openGraph: {
    title: 'Tapahtumat ja Yksityissauna | Hyvän Tuulen Sauna',
    description: 'Järjestä tapahtumasi merellisessä saunassa. Polttarit, synttärit, tyky-päivät.',
    url: 'https://hyvantuulensauna.fi/yksityissauna',
    images: [
      {
        url: '/images/gallery-sauna-steam.jpg',
        width: 1200,
        height: 630,
        alt: 'Yksityissauna Helsinki - Hyvän Tuulen Sauna',
      },
    ],
  },
};

export default function PrivateSaunaPage() {
  const faqItems = getFAQsByCategory('private');

  // JSON-LD schemas
  const serviceSchema = generateServiceSchema(
    'Yksityissauna ja tapahtumat',
    'Yksityistilaisuuksien saunavuorot ja tapahtumien järjestäminen merellisessä ympäristössä.',
    PAGE_URL,
    PAGE_IMAGE
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Etusivu', url: 'https://hyvantuulensauna.fi' },
    { name: 'Tapahtumat', url: PAGE_URL }
  ]);

  const faqSchema = generateFAQSchema(
    faqItems.map(item => ({ question: item.question, answer: item.answer }))
  );

  const articleSchema = generateArticleSchema(
    'Tapahtumat ja Yksityissauna Helsinki',
    'Järjestä tapahtumasi tai yksityistilaisuutesi Hyvän Tuulen Saunalla. Polttarit, synttärit, tyky-päivät ja yritystilaisuudet merellisessä ympäristössä.',
    PAGE_URL,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbSchema, faqSchema, articleSchema]),
        }}
      />

      <HeroSection 
        content={privatePageHero} 
        variant="page"
        ctaColor="yellow"
      />

      {/* AI-optimized answer block */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="rounded-xl bg-white border border-stone-200 p-6 md:p-8 text-left">
            <p className="text-sm text-stone-500 mb-4">
              Päivitetty {new Date(DATE_MODIFIED).toLocaleDateString('fi-FI')}
            </p>
            <p className="text-stone-700 leading-relaxed">
              <strong className="text-stone-900">Hyvän Tuulen Sauna on täydellinen paikka yksityistilaisuuksille Helsingissä.</strong>{' '}
              Järjestä polttarit, syntymäpäivät, tyky-päivät tai yritystilaisuus merellisessä ympäristössä Aurinkolahdessa.
              Kaksi saunalauttaa – Aalto ja Virta – tarjoavat uniikit puitteet 8–25 hengen ryhmille.
              Varaa <a href="/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">saunalauttaristeily</a> ja koe Helsingin paras saunaelämys!
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
              Tilaisuudet joihin sovimme täydellisesti
            </h2>
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
              Olipa kyseessä sitten juhla, tiimipäivä tai rentoutumishetki – 
              meiltä löytyy ratkaisu
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.id} className="rounded-xl overflow-hidden bg-stone-50">
                <div className="aspect-video relative">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-stone-600">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boat Comparison */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
              Valitse tilaisuuteesi sopiva lautta
            </h2>
            <p className="mt-4 text-stone-600">
              Kaksi vaihtoehtoa, molemmat täydellisiä omalla tavallaan
            </p>
          </div>
          <BoatComparisonCards boats={boats} />
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion 
        items={faqItems}
        title="Usein kysyttyä yksityistilaisuuksista"
      />

      {/* Final CTA */}
      <FinalCTA
        title="Järjestä unohtumaton tapahtuma"
        description="Ota yhteyttä ja kerro toiveistasi. Räätälöidään yhdessä täydellinen saunaelämys!"
        primaryCta={{ text: 'Ota yhteyttä', href: 'tel:+358442313546' }}
        secondaryCta={{ text: 'Katso saunalautat', href: '/saunalauttaristeilyt-helsingissa' }}
        variant="dark"
      />
    </>
  );
}
