'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import BoatCard from '@/components/sections/BoatCard';
import WinterSaunaBookingShell from '@/components/booking/WinterSaunaBookingShell';
import PrivateSaunaSneakPeek from '@/components/booking/PrivateSaunaSneakPeek';
import AnimatedSection from '@/components/AnimatedSection';
import { useModalA11y } from '@/hooks/useModalA11y';
import type { Locale } from '@/content/pages';

const AALTO_RESOURCE_ID = '3dd71bee-f303-463e-ad78-e05b4faa2234';
const VIRTA_RESOURCE_ID = '3bffeff6-4ef4-4865-a99b-370b956e355e';

// Winter-only images (summer boat shots removed). No per-sauna winter photos
// exist, so both cards share the same set with a different lead image.
const AALTO_IMAGES = [
  '/images/saunaboat-winter-sun.webp',
  '/images/gallery-winter-dock.webp',
  '/images/gallery-ice-swimming.webp',
  '/images/gallery-avanto-woman.webp',
  '/images/gallery-winter-sunset.webp',
];
const VIRTA_IMAGES = [
  '/images/gallery-winter-sunset.webp',
  '/images/saunaboat-winter-sun.webp',
  '/images/gallery-avanto-woman.webp',
  '/images/gallery-ice-swimming.webp',
  '/images/gallery-winter-dock.webp',
];

interface WinterSaunaCardsProps {
  locale: Locale;
}

