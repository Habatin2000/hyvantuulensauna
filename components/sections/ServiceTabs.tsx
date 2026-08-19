'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from '@/i18n/navigation';
import BoatCard from './BoatCard';
import PublicBookingWidget from '../booking/PublicBookingWidget';
import { getBoats } from '@/content/boats';
import { useModalA11y } from '@/hooks/useModalA11y';
import type { Locale } from '@/content/homepage';

// 730-line booking shell is only needed when the modal opens — load on demand
const MiniCruiseBookingShell = dynamic(() => import('../booking/MiniCruiseBookingShell'));


const tabs = {
  fi: [
    { id: 'cruises', label: 'Risteilyt' },
    { id: 'mini', label: 'Miniristeily' },
    { id: 'public', label: 'Julkinen sauna' },
  ],
  en: [
    { id: 'cruises', label: 'Cruises' },
    { id: 'mini', label: 'Mini cruise' },
    { id: 'public', label: 'Public sauna' },
  ],
};

interface ServiceTabsProps {
  locale?: Locale;
}

export default function ServiceTabs({ locale = 'fi' }: ServiceTabsProps) {
  const safeLocale = locale === 'en' ? 'en' : 'fi';
  const isEn = safeLocale === 'en';
  const currentTabs = tabs[safeLocale];
  const [activeTab, setActiveTab] = useState('cruises');
  const [showMiniCruiseBooking, setShowMiniCruiseBooking] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const miniCruiseModalRef = useModalA11y<HTMLDivElement>(
    showMiniCruiseBooking,
    () => setShowMiniCruiseBooking(false),
  );
  const router = useRouter();

  const priceLabel = isEn ? 'From 200 € / booking' : 'Alkaen 200 € / varaus';
  const priceSubLabel = isEn
    ? 'From price is for weekday daytime; evenings and weekends are priced separately.'
    : 'Alkaen hinta on arkipäivä, illat ja viikonloput eri hinnalla.';

  const navigateToBoats = () => {
    router.push('/saunalauttaristeilyt-helsingissa#boats');
  };

  // Roving-tabindex arrow-key navigation between tabs (WAI-ARIA tabs pattern)
  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % currentTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + currentTabs.length) % currentTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = currentTabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveTab(currentTabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const localeBoats = getBoats(safeLocale);
  const aaltoBoat = localeBoats.find((b) => b.id === 'aalto');
  const virtaBoat = localeBoats.find((b) => b.id === 'virta');

  // The itinerary section marker inside the boat description is localized
  const itineraryMarker = isEn ? '\n\nItinerary\n\n' : '\n\nMatkasuunnitelma\n\n';

  return (
    <section className="section-padding bg-[#faf9f7]">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
            {isEn ? 'Choose your sauna experience' : 'Valitse oma saunaelämyksesi'}
          </p>
          <h2 className="font-corben text-xl font-bold text-stone-900 md:text-2xl">
            {isEn ? 'Book directly' : 'Varaa suoraan'}
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="flex justify-center mb-6">
          <div
            role="tablist"
            aria-label={isEn ? 'Booking options' : 'Varausvaihtoehdot'}
            className="inline-flex rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-1 shadow-lg shadow-stone-900/5"
          >
            {currentTabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                id={`service-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`service-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-lg shadow-[#3b82f6]/25'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'cruises' && aaltoBoat && virtaBoat && (
            <div
              role="tabpanel"
              id="service-panel-cruises"
              aria-labelledby="service-tab-cruises"
              className="grid min-w-0 gap-4 md:grid-cols-2"
            >
              <BoatCard
                id={aaltoBoat.id}
                name="Aalto"
                tagline={isEn
                  ? 'Anchored at sea – perfect for larger groups'
                  : 'Ankkuroituna merellä – täydellinen isommille seurueille'}
                description={aaltoBoat.description.split(itineraryMarker)[0]}
                itinerary={aaltoBoat.description.split(itineraryMarker)[1] || ''}
                specs={{
                  maxPeople: aaltoBoat.features[0],
                  kiuas: aaltoBoat.features[1],
                  length: aaltoBoat.features[2],
                  grill: aaltoBoat.features[3],
                }}
                features={aaltoBoat.features.slice(4)}
                images={aaltoBoat.images.map((src, index) => ({
                  id: `aalto-${index}`,
                  src,
                  alt: isEn
                    ? `${aaltoBoat.name} sauna boat, photo ${index + 1} of ${aaltoBoat.images.length}`
                    : `Saunalautta ${aaltoBoat.name}, kuva ${index + 1} / ${aaltoBoat.images.length}`,
                }))}
                pricing={{
                  basePrice: aaltoBoat.pricing.basePrice,
                  currency: aaltoBoat.pricing.currency,
                  unit: aaltoBoat.pricing.unit,
                }}
                pricingLabel={
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-stone-900">
                      {priceLabel}
                    </p>
                    <p className="text-[9px] text-stone-500">
                      {priceSubLabel}
                    </p>
                  </div>
                }
                idealFor={aaltoBoat.idealFor}
                onBookClick={navigateToBoats}
                compact
              />
              <BoatCard
                id={virtaBoat.id}
                name="Virta"
                tagline={isEn
                  ? 'Cruise in the archipelago – a more intimate experience for smaller groups'
                  : 'Risteily saaristossa – intiimimpi kokemus pienemmälle porukalle'}
                description={virtaBoat.description.split(itineraryMarker)[0]}
                itinerary={virtaBoat.description.split(itineraryMarker)[1] || ''}
                specs={{
                  maxPeople: virtaBoat.features[0],
                  kiuas: virtaBoat.features[1],
                  length: virtaBoat.features[2],
                  grill: virtaBoat.features[3],
                }}
                features={virtaBoat.features.slice(4)}
                images={virtaBoat.images.map((src, index) => ({
                  id: `virta-${index}`,
                  src,
                  alt: isEn
                    ? `${virtaBoat.name} sauna boat, photo ${index + 1} of ${virtaBoat.images.length}`
                    : `Saunalautta ${virtaBoat.name}, kuva ${index + 1} / ${virtaBoat.images.length}`,
                }))}
                pricing={{
                  basePrice: virtaBoat.pricing.basePrice,
                  currency: virtaBoat.pricing.currency,
                  unit: virtaBoat.pricing.unit,
                }}
                pricingLabel={
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-stone-900">
                      {priceLabel}
                    </p>
                    <p className="text-[9px] text-stone-500">
                      {priceSubLabel}
                    </p>
                  </div>
                }
                idealFor={virtaBoat.idealFor}
                imageOffset="center 80%"
                onBookClick={navigateToBoats}
                compact
              />
            </div>
          )}

          {activeTab === 'mini' && (
            <div
              role="tabpanel"
              id="service-panel-mini"
              aria-labelledby="service-tab-mini"
              className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl overflow-hidden shadow-xl shadow-stone-900/10"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-video md:aspect-auto">
                  <Image
                    src="/images/gallery-aalto-misty.webp"
                    alt={isEn ? 'Mini cruise' : 'Miniristeily'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#3b82f6] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                    {isEn ? 'New' : 'Uutuus'}
                  </div>
                </div>
                <div className="p-5 md:p-7 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-stone-900 mb-1.5">
                    {isEn ? 'Mini Cruise' : 'Miniristeily'}
                  </h3>
                  <p className="text-xs text-[#3b82f6] font-semibold mb-2">
                    {isEn ? 'Sundays • 4:15 PM and 6:15 PM' : 'Sunnuntaisin • Klo 16.15 ja 18.15'}
                  </p>
                  <p className="text-stone-600 mb-3 text-sm leading-relaxed">
                    {isEn
                      ? 'Despite being new, mini cruises are already a classic with us. These cruises run on Sundays at 4:15 PM and 6:15 PM. The mini cruise is perfect for you if you are looking for a private sauna session for your group with a low threshold. Gather your friends and come throw some fresh löyly! The maximum capacity on these cruises is always 8 people.'
                      : 'Uutuudestaan huolimatta miniristeilyt on meillä klassikko. Näitä vuoroja järjestetään sunnuntaisin klo 16.15 ja 18.15. Miniristeily on täydellinen sulle, joka etsit yksityistä saunavuoroa porukalle matalalla kynnyksellä. Kerää kaverit kasaan ja tuu heittää raikkaat löylyt! Näillä risteilyillä maksimikapasiteetti on aina 8hlö.'}
                  </p>
                  <p className="text-stone-600 mb-3 text-sm leading-relaxed">
                    {isEn
                      ? <>Mini cruise does not include <strong>ice</strong>, <strong>grill use</strong> or <strong>speakers</strong>. Own snacks are allowed.</>
                      : <>Miniristeily ei sisällä <strong>Jäitä</strong>, <strong>Grillin käyttöä</strong> tai <strong>kaiutinta</strong>. Omia eväitä saa ottaa.</>}
                  </p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-[#3b82f6]">120€</span>
                    <span className="text-sm text-stone-500">/ 2h</span>
                  </div>
                  <button
                    onClick={() => setShowMiniCruiseBooking(true)}
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-xl shadow-lg shadow-[#3b82f6]/25 hover:shadow-xl hover:shadow-[#3b82f6]/30 hover:-translate-y-0.5 transition-all text-sm w-fit"
                  >
                    {isEn ? 'Book mini cruise' : 'Varaa miniristeily'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'public' && (
            <div
              role="tabpanel"
              id="service-panel-public"
              aria-labelledby="service-tab-public"
              className="space-y-4"
            >
              <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl p-5 shadow-xl shadow-stone-900/10">
                <p className="text-sm text-stone-600 leading-relaxed">
                  {isEn
                    ? "We will pick you up by boat from the Kalkkihiekantori pier at the agreed time and take you to the sauna boat. Two saunas and a grill are kept hot on board. We also sell cold drinks. The sauna session lasts two hours, SUP boards are available and the atmosphere is guaranteed to be great. These are some of the summer's finest low-threshold sauna sessions ❤️"
                    : 'Tulemme hakemaan teidät sovittuun aikaan veneellä Kalkkihiekantorin laivalaiturista, ja kuljetamme teidät saunalautalle. Lautalla on kuumana kaksi saunaa ja grilli. Myymme myös kylmiä juomia. Saunavuoro kestää kaksi tuntia, käytössä on myös sup-lautoja ja tunnelma on taatusti loistava. Nämä ovat kesän hienoimpia matalan kynnyksen saunavuoroja ❤️'}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-sm font-semibold text-amber-900">
                  {isEn
                    ? 'NOTE: Bringing your own food to grill is not allowed on the public sauna session – our skippers run the grill.'
                    : 'HUOM: Omat grillattavat eivät ole sallittuja julkisella saunavuorolla – grilliä pyörittävät kipparimme.'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl p-4 shadow-xl shadow-stone-900/10">
                <PublicBookingWidget locale={safeLocale} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Cruise Booking Modal */}
      {showMiniCruiseBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            ref={miniCruiseModalRef}
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? 'Book a mini cruise' : 'Varaa miniristeily'}
            tabIndex={-1}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          >
            <MiniCruiseBookingShell locale={safeLocale} onClose={() => setShowMiniCruiseBooking(false)} />
          </div>
        </div>
      )}
    </section>
  );
}
