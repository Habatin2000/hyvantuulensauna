import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import TrustBar from '@/components/sections/TrustBar';
import ServiceCards from '@/components/sections/ServiceCards';
import StorySection from '@/components/sections/StorySection';
import GoogleReviews from '@/components/sections/GoogleReviews';
import FeatureGrid from '@/components/sections/FeatureGrid';
import GalleryPreview from '@/components/sections/GalleryPreview';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import { 
  homepageHero, 
  trustBadges, 
  serviceCards, 
  homepageFeatures,
  galleryPreviewImages,
  storyContent 
} from '@/content/homepage';
import { getFAQsByCategory } from '@/content/faq';
import Link from 'next/link';
import { generateBreadcrumbSchema, generateServiceSchema, generateArticleSchema } from './schema';

const PAGE_URL = 'https://hyvantuulensauna.fi';
const PAGE_IMAGE = 'https://hyvantuulensauna.fi/images/gallery-raft-sunset.jpg';
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

// SEO Metadata for homepage
export const metadata: Metadata = {
  title: 'Hyvän Tuulen Sauna | Saunalautat ja Sauna Helsingissä',
  description: 'Aito suomalainen saunaelämys merellisessä Helsingissä. Varaa saunalautta kesäksi 2026, yksityissauna tai tule julkisille saunavuoroille. Kalkkihiekantori, Aurinkolahti. 8 vuoden kokemuksella!',

  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hyvän Tuulen Sauna | Saunalautat ja Sauna Helsingissä',
    description: 'Aito suomalainen saunaelämys merellisessä Helsingissä. 8 vuoden kokemuksella!',
    url: 'https://hyvantuulensauna.fi',
    images: [
      {
        url: '/images/gallery-raft-sunset.jpg',
        width: 1200,
        height: 630,
        alt: 'Hyvän Tuulen Sauna - Saunalautta auringonlaskussa',
      },
    ],
  },
};

export default function HomePage() {
  const faqItems = getFAQsByCategory('general').slice(0, 4);

  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Etusivu', url: PAGE_URL }
  ]);

  const serviceSchema1 = generateServiceSchema(
    'Saunalauttaristeilyt',
    'Kesäkauden saunalauttaristeilyt Itä-Helsingin saaristossa. Kaksi saunalauttaa: Aalto ja Virta.',
    'https://hyvantuulensauna.fi/saunalauttaristeilyt-helsingissa',
    'https://hyvantuulensauna.fi/images/gallery-deck-view.jpg'
  );

  const serviceSchema2 = generateServiceSchema(
    'Julkinen sauna',
    'Avoimet saunavuorot yleisölle Aurinkolahdessa. Puulämmitteinen sauna ja avanto.',
    'https://hyvantuulensauna.fi/julkinen-sauna',
    'https://hyvantuulensauna.fi/images/gallery-sauna-group.jpg'
  );

  const serviceSchema3 = generateServiceSchema(
    'Yksityistilaisuudet',
    'Yksityistilaisuuksien saunavuorot ja tapahtumien järjestäminen merellisessä ympäristössä.',
    'https://hyvantuulensauna.fi/yksityissauna',
    'https://hyvantuulensauna.fi/images/gallery-sauna-steam.jpg'
  );

  const articleSchema = generateArticleSchema(
    'Hyvän Tuulen Sauna | Saunalautat ja Sauna Helsingissä',
    'Aito suomalainen saunaelämys merellisessä Helsingissä. Varaa saunalautta kesäksi 2026, yksityissauna tai tule julkisille saunavuoroille.',
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
          __html: JSON.stringify([breadcrumbSchema, serviceSchema1, serviceSchema2, serviceSchema3, articleSchema]),
        }}
      />

      <HeroSection 
        content={homepageHero} 
        variant="homepage" 
      />

      {/* Announcement */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="container-padding mx-auto max-w-7xl py-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-1">
            TIEDOTE
          </p>
          <p className="text-base font-medium text-amber-900">
            Palaamme huoltotauolta julkisten vuorojen pariin 10.05 sunnuntaina!
          </p>
        </div>
      </section>
      
      <TrustBar badges={trustBadges} />

      {/* AI-optimized answer block */}
      <section className="py-8 bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-6 md:p-8 text-left">
            <p className="text-sm text-stone-500 mb-4">
              Päivitetty {new Date(DATE_MODIFIED).toLocaleDateString('fi-FI')}
            </p>
            <p className="text-stone-700 leading-relaxed">
              <strong className="text-stone-900">Hyvän Tuulen Sauna tarjoaa aitoja suomalaisia saunaelämyksiä merellisessä Helsingissä.</strong>{' '}
              Kahdeksan vuoden kokemuksella järjestämme <Link href="/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">saunalauttaristeilyjä</Link>,{' '}
              <Link href="/julkinen-sauna" className="text-[#3b82f6] hover:underline">julkisia saunavuoroja</Link> ja{' '}
              <Link href="/yksityissauna" className="text-[#3b82f6] hover:underline">yksityistilaisuuksia</Link> Kalkkihiekantorin laivalaiturista Aurinkolahdessa.
              Kaksi saunalauttaa – Aalto ja Virta – vievät sinut Itä-Helsingin kauniiseen saaristoon.
            </p>
          </div>
        </div>
      </section>
      
      <ServiceCards 
        cards={serviceCards} 
        title="Valitse oma saunaelämyksesi"
        subtitle="Palvelumme"
      />
      
      <StorySection 
        title={storyContent.title}
        quote={storyContent.quote}
        paragraphs={storyContent.paragraphs}
        image={storyContent.image}
      />

      <GoogleReviews />
      
      <FeatureGrid 
        features={homepageFeatures}
        title="Miksi valita Hyvän Tuulen Sauna?"
        subtitle="Kokemuksia merellä"
        columns={4}
      />
      
      <GalleryPreview 
        images={galleryPreviewImages}
        title="Galleria"
        subtitle="Tunnelmia saunalautoiltamme"
      />
      
      <FAQAccordion 
        items={faqItems}
        title="Usein kysyttyä"
        showAllLink
      />
      
      <FinalCTA
        title="Varaa saunaelämys tänään"
        description="Kesän parhaat ajat täyttyvät nopeasti. Varaa omasi nyt ja koe unohtumaton saunapäivä merellä."
        primaryCta={{ text: 'Varaa saunalautta', href: '/saunalauttaristeilyt-helsingissa' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358442313546' }}
        variant="dark"
      />
    </>
  );
}
