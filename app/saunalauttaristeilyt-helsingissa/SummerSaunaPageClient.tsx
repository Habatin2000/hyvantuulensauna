'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import SquareGallery from '@/components/sections/SquareGallery';
import BoatCard from '@/components/sections/BoatCard';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import SummerBookingShell from '@/components/booking/SummerBookingShell';
import MiniCruiseBookingShell from '@/components/booking/MiniCruiseBookingShell';
import { summerPageHero, summerIntroContent, whyChooseContent } from '@/content/pages';
import { boats } from '@/content/boats';
import { getFAQsByCategory } from '@/content/faq';
import Link from 'next/link';

interface SummerSaunaPageClientProps {
  faqItems: ReturnType<typeof getFAQsByCategory>;
  serviceSchema: any;
  faqSchema: any;
  breadcrumbSchema: any;
  articleSchema: any;
  eventSchema: any;
  howToSchema: any;
  dateModified: string;
}

export default function SummerSaunaPageClient({ 
  faqItems, 
  serviceSchema, 
  faqSchema,
  breadcrumbSchema,
  articleSchema,
  eventSchema,
  howToSchema,
  dateModified
}: SummerSaunaPageClientProps) {
  const [showMiniCruiseBooking, setShowMiniCruiseBooking] = useState(false);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, faqSchema, breadcrumbSchema, articleSchema, eventSchema, howToSchema]),
        }}
      />
      
      <HeroSection 
        content={summerPageHero} 
        variant="page" 
        banner="TARJOUS! Varaa risteily ennen 30.04 ja säästä! 390€/3h (ovh 450€)"
        ctaColor="yellow"
      />
      
      {/* Intro Section with Carousel */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#3b82f6]">
              Tutustu risteilyihimme
            </p>
            <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">
              {summerIntroContent.title}
            </h1>
            <div className="mt-6 space-y-4 text-lg text-stone-600 leading-relaxed whitespace-pre-line">
              {summerIntroContent.text}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <SquareGallery images={[
        { id: '1', src: '/images/gallery-raft-sunset.jpg', alt: 'Saunalautta auringonlaskussa Helsingissä' },
        { id: '2', src: '/images/gallery-aalto-raft.jpeg', alt: 'Aalto-saunalautta Aurinkolahdessa' },
        { id: '3', src: '/images/gallery-virta-deck.jpeg', alt: 'Virran kansi merinäköalalla' },
        { id: '4', src: '/images/gallery-sauna-interior.jpg', alt: 'Puulämmitteinen sauna saunalautalla' },
        { id: '5', src: '/images/gallery-deck-view.jpg', alt: 'Näkymä merelle saunalautalta' },
      ]} title="Tunnelmia saunalautoiltamme" />

      {/* Boat Cards */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#3b82f6]">
              Valitse oma risteilysi
            </p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
              Aalto ja Virta
            </h2>
            <p className="mt-4 text-stone-600">
              Kaksi ainutlaatuista saunalauttaa erilaisiin risteilyihin
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {boats.map((boat) => {
              const descParts = boat.description.split('\n\nMatkasuunnitelma\n\n');
              const mainDescription = descParts[0];
              const itineraryText = descParts[1] || '';
              
              return (
                <BoatCard
                  key={boat.id}
                  id={boat.id}
                  name={boat.name}
                  tagline={boat.id === 'aalto' 
                    ? 'Ankkuroituna merellä – täydellinen isommille seurueille'
                    : 'Risteily saaristossa – intiimimpi kokemus pienemmälle porukalle'
                  }
                  description={mainDescription}
                  itinerary={itineraryText}
                  specs={{
                    maxPeople: boat.features[0],
                    kiuas: boat.features[1],
                    length: boat.features[2],
                    grill: boat.features[3],
                  }}
                  features={boat.features.slice(4)}
                  images={boat.images.map((src, index) => ({
                    id: `${boat.id}-${index}`,
                    src,
                    alt: `${boat.name} saunalautta kuva ${index + 1}`,
                  }))}
                  pricing={{
                    basePrice: boat.pricing.basePrice,
                    currency: boat.pricing.currency,
                    unit: boat.pricing.unit,
                  }}
                  idealFor={boat.idealFor}
                  imageOffset={boat.id === 'virta' ? 'center 80%' : undefined}
                  onBookClick={() => {
                    document.getElementById('varaus')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              );
            })}
          </div>

          {/* Banner - Big groups */}
          <div className="mt-8 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 p-6 text-center">
            <p className="text-[#3b82f6] font-semibold text-lg">
              Isompi porukka? Ota suoraan yhteyttä! Meille mahtuu maksimissaan jopa 25hlö!
            </p>
          </div>

          {/* Banner - Grill help */}
          <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-6 text-center">
            <p className="text-amber-800 font-medium">
              PS. kipparit auttaa grillaamisessa, joten voitte keskittyä olennaiseen ;)
            </p>
          </div>

          {/* Miniristeily Card */}
          <div className="mt-8 grid gap-8 lg:grid-cols-1">
            <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-lg">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-video md:aspect-auto">
                  <img
                    src="/images/gallery-aalto-misty.jpeg"
                    alt="Miniristeily"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Uutuus Badge */}
                  <div className="absolute top-4 left-4 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                    Uutuus
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">Miniristeily</h3>
                  <p className="text-sm text-[#3b82f6] font-medium mb-3">Torstaisin ja sunnuntaisin • Aloitus klo 16.30</p>
                  <p className="text-stone-600 mb-4 text-sm leading-relaxed">
                    Uutuudestaan huolimatta miniristeilyt on meillä klassikko. Näitä vuoroja järjestetään torstaisin ja sunnuntaisin klo 16.30 alkaen. Miniristeily on täydellinen sulle, joka etsit yksityistä saunavuoroa porukalle matalalla kynnyksellä. Kerää kaverit kasaan ja tuu heittää raikkaat löylyt! Näillä risteilyillä maksimikapasiteetti on aina 8hlö.
                  </p>
                  <p className="text-stone-600 mb-4 text-sm leading-relaxed">
                    Miniristeily ei sisällä <strong>Jäitä</strong>, <strong>Grillin käyttöä</strong> tai <strong>kaiutinta</strong>. Omia eväitä saa ottaa.
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-[#3b82f6]">120€</span>
                    <span className="text-stone-500">/ 1.5h</span>
                  </div>
                  <button
                    onClick={() => setShowMiniCruiseBooking(true)}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#2563eb] transition-colors"
                  >
                    Varaa miniristeily
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Calendar */}
      <section id="varaus" className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#3b82f6]">
              Varaa risteilysi
            </p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
              Varauskalenteri
            </h2>

            {/* AI-optimized answer block */}
            <div className="mt-6 mx-auto max-w-2xl rounded-xl bg-white border border-stone-200 p-6 text-left">
              <p className="text-sm text-stone-500 mb-3">
                Päivitetty {new Date(dateModified).toLocaleDateString('fi-FI')}
              </p>
              <p className="text-stone-700 leading-relaxed">
                <strong className="text-stone-900">Saunalautan vuokraus Helsingissä alkaen 130 €/tunti.</strong>{' '}
                Kaksi saunalauttaa – Aalto ja Virta – tarjoavat ainutlaatuisen tavan kokea Itä-Helsingin saaristo.
                <Link href="/julkinen-sauna" className="text-[#3b82f6] hover:underline">Julkiset saunavuorot</Link> ja 
                <Link href="/yksityissauna" className="text-[#3b82f6] hover:underline">yksityistilaisuudet</Link> ovat myös saatavilla.
                Minimivaraus 3 tuntia, hintaan sisältyy kapteeni, sauna, grilli ja juomat.
              </p>
            </div>

            <p className="mt-4 text-stone-600">
              Valitse sopiva päivä ja aika saunalauttaristeilylle
            </p>
          </div>
          <SummerBookingShell />
        </div>
      </section>

      {/* Why Choose Section (SEO Text) */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="rounded-2xl bg-stone-50 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-stone-900 md:text-3xl text-center mb-8">
              {whyChooseContent.title}
            </h2>
            <div className="prose prose-stone mx-auto max-w-none">
              {whyChooseContent.text.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-stone-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion 
        items={faqItems}
        title="Usein kysytyt kysymykset saunalauttaristeilyistä Helsingissä"
      />

      {/* Mini Cruise Booking Modal */}
      {showMiniCruiseBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <MiniCruiseBookingShell onClose={() => setShowMiniCruiseBooking(false)} />
          </div>
        </div>
      )}

      {/* Final CTA */}
      <FinalCTA
        title="Valmis varaamaan saunalauttaristeilyn?"
        description="Kesän parhaat ajat täyttyvät nopeasti. Varaa saunalautta nyt ja koe unohtumaton päivä Itä-Helsingin saaristossa."
        primaryCta={{ text: 'Varaa Risteilysi', href: '#varaus' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358442313546' }}
        variant="dark"
      />
    </>
  );
}
