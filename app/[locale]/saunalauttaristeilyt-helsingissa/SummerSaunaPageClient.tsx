'use client';

import { useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import SquareGallery from '@/components/sections/SquareGallery';
import BoatCard from '@/components/sections/BoatCard';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import FeatureGrid from '@/components/sections/FeatureGrid';
import SummerBookingShell from '@/components/booking/SummerBookingShell';
import LazyGoogleReviews from '@/components/sections/LazyGoogleReviews';
import AnimatedSection from '@/components/AnimatedSection';
import { getSummerPageHero, getSummerIntroContent, getWhyChooseContent, getArchipelagoContent } from '@/content/pages';
import { getHomepageFeatures } from '@/content/homepage';
import { getBoats } from '@/content/boats';
import { getFAQsByCategory } from '@/content/faq';
import type { Locale } from '@/content/pages';


interface SummerSaunaPageClientProps {
  faqItems: ReturnType<typeof getFAQsByCategory>;
  serviceSchema: Record<string, unknown>;
  faqSchema: Record<string, unknown>;
  breadcrumbSchema: Record<string, unknown>;
  articleSchema: Record<string, unknown>;
  eventSchema: Record<string, unknown>;
  howToSchema: Record<string, unknown>;
  dateModified: string;
  locale: Locale;
}

export default function SummerSaunaPageClient({ 
  faqItems, 
  serviceSchema, 
  faqSchema,
  breadcrumbSchema,
  articleSchema,
  eventSchema,
  howToSchema,
  locale
}: SummerSaunaPageClientProps) {
  const isEn = locale === 'en';

  const summerPageHero = getSummerPageHero(locale);
  const summerIntroContent = getSummerIntroContent(locale);
  const whyChooseContent = getWhyChooseContent(locale);
  const archipelagoContent = getArchipelagoContent(locale);
  const boats = getBoats(locale);
  const homepageFeatures = getHomepageFeatures(locale);

  const [showBooking, setShowBooking] = useState(false);
  const [preSelectedBoat, setPreSelectedBoat] = useState<string | null>(null);

  const priceLabel = isEn ? 'From 200 € / booking' : 'Alkaen 200 € / varaus';
  const priceSubLabel = isEn
    ? 'From price is for weekday daytime; evenings and weekends are priced separately.'
    : 'Alkaen hinta on arkipäivä, illat ja viikonloput eri hinnalla.';

  const openBooking = (boatId?: string) => {
    setPreSelectedBoat(boatId || null);
    setShowBooking(true);
  };

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
        variant="homepage"
      />

      {/* Google Reviews */}
      <LazyGoogleReviews />
      
      {/* Intro Section */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Explore our cruises' : 'Tutustu risteilyihimme'}
            </p>
            <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl lg:text-5xl">
              {summerIntroContent.title}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-600 md:text-lg whitespace-pre-line">
              {summerIntroContent.text}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Image Gallery */}
      <AnimatedSection>
        <SquareGallery images={[
          { id: '1', src: '/images/gallery-sauna-group-new.webp', alt: isEn ? 'Sauna guests in the sauna room' : 'Saunojia löylyhuoneessa' },
          { id: '2', src: '/images/gallery-raft-sunset.webp', alt: isEn ? 'Sauna boat at sunset in Helsinki' : 'Saunalautta auringonlaskussa Helsingissä' },
          { id: '3', src: '/images/gallery-bbq.webp', alt: isEn ? 'Grilling on the boat' : 'Grillailua lautalla' },
          { id: '4', src: '/images/aalto-01.webp', alt: isEn ? 'Aalto sauna boat in Aurinkolahti' : 'Aalto-saunalautta Aurinkolahdessa' },
          { id: '5', src: '/images/gallery-sauna-woman-new.webp', alt: isEn ? 'Sauna guest enjoying the löyly' : 'Saunoja nauttimassa löylyistä' },
          { id: '6', src: '/images/virta-01.webp', alt: isEn ? 'Virta deck with sea view' : 'Virran kansi merinäköalalla' },
          { id: '7', src: '/images/gallery-ice-swimming.webp', alt: isEn ? 'Winter swimming from sauna boat' : 'Talviuinti saunalautalla' },
          { id: '8', src: '/images/gallery-sauna-interior.webp', alt: isEn ? 'Wood-fired sauna on sauna boat' : 'Puulämmitteinen sauna saunalautalla' },
          { id: '9', src: '/images/gallery-deck-chairs.webp', alt: isEn ? 'Relaxing on deck' : 'Rentoutumista kannella' },
          { id: '11', src: '/images/gallery-sauna-guy.webp', alt: isEn ? 'Sauna guest in the löyly' : 'Saunoja löylyissä' },
          { id: '12', src: '/images/gallery-winter-swim.webp', alt: isEn ? 'Ice swimming in winter' : 'Avantouinti talvella' },
        ]} title={isEn ? 'Moments from our sauna boats' : 'Tunnelmia saunalautoiltamme'} />
      </AnimatedSection>

      {/* Boat Cards */}
      <section id="boats" className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center md:mb-16">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Choose your cruise' : 'Valitse oma risteilysi'}
              </p>
              <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl lg:text-5xl">
                {isEn
                  ? 'Aalto and Virta'
                  : 'Aalto ja Virta'}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-stone-500 md:text-lg">
                {isEn
                  ? 'Two unique sauna boats for different kinds of cruises'
                  : 'Kaksi ainutlaatuista saunalauttaa erilaisiin risteilyihin'}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid min-w-0 gap-8 lg:grid-cols-2">
            {boats.map((boat, index) => {
              const descParts = boat.description.split('\n\nItinerary\n\n');
              const mainDescription = descParts.length > 1 ? descParts[0] : boat.description.split('\n\nMatkasuunnitelma\n\n')[0];
              const itineraryText = descParts.length > 1
                ? descParts[1]
                : boat.description.split('\n\nMatkasuunnitelma\n\n')[1] || '';

              return (
                <AnimatedSection key={boat.id} delay={index * 150} className="min-w-0">
                  <BoatCard
                    id={boat.id}
                    name={boat.name}
                    tagline={boat.id === 'aalto'
                      ? (isEn
                          ? 'Anchored at sea – perfect for larger groups'
                          : 'Kelluva keidas')
                      : (isEn
                          ? 'Cruise in the archipelago – a more intimate experience for smaller groups'
                          : 'Risteily saaristossa – intiimimpi kokemus pienemmälle porukalle')
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
                    images={boat.images.map((src, idx) => ({
                      id: `${boat.id}-${idx}`,
                      src,
                      alt: `${boat.name} ${isEn ? 'sauna boat photo' : 'saunalautta kuva'} ${idx + 1}`,
                    }))}
                    pricing={{
                      basePrice: boat.pricing.basePrice,
                      currency: boat.pricing.currency,
                      unit: boat.pricing.unit,
                    }}
                    pricingLabel={
                      <div className="leading-tight">
                        <p className="text-lg font-bold text-stone-900">
                          {priceLabel}
                        </p>
                        <p className="text-xs text-stone-500">
                          {priceSubLabel}
                        </p>
                      </div>
                    }
                    idealFor={boat.idealFor}
                    imageOffset={boat.id === 'virta' ? 'center 80%' : undefined}
                    onBookClick={() => openBooking(boat.id)}
                  />
                </AnimatedSection>
              );
            })}
          </div>

          {/* Info note */}
          <AnimatedSection delay={300}>
            <div className="mt-12 rounded-2xl bg-[#faf9f7] p-6 text-center md:mt-16 md:p-8">
              <p className="text-stone-700">
                {isEn
                  ? <>Need space for up to <span className="font-bold text-stone-900">25 people</span>? Book both boats and ask about our grill master service.</>
                  : <>Tarvitsetko tilaa jopa <span className="font-bold text-stone-900">25 hengelle</span>? Varaa molemmat lautat ja kysy grillimestarin palvelua.</>}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking CTA */}
      <section id={isEn ? 'booking' : 'varaus'} className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-2xl">
          <AnimatedSection>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm md:p-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Book your cruise' : 'Varaa risteilysi'}
              </p>
              <h2 className="font-corben text-2xl font-bold text-stone-900 md:text-3xl">
                {isEn ? 'Ready to book?' : 'Valmis varaamaan?'}
              </h2>
              <p className="mt-3 text-sm text-stone-600">
                {isEn
                  ? 'Choose Aalto or Virta above and open the booking window.'
                  : 'Valitse yläpuolelta Aalto tai Virta ja avaa varausikkuna.'}
              </p>
              <a
                href="#boats"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-lg"
              >
                {isEn ? 'Book a sauna boat' : 'Varaa saunalautta'}
              </a>
              <p className="mt-4 text-xs text-stone-500">
                {isEn
                  ? 'Want to pay later? Ask about availability by phone, WhatsApp, or email!'
                  : 'Haluatko maksaa myöhemmin? Tiedustele saatavuutta puhelimitse, Whatsapilla tai sähköpostilla!'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Extras Section */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="mb-10 text-center md:mb-12">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Extras' : 'Lisää elämyksiä'}
              </p>
              <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl lg:text-5xl">
                {isEn ? 'Additional Services' : 'Lisäpalvelut'}
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Catering */}
            <AnimatedSection delay={100}>
              <div className="h-full rounded-3xl border border-stone-100 bg-[#faf9f7] p-6 md:p-8">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-stone-900">
                  {isEn ? 'Catering' : 'Catering'}
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-stone-900">
                      {isEn ? 'Black Angus Burger 220 g' : 'BLACK ANGUS BURGERI 220G'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {isEn
                        ? 'Restaurant Vilamo burger cooked fresh for you on the sauna boat. Our skipper will cook the burger; vegetarian option available.'
                        : 'Ravintola Vilamon Burgeri paistettuna juuri teille saunalautalla. Kipparimme kokkaa teille burgerin, saatavilla myös vege vaihtehto.'}
                    </p>
                    <p className="mt-2 text-sm font-bold text-amber-600">
                      {isEn ? '€25 / pcs' : '25€/kpl'}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">
                      {isEn ? 'Caesar Salad' : 'Caesarsalaatti'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {isEn
                        ? 'Mediterranean salad from Vilamo, a classic.'
                        : 'Välimerellinen salaatti Vilamosta, klassikko.'}
                    </p>
                    <p className="mt-2 text-sm font-bold text-amber-600">
                      {isEn ? '€20 / serving · min. order 8 pcs' : '20€/annos. Min tilaus 8kpl.'}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Activities */}
            <AnimatedSection delay={200}>
              <div className="h-full rounded-3xl border border-stone-100 bg-[#faf9f7] p-6 md:p-8">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-stone-900">
                  {isEn ? 'Activities' : 'Aktiviteetit'}
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-stone-900">
                      {isEn ? 'Water Jet Ski' : 'VESIJETTI'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {isEn
                        ? '€200 / 2 h. Rental includes fuel and guidance. The jet skis are 130 hp 2022 SEADOO GTI-130s equipped with navigation.'
                        : '200€/2h. Vuokran hinta sisältää polttoaineen ja opastuksen. Vesijetit ovat 130hv 2022 vuoden SEADOO GTI-130 jettejä, varustettuna navigaattoreilla.'}
                    </p>
                    <p className="mt-2 text-sm font-bold text-amber-600">200€/2h</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={300}>
            <div className="mt-8 text-center">
              <p className="text-stone-700">
                {isEn
                  ? 'Contact us for additional services: '
                  : 'Ota lisäpalveluista yhteyttä '}
                <a href="tel:+358442313546" className="font-bold text-[#3b82f6] hover:underline">0442313546</a>
                {isEn ? ' or ' : ' tai sähköpostilla '}
                <a href="mailto:info@hyvantuulensauna.fi" className="font-bold text-[#3b82f6] hover:underline">info@hyvantuulensauna.fi</a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Archipelago Section */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-white p-8 md:p-12 lg:p-16">
              <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'The route' : 'Reitti'}
              </p>
              <h2 className="font-corben mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
                {archipelagoContent.title}
              </h2>
              <div className="prose prose-stone mx-auto max-w-none">
                {archipelagoContent.text.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-base leading-relaxed text-stone-600 md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-[#faf9f7] p-8 md:p-12 lg:p-16">
              <h2 className="font-corben mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
                {whyChooseContent.title}
              </h2>
              <div className="prose prose-stone mx-auto max-w-none">
                {whyChooseContent.text.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-base leading-relaxed text-stone-600 md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Feature Grid */}
      <AnimatedSection>
        <FeatureGrid
          features={homepageFeatures}
          title={isEn ? 'Why choose Hyvän Tuulen Sauna?' : 'Miksi valita Hyvän Tuulen Sauna?'}
          subtitle={isEn ? 'Experiences at sea' : 'Kokemuksia merellä'}
          columns={4}
        />
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection>
        <FAQAccordion
          items={faqItems}
          title={isEn
            ? 'Frequently asked questions about sauna boat cruises in Helsinki'
            : 'Usein kysytyt kysymykset saunalauttaristeilyistä Helsingissä'}
          locale={locale}
        />
      </AnimatedSection>

      {/* Final CTA */}
      <FinalCTA
        title={isEn
          ? 'Ready to book a sauna boat cruise?'
          : 'Valmis varaamaan saunalauttaristeilyn?'}
        description={isEn
          ? 'The best summer slots fill up quickly. Book a sauna boat now and experience an unforgettable day in the Eastern Helsinki archipelago.'
          : 'Kesän parhaat ajat täyttyvät nopeasti. Varaa saunalautta nyt ja koe unohtumaton päivä Itä-Helsingin saaristossa.'}
        primaryCta={{ text: isEn ? 'Book Your Cruise' : 'Varaa Risteilysi', href: '#boats' }}
        secondaryCta={{ text: isEn ? 'Call us' : 'Soita meille', href: 'tel:+358442313546' }}
        variant="dark"
      />

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative flex h-[90vh] max-h-[850px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-2xl">
            <SummerBookingShell
              showTitle={false}
              locale={locale}
              initialBoatId={preSelectedBoat || undefined}
              onClose={() => setShowBooking(false)}
              className="h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