export default function WinterSaunaCards({ locale }: WinterSaunaCardsProps) {
  const isEn = locale === 'en';
  const [bookingResource, setBookingResource] = useState<{ id: string; name: string } | null>(null);
  const modalRef = useModalA11y<HTMLDivElement>(
    Boolean(bookingResource),
    () => setBookingResource(null)
  );

  const t = {
    eyebrow: isEn ? 'Two private sauna boats on the ice' : 'Kaksi yksityistä saunalauttaa jäällä',
    title: isEn ? 'Aalto and Virta – private winter saunas' : 'Aalto ja Virta – yksityiset talvisaunat',
    aalto: {
      tagline: isEn ? 'Spacious sauna for larger groups' : 'Tilava sauna isommalle porukalle',
      description: isEn
        ? 'Aalto is our bigger sauna boat, now serving as a winter sauna in Puotila. The wood-fired sauna heats up quickly and the ice hole is right next to it. Perfect for groups of up to ten people.'
        : 'Aalto on isompi saunalauttamme, nyt talvisaunana Puotilassa. Puulämmitteinen sauna lämpenee nopeasti ja avanto odottaa aivan vieressä. Täydellinen enintään kymmenen hengen porukoille.',
      itinerary: isEn
        ? 'Arrive five minutes before your session. The sauna is already warm and our host helps you get started. During the two-hour session you sauna and dip in the ice hole at your own pace — as many times as you like. Cool off on the terrace and enjoy the winter sea view.'
        : 'Tule paikalle viisi minuuttia ennen vuoron alkua. Sauna on jo lämmin ja kipparimme opastaa tarvittaessa. Kahden tunnin vuoron aikana saunot ja pulahteet avannossa omaan tahtiin — niin monta kertaa kuin haluat. Vilvoittele terassilla ja nauti talvisesta merimaisemasta.',
      priceLabel: isEn ? 'From 140 € / 2 h' : 'Alkaen 140 € / 2 h',
      priceNote: isEn ? 'Ice hole included' : 'Avanto sisältyy hintaan',
      idealFor: isEn
        ? ['Bigger groups', 'Team days', 'Birthdays']
        : ['Isommat porukat', 'Tyky-päivät', 'Synttärit'],
    },
    virta: {
      tagline: isEn ? 'An intimate sauna for smaller groups' : 'Intiimi sauna pienemmälle porukalle',
      description: isEn
        ? 'Virta is the cozier of our sauna boats, now a winter sauna in Puotila. The wood-fired sauna keeps the löyly hot and the ice hole is just a few steps away. Ideal for groups of up to six people.'
        : 'Virta on viihtyisämpi saunalauttamme, nyt talvisaunana Puotilassa. Puulämmitteinen sauna pitää löylyt kuumina ja avanto on vain muutaman askeleen päässä. Ihanteellinen enintään kuuden hengen porukoille.',
      itinerary: isEn
        ? 'Arrive five minutes before your session. The sauna is already warm and our host helps you get started. During the two-hour session you sauna and dip in the ice hole at your own pace — as many times as you like. Cool off on the terrace and enjoy the winter sea view.'
        : 'Tule paikalle viisi minuuttia ennen vuoron alkua. Sauna on jo lämmin ja kipparimme opastaa tarvittaessa. Kahden tunnin vuoron aikana saunot ja pulahteet avannossa omaan tahtiin — niin monta kertaa kuin haluat. Vilvoittele terassilla ja nauti talvisesta merimaisemasta.',
      priceLabel: isEn ? 'From 120 € / 2 h' : 'Alkaen 120 € / 2 h',
      priceNote: isEn ? 'Ice hole included' : 'Avanto sisältyy hintaan',
      idealFor: isEn ? ['Small groups', 'Families', 'Friend groups'] : ['Pienet porukat', 'Perheet', 'Kaveriporukat'],
    },
    bookNow: isEn ? 'Book now' : 'Varaa nyt',
    publicCta: {
      title: isEn
        ? 'Public winter swimming and sauna sessions'
        : 'Julkiset talviuinti- ja saunavuorot',
      text: isEn
        ? 'Want to join a guided session instead? On our public sessions the saunas are hot, the ice hole is open and we go through the basics of winter swimming. Spots are limited — book yours!'
        : 'Haluatko mukaan ohjatulle vuorolle? Julkisilla vuoroillamme saunat ovat kuumana, avanto on auki ja käymme läpi talviuinnin perusteet. Paikkoja on rajoitetusti — varaapa omasi!',
      button: isEn ? 'Book a public session' : 'Varaa julkinen vuoro',
    },
  };

  return (
    <>
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          {/* Public session CTA above the sauna cards */}
          <AnimatedSection>
            <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded-3xl bg-lake p-6 md:flex-row md:p-10">
              <div className="text-center md:text-left">
                <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                  {t.publicCta.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
                  {t.publicCta.text}
                </p>
              </div>
              <Link
                href="/julkinen-sauna"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-lake shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {t.publicCta.button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="mb-12 text-center md:mb-16">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {t.eyebrow}
              </p>
              <h2 className="font-display text-3xl font-bold text-stone-900 md:text-4xl lg:text-5xl">
                {t.title}
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid min-w-0 gap-8 lg:grid-cols-2">
            <AnimatedSection className="min-w-0">
              <BoatCard
                id="aalto"
                name={isEn ? 'Sauna boat Aalto' : 'Aalto-sauna'}
                tagline={t.aalto.tagline}
                description={t.aalto.description}
                itinerary={t.aalto.itinerary}
                specs={{
                  maxPeople: isEn ? 'Max. 10 people' : 'Max. 10 hlö',
                  kiuas: 'Harvia',
                  length: isEn ? '12 m length' : '12 m pituus',
                  grill: 'Weber',
                }}
                features={
                  isEn
                    ? ['Ice hole', 'Wood-fired sauna', 'Large terrace', 'Changing room', 'Warm interior']
                    : ['Avanto', 'Puulämmitteinen sauna', 'Iso terassi', 'Pukuhuone', 'Lämpimät sisätilat']
                }
                images={AALTO_IMAGES.map((src, idx) => ({
                  id: `aalto-winter-${idx}`,
                  src,
                  alt: isEn
                    ? `Sauna boat Aalto in winter, photo ${idx + 1} of ${AALTO_IMAGES.length}`
                    : `Aalto-saunalautta talvella, kuva ${idx + 1} / ${AALTO_IMAGES.length}`,
                }))}
                pricing={{ basePrice: 140, currency: 'EUR', unit: '2h' }}
                pricingLabel={
                  <div className="leading-tight">
                    <p className="text-lg font-bold text-stone-900">{t.aalto.priceLabel}</p>
                    <p className="text-xs text-stone-500">{t.aalto.priceNote}</p>
                  </div>
                }
                idealFor={t.aalto.idealFor}
                compact
                onBookClick={() =>
                  setBookingResource({ id: AALTO_RESOURCE_ID, name: isEn ? 'Sauna boat Aalto' : 'Aalto-sauna' })
                }
              />
            </AnimatedSection>

            <AnimatedSection delay={150} className="min-w-0">
              <BoatCard
                id="virta"
                name={isEn ? 'Sauna boat Virta' : 'Virta-sauna'}
                tagline={t.virta.tagline}
                description={t.virta.description}
                itinerary={t.virta.itinerary}
                specs={{
                  maxPeople: isEn ? 'Max. 6 people' : 'Max. 6 hlö',
                  kiuas: 'Harvia',
                  length: isEn ? '10 m length' : '10 m pituus',
                  grill: 'Weber',
                }}
                features={
                  isEn
                    ? ['Ice hole', 'Wood-fired sauna', 'Terrace', 'Changing room']
                    : ['Avanto', 'Puulämmitteinen sauna', 'Terassi', 'Pukuhuone']
                }
                images={VIRTA_IMAGES.map((src, idx) => ({
                  id: `virta-winter-${idx}`,
                  src,
                  alt: isEn
                    ? `Sauna boat Virta in winter, photo ${idx + 1} of ${VIRTA_IMAGES.length}`
                    : `Virta-saunalautta talvella, kuva ${idx + 1} / ${VIRTA_IMAGES.length}`,
                }))}
                pricing={{ basePrice: 120, currency: 'EUR', unit: '2h' }}
                pricingLabel={
                  <div className="leading-tight">
                    <p className="text-lg font-bold text-stone-900">{t.virta.priceLabel}</p>
                    <p className="text-xs text-stone-500">{t.virta.priceNote}</p>
                  </div>
                }
                idealFor={t.virta.idealFor}
                imageOffset="center 80%"
                compact
                onBookClick={() =>
                  setBookingResource({ id: VIRTA_RESOURCE_ID, name: isEn ? 'Sauna boat Virta' : 'Virta-sauna' })
                }
              />
            </AnimatedSection>
          </div>

          <AnimatedSection delay={300} className="mt-10">
            <PrivateSaunaSneakPeek />
          </AnimatedSection>
        </div>
      </section>

      {/* Booking modal */}
      {bookingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? 'Book a private ice sauna' : 'Varaa yksityinen avantosauna'}
            tabIndex={-1}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <WinterSaunaBookingShell
              resourceId={bookingResource.id}
              resourceName={bookingResource.name}
              locale={locale}
              onClose={() => setBookingResource(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
