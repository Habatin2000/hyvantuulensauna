import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/sections/HeroSection';
import BoatComparisonCards from '@/components/sections/BoatComparisonCards';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import { getPrivatePageHero, getUseCases } from '@/content/pages';
import { getBoats } from '@/content/boats';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema, generateArticleSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-sauna-steam.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/yksityissauna`;

  return {
    title: isEn
      ? 'Events & Private Sauna in Helsinki'
      : 'Tapahtumat ja Yksityissauna | Helsinki',
    description: isEn
      ? 'Host your event or private occasion at Hyvän Tuulen Sauna. Bachelor parties, birthdays, team days and corporate events – perfect facilities in a maritime setting.'
      : 'Järjestä tapahtumasi tai yksityistilaisuutesi Hyvän Tuulen Saunalla. Polttarit, synttärit, tyky-päivät ja yritystilaisuudet – täydelliset puitteet merellisessä ympäristössä.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/yksityissauna`,
        'en-US': `${SITE_URL}/en/yksityissauna`,
        'en-GB': `${SITE_URL}/en/yksityissauna`,
        'x-default': `${SITE_URL}/yksityissauna`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Events and Private Sauna | Hyvän Tuulen Sauna'
        : 'Tapahtumat ja Yksityissauna | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Host your event in a maritime sauna. Bachelor parties, birthdays, team days.'
        : 'Järjestä tapahtumasi merellisessä saunassa. Polttarit, synttärit, tyky-päivät.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-sauna-steam.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Private sauna Helsinki - Hyvän Tuulen Sauna'
            : 'Yksityissauna Helsinki - Hyvän Tuulen Sauna',
        },
      ],
    },
  };
}

export default async function PrivateSaunaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/yksityissauna`;

  const faqItems = getFAQsByCategory('private', safeLocale);
  const useCases = getUseCases(safeLocale);
  const boats = getBoats(safeLocale);

  // JSON-LD schemas
  const serviceSchema = generateServiceSchema(
    isEn ? 'Private sauna and events' : 'Yksityissauna ja tapahtumat',
    isEn
      ? 'Sauna sessions for private occasions and event hosting in a maritime setting.'
      : 'Yksityistilaisuuksien saunavuorot ja tapahtumien järjestäminen merellisessä ympäristössä.',
    pageUrl,
    PAGE_IMAGE
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Events' : 'Tapahtumat', url: pageUrl }
  ]);

  const faqSchema = generateFAQSchema(
    faqItems.map(item => ({ question: item.question, answer: item.answer }))
  );

  const articleSchema = generateArticleSchema(
    isEn ? 'Events and Private Sauna Helsinki' : 'Tapahtumat ja Yksityissauna Helsinki',
    isEn
      ? 'Host your event or private occasion at Hyvän Tuulen Sauna. Bachelor parties, birthdays, team days and corporate events in a maritime setting.'
      : 'Järjestä tapahtumasi tai yksityistilaisuutesi Hyvän Tuulen Saunalla. Polttarit, synttärit, tyky-päivät ja yritystilaisuudet merellisessä ympäristössä.',
    pageUrl,
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
        content={getPrivatePageHero(safeLocale)}
        variant="page"
      />

      {/* AI-optimized answer block */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="rounded-xl bg-white border border-stone-200 p-6 md:p-8 text-left">
            <p className="text-sm text-stone-500 mb-4">
              {isEn ? 'Updated' : 'Päivitetty'} {new Date(DATE_MODIFIED).toLocaleDateString(isEn ? 'en-GB' : 'fi-FI')}
            </p>
            <p className="text-stone-700 leading-relaxed">
              {isEn ? (
                <>
                  <strong className="text-stone-900">Hyvän Tuulen Sauna is the perfect venue for private events in Helsinki.</strong>{' '}
                  Organize bachelor parties, birthdays, team days or a corporate event in the maritime setting of Aurinkolahti.
                  Two sauna boats – Aalto and Virta – offer unique facilities for groups of 8–25 people.
                  Book a <Link href="/en/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">sauna boat cruise</Link> and experience Helsinki&apos;s best sauna experience!
                </>
              ) : (
                <>
                  <strong className="text-stone-900">Hyvän Tuulen Sauna on täydellinen paikka yksityistilaisuuksille Helsingissä.</strong>{' '}
                  Järjestä polttarit, syntymäpäivät, tyky-päivät tai yritystilaisuus merellisessä ympäristössä Aurinkolahdessa.
                  Kaksi saunalauttaa – Aalto ja Virta – tarjoavat uniikit puitteet 8–25 hengen ryhmille.
                  Varaa <Link href="/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">saunalauttaristeily</Link> ja koe Helsingin paras saunaelämys!
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
              {isEn ? 'Occasions we are perfect for' : 'Tilaisuudet joihin sovimme täydellisesti'}
            </h2>
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
              {isEn
                ? 'Whether it is a party, a team day or a moment of relaxation – we have a solution'
                : 'Olipa kyseessä sitten juhla, tiimipäivä tai rentoutumishetki – meiltä löytyy ratkaisu'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.id} className="rounded-xl overflow-hidden bg-stone-50">
                <div className="aspect-video relative">
                  <Image
                    src={useCase.image}
                    alt={useCase.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
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
              {isEn ? 'Choose the boat that suits your event' : 'Valitse tilaisuuteesi sopiva lautta'}
            </h2>
            <p className="mt-4 text-stone-600">
              {isEn
                ? 'Two options, both perfect in their own way'
                : 'Kaksi vaihtoehtoa, molemmat täydellisiä omalla tavallaan'}
            </p>
          </div>
          <BoatComparisonCards boats={boats} />
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion
        items={faqItems}
        title={isEn ? 'Frequently asked questions about private events' : 'Usein kysyttyä yksityistilaisuuksista'}
        locale={safeLocale}
      />

      {/* Final CTA */}
      <FinalCTA
        title={isEn ? 'Organize an unforgettable event' : 'Järjestä unohtumaton tapahtuma'}
        description={isEn
          ? 'Get in touch and tell us your wishes. Let’s tailor the perfect sauna experience together!'
          : 'Ota yhteyttä ja kerro toiveistasi. Räätälöidään yhdessä täydellinen saunaelämys!'}
        primaryCta={{ text: isEn ? 'Contact us' : 'Ota yhteyttä', href: 'tel:+358442313546' }}
        secondaryCta={{
          text: isEn ? 'See sauna boats' : 'Katso saunalautat',
          href: isEn ? '/en/saunalauttaristeilyt-helsingissa' : '/saunalauttaristeilyt-helsingissa',
        }}
        variant="dark"
      />
    </>
  );
}
