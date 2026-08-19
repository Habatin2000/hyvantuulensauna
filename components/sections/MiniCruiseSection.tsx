'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Booking shell is only needed when the modal opens — load on demand
const MiniCruiseBookingShell = dynamic(() => import('@/components/booking/MiniCruiseBookingShell'));

interface MiniCruiseSectionProps {
  locale: 'fi' | 'en';
}

export default function MiniCruiseSection({ locale }: MiniCruiseSectionProps) {
  const [showMiniCruiseBooking, setShowMiniCruiseBooking] = useState(false);
  const isEn = locale === 'en';

  return (
    <>
      <div className="mt-12 grid gap-5 lg:grid-cols-1">
        <div className="rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl overflow-hidden shadow-2xl shadow-stone-900/10">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-video md:aspect-auto">
              <Image
                src="/images/gallery-aalto-misty.webp"
                alt={isEn ? 'Mini cruise' : 'Miniristeily'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#3b82f6] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                {isEn ? 'New' : 'Uutuus'}
              </div>
            </div>
            <div className="p-5 md:p-7 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-stone-900 mb-1.5">
                {isEn ? 'Mini Cruise' : 'Miniristeily'}
              </h3>
              <p className="text-xs text-[#3b82f6] font-semibold mb-3">
                {isEn
                  ? 'Thursdays and Sundays • Starting at 4:30 PM'
                  : 'Torstaisin ja sunnuntaisin • Aloitus klo 16.30'}
              </p>
              <p className="text-stone-600 mb-3 text-sm leading-relaxed">
                {isEn
                  ? 'Despite being new, mini cruises are already a classic with us. These cruises are organized on Sundays starting at 4:30 PM. The mini cruise is perfect for you who are looking for a private sauna session for your group with a low threshold. Gather your friends and come throw some fresh löyly! The maximum capacity on these cruises is always 8 people.'
                  : 'Uutuudestaan huolimatta miniristeilyt on meillä klassikko. Näitä vuoroja järjestetään sunnuntaisin klo 16.30 alkaen. Miniristeily on täydellinen sulle, joka etsit yksityistä saunavuoroa porukalle matalalla kynnyksellä. Kerää kaverit kasaan ja tuu heittää raikkaat löylyt! Näillä risteilyillä maksimikapasiteetti on aina 8hlö.'}
              </p>
              <p className="text-stone-600 mb-4 text-sm leading-relaxed">
                {isEn
                  ? <>Mini cruise does not include <strong>ice</strong>, <strong>grill use</strong> or <strong>speakers</strong>. Own snacks are allowed.</>
                  : <>Miniristeily ei sisällä <strong>Jäitä</strong>, <strong>Grillin käyttöä</strong> tai <strong>kaiutinta</strong>. Omia eväitä saa ottaa.</>}
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-[#3b82f6]">120€</span>
                <span className="text-sm text-stone-500">/ 1.5h</span>
              </div>
              <button
                onClick={() => setShowMiniCruiseBooking(true)}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-xl shadow-lg shadow-[#3b82f6]/25 hover:shadow-xl hover:shadow-[#3b82f6]/30 hover:-translate-y-0.5 transition-all text-sm"
              >
                {isEn ? 'Book mini cruise' : 'Varaa miniristeily'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Cruise Booking Modal */}
      {showMiniCruiseBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <MiniCruiseBookingShell locale={locale} onClose={() => setShowMiniCruiseBooking(false)} />
          </div>
        </div>
      )}
    </>
  );
}
