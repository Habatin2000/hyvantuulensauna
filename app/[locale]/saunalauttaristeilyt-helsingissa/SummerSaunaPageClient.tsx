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
import {
  getSummerPageHero,
  getSummerIntroContent,
  getWhyChooseContent,
  getArchipelagoContent,
  getCruiseExperienceContent,
  getRentalContent,
  getOccasionContent,
  getIncludedContent,
  getReadyToBookContent,
} from '@/content/pages';
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
  const cruiseExperienceContent = getCruiseExperienceContent(locale);
  const rentalContent = getRentalContent(locale);
  const occasionContent = getOccasionContent(locale);
  const includedContent = getIncludedContent(locale);
  const readyToBookContent = getReadyToBookContent(locale);
  const boats = getBoats(locale);
  const homepageFeatures = getHomepageFeatures(locale);

  const [showBooking, setShowBooking] = useState(false);
  const [preSelectedBoat, setPreSelectedBoat] = useState<string | null>(null);

  const priceLabel = isEn ? 'From €175 / 2h' : 'Alkaen 175 € / 2h';
  const priceSubLabel = isEn
    ? 'Weekday daytime €175–200; evenings and weekends priced separately.'
    : 'Arkisin aamupäivisin 175–200 €, illat ja viikonloput erikseen.';

  const openBooking = (boatId?: string) => {
    setPreSelectedBoat(boatId || null);
    setShowBooking(true);
  };

  const renderParagraphs = (text: string) =>
    text.split('\n\n').map((paragraph, index) => {
      // Render bullet-style paragraphs that start with a title followed by —
      if (paragraph.includes(' — ')) {
        const [title, ...rest] = paragraph.split(' — ');
        return (
          <p key={index} className="mb-3 text-base leading-relaxed text-stone-600 md:text-lg">
            <strong className="text-stone-900">{title}</strong> — {rest.join(' — ')}
          </p>
        );
      }
      return (
        <p key={index} className="mb-4 text-base leading-relaxed text-stone-600 md:text-lg">
          {paragraph}
        </p>
      );
    });

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

      {/* Intro: Saunatila Helsingissä */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Private sauna space' : 'Yksityinen saunatila'}
            </p>
            <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl lg:text-5xl">
              {summerIntroContent.title}
            </h2>
            <div className="mt-6 text-left">
              {renderParagraphs(summerIntroContent.text)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Boat Cards */}
      <section id="boats" className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center md:mb-16">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Two unique sauna boats' : 'Kaksi ainutlaatuista saunalauttaa'}
              </p>
              <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl lg:text-5xl">
                {isEn ? 'Aalto and Virta' : 'Aalto ja Virta'}
              </h2>
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
                          ? 'Floating oasis for larger groups'
                          : 'Kelluva keidas suuremmalle seurueelle')
                      : (isEn
                          ? 'A more intimate sauna experience for smaller groups'
                          : 'Intiimimpi saunakokemus pienemmälle porukalle')
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
        </div>
      </section>

      {/* Saunalauttaristeily Helsingissä */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Cruise' : 'Risteily'}
            </p>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {cruiseExperienceContent.title}
            </h2>
            <div className="text-left">
              {renderParagraphs(cruiseExperienceContent.text)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Saunalautan vuokraus Helsingissä */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Rental' : 'Vuokraus'}
            </p>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {rentalContent.title}
            </h2>
            <div className="text-left">
              {rentalContent.text.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('•') || paragraph.startsWith('-')) {
                  return (
                    <ul key={index} className="my-4 list-disc space-y-1 pl-6 text-stone-600 md:text-lg">
                      {paragraph.split('\n').filter(Boolean).map((item, i) => (
                        <li key={i}>{item.replace(/^[•\-]\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="mb-4 text-base leading-relaxed text-stone-600 md:text-lg">
                    {paragraph}
                  </p>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <a
                href={isEn ? '/en/contact' : '/yhteys'}
                className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-lg"
              >
                {isEn ? 'Ask about free slots' : 'Kysy vapaista ajankohdista'}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Saunalautta polttareihin, juhliin ja tyky-päivään */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {occasionContent.title}
            </h2>
            <div className="text-left">
              {renderParagraphs(occasionContent.text)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mitä saunalautan hintaan kuuluu? */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {includedContent.title}
            </h2>
            <div className="text-left">
              {includedContent.text.split('\n\n').map((block, index) => {
                const items = block.split('\n').filter(Boolean);
                if (items.length > 1 && !items[0].includes(' — ')) {
                  return (
                    <ul key={index} className="mb-6 grid list-none gap-3 sm:grid-cols-2">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-stone-700 md:text-lg">
                          <span className="text-[#3b82f6]">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="mb-4 text-base leading-relaxed text-stone-600 md:text-lg">
                    {block}
                  </p>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Image Gallery */}
      <AnimatedSection>
        <SquareGallery images={[
          { id: '1', src: '/images/gallery-sunset-raft.webp', alt: isEn ? 'Sauna boat in Helsinki on a summer evening' : 'Saunalautta Helsingissä kesäillalla' },
          { id: '2', src: '/images/gallery-sauna-interior.webp', alt: isEn ? 'Sauna on sauna boat Aalto' : 'Saunomista saunalautta Aallolla' },
          { id: '3', src: '/images/gallery-virta-deck.webp', alt: isEn ? 'Sauna boat Virta in the Eastern Helsinki archipelago' : 'Saunalautta Virta Itä-Helsingin saaristossa' },
          { id: '4', src: '/images/gallery-sauna-steam.webp', alt: isEn ? 'Wood-fired sauna on a sauna boat' : 'Puulämmitteinen sauna saunalautalla' },
          { id: '5', src: '/images/gallery-deck-view.webp', alt: isEn ? 'Sauna boat terrace with sea view' : 'Saunalautan terassi merinäköalalla' },
          { id: '6', src: '/images/gallery-bbq.webp', alt: isEn ? 'Grilling on a sauna boat in Helsinki' : 'Grillausta saunalautalla Helsingissä' },
          { id: '7', src: '/images/gallery-ice-swimming.webp', alt: isEn ? 'Ice swimming from a sauna boat' : 'Avantouintia saunalautalla' },
        ]} title={isEn ? 'Moments from our sauna boats' : 'Tunnelmia saunalautoiltamme'} />
      </AnimatedSection>

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
              <div className="text-left">
                {renderParagraphs(archipelagoContent.text)}
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
              <div className="text-left">
                {renderParagraphs(whyChooseContent.text)}
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

      {/* Extras Section */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="mb-10 text-center md:mb-12">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Extras' : 'Lisää elämyksiä'}
              </p>
              <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl lg:text-5xl">
                {isEn ? 'Additional services' : 'Lisäpalvelut'}
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
                      {isEn ? 'Black Angus Burger 220 g' : 'Black Angus Burgeri 220 g'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {isEn
                        ? 'Restaurant Vilamo burger cooked fresh for you on the sauna boat. Vegetarian option available.'
                        : 'Ravintola Vilamon burgeri valmistettuna saunalautalla. Saatavilla myös vegetarinen vaihtoehto.'}
                    </p>
                    <p className="mt-2 text-sm font-bold text-amber-600">
                      {isEn ? '€25 / pcs' : '25 € / kpl'}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">
                      {isEn ? 'Caesar Salad' : 'Caesarsalaatti'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {isEn
                        ? 'Mediterranean salad from Vilamo.'
                        : 'Välimerellinen salaatti Vilamosta.'}
                    </p>
                    <p className="mt-2 text-sm font-bold text-amber-600">
                      {isEn ? '€20 / serving · min. order 8 pcs' : '20 € / annos. Minimitilaus 8 kpl.'}
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
                      {isEn ? 'Water jet ski' : 'Vesijetti'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {isEn
                        ? '€200 / 2 h. Rental includes fuel and guidance.'
                        : '200 € / 2 h. Vuokra sisältää polttoaineen ja opastuksen.'}
                    </p>
                    <p className="mt-2 text-sm font-bold text-amber-600">200 € / 2 h</p>
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

      {/* Ready to book CTA */}
      <section id={isEn ? 'booking' : 'varaus'} className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-2xl">
          <AnimatedSection>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm md:p-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Book your sauna boat' : 'Varaa saunalautta'}
              </p>
              <h2 className="font-corben text-2xl font-bold text-stone-900 md:text-3xl">
                {readyToBookContent.title}
              </h2>
              <div className="mt-4 text-left text-sm text-stone-600 md:text-base">
                {readyToBookContent.text.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>
              <a
                href="#boats"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-lg"
              >
                {isEn ? 'Book a sauna boat' : 'Varaa saunalautta'}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

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
        primaryCta={{ text: isEn ? 'Book your cruise' : 'Varaa risteilysi', href: '#boats' }}
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
