'use client';

import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { CalendarDays } from 'lucide-react';
import PublicBookingWidget from '@/components/booking/PublicBookingWidget';
import SummerBookingShell from '@/components/booking/SummerBookingShell';
import WinterSaunaBookingShell from '@/components/booking/WinterSaunaBookingShell';
import fiMessages from '@/messages/fi.json';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';
import frMessages from '@/messages/fr.json';
import deMessages from '@/messages/de.json';
import type { Locale } from './content';

export type VibeBookingKind = 'public' | 'summer' | 'winter';

const copy = {
  public: {
    eyebrow: {
      fi: 'Varaa paikkasi',
      en: 'Book your spot',
      es: 'Reserva tu plaza',
      fr: 'Réservez votre place',
      de: 'Sichere dir deinen Platz',
    },
    title: {
      fi: 'Valitse yleinen saunavuoro',
      en: 'Choose a public sauna session',
      es: 'Elige una sesión de sauna pública',
      fr: 'Choisissez une séance de sauna public',
      de: 'Wähle eine öffentliche Saunasession',
    },
    text: {
      fi: 'Valitse päivä, aika ja liput. Sauna, avanto ja ohjaus sisältyvät hintaan.',
      en: 'Choose your day, time and tickets. Sauna, ice hole and guidance are included.',
      es: 'Elige el día, la hora y las entradas. El precio incluye la sauna, el baño en agua helada y la orientación.',
      fr: 'Choisissez le jour, l’heure et les billets. Le sauna, le bain en eau glacée et l’accompagnement sont inclus dans le prix.',
      de: 'Wähle Tag, Uhrzeit und Tickets. Sauna, Eisloch und Anleitung sind im Preis enthalten.',
    },
  },
  summer: {
    eyebrow: {
      fi: 'Kesän saunaretki',
      en: 'Your summer trip',
      es: 'Tu excursión veraniega de sauna',
      fr: 'Votre excursion sauna d’été',
      de: 'Dein sommerlicher Saunaausflug',
    },
    title: {
      fi: 'Valitse lautta ja aika',
      en: 'Choose your boat and time',
      es: 'Elige el barco y el horario',
      fr: 'Choisissez votre bateau et votre horaire',
      de: 'Wähle Boot und Uhrzeit',
    },
    text: {
      fi: 'Aalto tai Virta vain teidän porukallenne. Valitse vapaa risteily kalenterista.',
      en: 'Aalto or Virta just for your group. Choose an available cruise in the calendar.',
      es: 'Aalto o Virta solo para tu grupo. Elige un crucero disponible en el calendario.',
      fr: 'Aalto ou Virta rien que pour votre groupe. Choisissez une croisière disponible dans le calendrier.',
      de: 'Aalto oder Virta ganz für deine Gruppe. Wähle eine verfügbare Fahrt im Kalender.',
    },
  },
  winter: {
    eyebrow: {
      fi: 'Yksityinen talvisauna',
      en: 'Your private winter sauna',
      es: 'Tu sauna privada de invierno',
      fr: 'Votre sauna privé d’hiver',
      de: 'Deine private Wintersauna',
    },
    title: {
      fi: 'Valitse sauna, päivä ja aika',
      en: 'Choose your sauna, date and time',
      es: 'Elige la sauna, el día y la hora',
      fr: 'Choisissez votre sauna, la date et l’heure',
      de: 'Wähle Sauna, Datum und Uhrzeit',
    },
    text: {
      fi: 'Aalto tai Virta kahdeksi tunniksi kokonaan itsellesi. Avanto sisältyy hintaan.',
      en: 'Aalto or Virta for two hours, entirely yours. The ice hole is included.',
      es: 'Aalto o Virta durante dos horas, en exclusiva para ti. El baño en agua helada está incluido.',
      fr: 'Aalto ou Virta pendant deux heures, rien que pour vous. Le bain en eau glacée est inclus.',
      de: 'Aalto oder Virta für zwei Stunden ganz für dich. Das Eisloch ist inklusive.',
    },
  },
} as const;

const bookingMessages = {
  fi: fiMessages,
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
};

function BookingProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={bookingMessages[locale]}>
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
