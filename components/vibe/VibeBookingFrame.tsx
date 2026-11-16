'use client';

import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { CalendarDays } from 'lucide-react';
import PublicBookingWidget from '@/components/booking/PublicBookingWidget';
import SummerBookingShell from '@/components/booking/SummerBookingShell';
import WinterSaunaBookingShell from '@/components/booking/WinterSaunaBookingShell';
import fiMessages from '@/messages/fi.json';
import enMessages from '@/messages/en.json';
import type { Locale } from './content';

export type VibeBookingKind = 'public' | 'summer' | 'winter';

const copy = {
  public: {
    eyebrow: { fi: 'Varaa paikkasi', en: 'Book your spot' },
    title: { fi: 'Valitse yleinen saunavuoro', en: 'Choose a public sauna session' },
    text: {
      fi: 'Valitse päivä, aika ja liput. Sauna, avanto ja ohjaus sisältyvät hintaan.',
      en: 'Choose your day, time and tickets. Sauna, ice hole and guidance are included.',
    },
  },
  summer: {
    eyebrow: { fi: 'Kesän saunaretki', en: 'Your summer trip' },
    title: { fi: 'Valitse lautta ja aika', en: 'Choose your boat and time' },
    text: {
      fi: 'Aalto tai Virta vain teidän porukallenne. Valitse vapaa risteily kalenterista.',
      en: 'Aalto or Virta just for your group. Choose an available cruise in the calendar.',
    },
  },
  winter: {
    eyebrow: { fi: 'Yksityinen talvisauna', en: 'Your private winter sauna' },
    title: { fi: 'Valitse sauna, päivä ja aika', en: 'Choose your sauna, date and time' },
    text: {
      fi: 'Aalto tai Virta kahdeksi tunniksi kokonaan itsellesi. Avanto sisältyy hintaan.',
      en: 'Aalto or Virta for two hours, entirely yours. The ice hole is included.',
    },
  },
} as const;

function BookingProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={locale === 'en' ? enMessages : fiMessages}>
      {children}
    </NextIntlClientProvider>
  );
}

export default function VibeBookingFrame({ kind, locale }: { kind: VibeBookingKind; locale: Locale }) {
  const text = copy[kind];

  return (
    <section id="varaus" className={`vibe-booking-frame vibe-booking-${kind}`} aria-labelledby={`vibe-booking-${kind}-title`}>
      <div className="vibe-booking-frame-heading">
        <div>
          <p className="vibe-booking-eyebrow">
            <CalendarDays size={17} aria-hidden="true" />
            {text.eyebrow[locale]}
          </p>
          <h2 id={`vibe-booking-${kind}-title`}>{text.title[locale]}</h2>
        </div>
        <p>{text.text[locale]}</p>
      </div>
      <div className="vibe-booking-frame-calendar">
        <BookingProvider locale={locale}>
          {kind === 'public' && <PublicBookingWidget locale={locale} showTitle={false} />}
          {kind === 'summer' && <SummerBookingShell locale={locale} showTitle={false} />}
          {kind === 'winter' && <WinterSaunaBookingShell locale={locale} />}
        </BookingProvider>
      </div>
    </section>
  );
}
