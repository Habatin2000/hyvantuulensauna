import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/sections/HeroSection';
import PublicBookingWidget from '@/components/booking/PublicBookingWidget';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import { publicPageHero } from '@/content/pages';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema, generateEventSchema, generateHowToSchema } from '../schema';

const PAGE_URL = 'https://hyvantuulensauna.fi/julkinen-sauna';
const PAGE_IMAGE = 'https://hyvantuulensauna.fi/images/gallery-sauna-group.jpg';
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Julkinen Sauna Helsingissä | Saunavuoro Merellä',
  description: 'Tule julkiselle saunavuorolle meren äärelle Aurinkolahteen! Aito puulämmitteinen sauna, avanto ja hyvä tunnelma. Varaa paikkasi nyt – Helsingin uniikein saunaelämys.',
  alternates: {
    canonical: '/julkinen-sauna',
  },
  openGraph: {
    title: 'Julkinen Sauna Helsingissä | Hyvän Tuulen Sauna',
    description: 'Tule julkiselle saunavuorolle meren äärelle! Aito puulämmitteinen sauna ja avanto.',
    url: PAGE_URL,
    images: [
      {
        url: '/images/gallery-sauna-group.jpg',
        width: 1200,
        height: 630,
        alt: 'Julkinen sauna Helsingissä - Hyvän Tuulen Sauna',
      },
    ],
  },
};

export default function PublicSaunaPage() {
  const faqItems = getFAQsByCategory('public');

  // JSON-LD schemas
  const serviceSchema = generateServiceSchema(
    'Julkinen sauna',
    'Avoimet saunavuorot yleisölle Aurinkolahdessa. Puulämmitteinen sauna ja avanto.',
    PAGE_URL,
    PAGE_IMAGE
  );

  const articleSchema = generateArticleSchema(
    'Julkinen Sauna Helsingissä | Saunavuoro Merellä',
    'Tule julkiselle saunavuorolle meren äärelle Aurinkolahteen! Aito puulämmitteinen sauna, avanto ja hyvä tunnelma.',
    PAGE_URL,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const eventSchema = generateEventSchema(
    'Julkinen saunavuoro Hyvän Tuulen Saunalla',
    'Avoin saunavuoro merellisessä ympäristössä Aurinkolahdessa. Kaksi saunaa, grilli, sup-laudat ja loistava tunnelma.',
    PAGE_URL,
    PAGE_IMAGE,
    '2026-05-10T10:00:00+03:00',
    '2026-09-30T20:00:00+03:00',
    'Kalkkihiekantorin laivalaituri'
  );

  const howToSchema = generateHowToSchema(
    'Valmistautuminen julkiselle saunavuorolle',
    'Mitä tarvitset mukaan ja mitä saunavuoro sisältää Hyvän Tuulen Saunalla.',
    [
      { name: 'Oma pyyhe', text: 'Ota oma pyyhe mukaan tai vuokraa meiltä paikan päällä.' },
      { name: 'Uimapuvut', text: 'Pakkaa uimapuvut tai shortsit merellistä saunakokemusta varten.' },
      { name: 'Sandaalit', text: 'Sandaalit tai sisäkengät helpottavat liikkumista laiturilla ja lautalla.' },
      { name: 'Juomapullo', text: 'Oma juomapullo on kätevä – myymme myös kylmiä juomia paikan päällä.' }
    ]
  );

  const faqSchema = generateFAQSchema(
    faqItems.map(item => ({ question: item.question, answer: item.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Etusivu', url: 'https://hyvantuulensauna.fi' },
    { name: 'Julkinen sauna', url: PAGE_URL }
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, articleSchema, eventSchema, howToSchema, faqSchema, breadcrumbSchema]),
        }}
      />

      <HeroSection 
        content={publicPageHero} 
        variant="page"
        ctaColor="teal"
      />

      {/* Booking Widget */}
      <section id="varaus" className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#3b82f6]">
              Varaa paikkasi
            </p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
              Kesän julkiset saunavuorot
            </h2>

            {/* AI-optimized answer block */}
            <div className="mt-6 mx-auto max-w-2xl rounded-xl bg-white border border-stone-200 p-6 text-left">
              <p className="text-stone-700 leading-relaxed">
                <strong className="text-stone-900">Hyvän Tuulen Saunan julkiset saunavuorot</strong> ovat Helsingin uniikein tapa kokea aito puulämmitteinen sauna merellisessä ympäristössä. 
                Vene noutaa sinut <Link href="/sijainti" className="text-[#3b82f6] hover:underline">Kalkkihiekantorin laivalaiturista</Link>, ja kuljetamme sinut saunalautalle, 
                jossa odottavat kaksi kuumaa saunaa, grilli, sup-laudat ja loistava tunnelma. 
                Vuoro kestää kaksi tuntia – 
                <Link href="/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">varaa saunaelämys</Link> ajoissa, 
                paikkoja on rajoitetusti!
              </p>
            </div>

            <div className="mt-4 text-stone-600 max-w-2xl mx-auto space-y-4">
              <p>
                Saunavuorot Hyvän Tuulen Saunalla ovat varmaankin Helsingin uniikein tapa päästä nauttimaan merestä ja saunan lämmöstä.
              </p>
              <p>
                Homma toimii näin: Tulemme hakemaan teidät sovittuun aikaan veneellä Kalkkihiekantorin laivalaiturista, ja kuljetamme teidät saunalautalle. Lautalla on kuumana kaksi saunaa ja grilli. Myymme myös kylmiä juomia. Saunavuoro kestää kaksi tuntia, käytössä on myös sup-lautoja ja tunnelma on taatusti loistava. Nämä ovat kesän hienoimpia matalan kynnyksen saunavuoroja ❤️
              </p>
            </div>
          </div>
          <PublicBookingWidget />
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <p className="text-sm text-stone-500">
              Päivitetty {new Date(DATE_MODIFIED).toLocaleDateString('fi-FI')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-stone-50 p-8">
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                Mitä mukaan?
              </h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>Oma pyyhe (tai vuokraa meiltä)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>Uimapuvut / shortsit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>Sandaalit tai sisäkengät</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>Juomapullo</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-stone-50 p-8">
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                Sisältyy hintaan
              </h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>Puulämmitteinen sauna</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>Avantouintimahdollisuus (talvisin)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>Saunajuomat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>Opastus saunomiseen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion 
        items={faqItems}
        title="Usein kysyttyä julkisesta saunasta"
      />

      {/* Final CTA */}
      <FinalCTA
        title="Tule nauttimaan saunasta"
        description="Varaa paikkasi julkiselle saunavuorolle ja koe aito suomalainen saunaelämys meren äärellä."
        primaryCta={{ text: 'Varaa saunavuoro', href: '#varaus' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358442313546' }}
        variant="dark"
      />
    </>
  );
}
