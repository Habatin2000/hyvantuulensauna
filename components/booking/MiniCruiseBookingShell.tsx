'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  ChevronRight,
  Info,
  Loader2,
  ChevronLeft,
  User,
  Mail,
  Phone,
  Ship
} from 'lucide-react';
import SummerCalendar from './SummerCalendar';
import { boats as boatContent } from '@/content/boats';
import type { Locale } from '@/content/pages';
import { trackBookingStarted, trackBookingCompleted, trackAdsPurchase } from '@/lib/analytics';
import { getAttribution } from '@/lib/attribution';
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase, trackSchedule } from '@/lib/meta';

const MINI_CRUISE_SERVICE_ID = '533f08d0-c5ab-4358-a300-6d87295a2a26';
const AALTO_RESOURCE_ID = '3dd71bee-f303-463e-ad78-e05b4faa2234';
const VIRTA_RESOURCE_ID = '3bffeff6-4ef4-4865-a99b-370b956e355e';
const TIME_ZONE = 'Europe/Helsinki';

const localeTags = {
  fi: 'fi-FI',
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
} as const;

// Format date to YYYY-MM-DD in Helsinki timezone
const formatDateInHelsinki = (date: Date): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const getMaxCapacity = (boatId: string): number | undefined =>
  boatContent.find((b) => b.id === boatId)?.capacity.max;

const cruiseBoats = [
  { id: AALTO_RESOURCE_ID, contentId: 'aalto', name: 'Aalto' },
  { id: VIRTA_RESOURCE_ID, contentId: 'virta', name: 'Virta' },
];

interface TimeSlot {
  startTime: string;
  duration: string;
  spotsAvailable: number;
  resourceId: string;
  price: { amount: number; currency: string; comparedAmount?: number } | null;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface MiniCruiseBookingShellProps {
  onClose?: () => void;
  locale?: Locale;
}

const miniCruiseCopy = {
  fi: {
    title: 'Varaa miniristeily',
    close: 'Sulje',
    steps: ['Vene', 'Päivä ja aika', 'Yhteystiedot', 'Vahvistus'],
    selectBoat: 'Valitse saunalautta',
    selectBoatSubtitle: 'Miniristeily on saatavilla molemmilla saunalautoillamme.',
    selectDate: 'Valitse päivämäärä',
    selectDateSubtitle: 'Miniristeilyt saatavilla sunnuntaisin.',
    loadingCalendar: 'Ladataan kalenteria...',
    changeDay: 'Vaihda päivä',
    selectTime: 'Valitse aloitusaika',
    loadingTimes: 'Ladataan aikoja...',
    noSlots: 'Ei vapaita aikoja valitulle päivälle',
    chooseAnotherDay: 'Valitse toinen päivä',
    contactTitle: 'Yhteystiedot',
    firstName: 'Etunimi',
    lastName: 'Sukunimi',
    email: 'Sähköposti',
    phone: 'Puhelinnumero',
    marketingConsent: 'Haluan saada Hyv\u00e4n Tuulen Saunan tarjouksia ja uutisia s\u00e4hk\u00f6postiini. Voin perua suostumuksen milloin tahansa. (Vapaaehtoinen)',
    firstNamePlaceholder: 'Matti',
    lastNamePlaceholder: 'Meikäläinen',
    emailPlaceholder: 'matti@example.com',
    summary: 'Varauksen yhteenveto',
    boat: 'Vene',
    date: 'Päivämäärä',
    time: 'Aika',
    booker: 'Varaaja',
    total: 'Yhteensä',
    paymentInfoTitle: 'Maksutiedot',
    paymentInfoText: 'Painamalla "Siirry maksuun" ohjaudut turvalliseen maksujärjestelmään. Varaus vahvistuu maksun jälkeen.',
    successTitle: 'Varaus vahvistettu!',
    successText: 'Miniristeily on nyt varattu sinulle. Vahvistus on lähetetty sähköpostiisi.',
    bookingNumber: 'Varausnumero',
    back: 'Takaisin',
    continue: 'Jatka',
    proceedToPayment: 'Siirry maksuun',
    submitting: 'Varataan...',
    errorLoadDates: 'Päivämäärien lataaminen epäonnistui',
    errorLoadSlots: 'Aikojen lataaminen epäonnistui',
    errorSelectBoatAndTime: 'Valitse vene ja aika ennen varausta',
    errorBookingFailed: 'Varauksen luominen epäonnistui',
    previousDay: 'Edellinen päivä',
    nextDay: 'Seuraava päivä',
    selectBoatOption: (name: string) => `Valitse ${name}`,
    selectTimeOption: (time: string, price: string) => `Valitse klo ${time}, ${price}`,
    capacity: (boatId: string) => `Max ${getMaxCapacity(boatId)} hlö`,
  },
  en: {
    title: 'Book a mini cruise',
    close: 'Close',
    steps: ['Boat', 'Date & time', 'Contact details', 'Confirmation'],
    selectBoat: 'Choose a sauna boat',
    selectBoatSubtitle: 'The mini cruise is available on both of our sauna boats.',
    selectDate: 'Choose a date',
    selectDateSubtitle: 'Mini cruises are available on Sundays.',
    loadingCalendar: 'Loading calendar...',
    changeDay: 'Change day',
    selectTime: 'Choose a start time',
    loadingTimes: 'Loading times...',
    noSlots: 'No available times for the selected day',
    chooseAnotherDay: 'Choose another day',
    contactTitle: 'Contact details',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    marketingConsent: 'I want to receive offers and news from Hyv\u00e4n Tuulen Sauna by email. I can withdraw my consent at any time. (Optional)',
    firstNamePlaceholder: 'John',
    lastNamePlaceholder: 'Doe',
    emailPlaceholder: 'john@example.com',
    summary: 'Booking summary',
    boat: 'Boat',
    date: 'Date',
    time: 'Time',
    booker: 'Booked by',
    total: 'Total',
    paymentInfoTitle: 'Payment details',
    paymentInfoText: 'By clicking "Proceed to payment" you will be redirected to a secure payment system. The booking is confirmed after payment.',
    successTitle: 'Booking confirmed!',
    successText: 'The mini cruise is now booked for you. A confirmation has been sent to your email.',
    bookingNumber: 'Booking number',
    back: 'Back',
    continue: 'Continue',
    proceedToPayment: 'Proceed to payment',
    submitting: 'Booking...',
    errorLoadDates: 'Failed to load dates',
    errorLoadSlots: 'Failed to load times',
    errorSelectBoatAndTime: 'Select a boat and time before booking',
    errorBookingFailed: 'Failed to create booking',
    previousDay: 'Previous day',
    nextDay: 'Next day',
    selectBoatOption: (name: string) => `Select ${name}`,
    selectTimeOption: (time: string, price: string) => `Select ${time}, ${price}`,
    capacity: (boatId: string) => `Max ${getMaxCapacity(boatId)} people`,
  },
  es: {
    title: 'Reserva un minicrucero',
    close: 'Cerrar',
    steps: ['Barco', 'Fecha y hora', 'Datos de contacto', 'Confirmación'],
    selectBoat: 'Elige un barco sauna',
    selectBoatSubtitle: 'El minicrucero está disponible en nuestros dos barcos sauna.',
    selectDate: 'Elige una fecha',
    selectDateSubtitle: 'Los minicruceros están disponibles los domingos.',
    loadingCalendar: 'Cargando calendario...',
    changeDay: 'Cambiar de día',
    selectTime: 'Elige una hora de inicio',
    loadingTimes: 'Cargando horarios...',
    noSlots: 'No hay horarios disponibles para el día seleccionado',
    chooseAnotherDay: 'Elige otro día',
    contactTitle: 'Datos de contacto',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    email: 'Correo electrónico',
    phone: 'Número de teléfono',
    marketingConsent: 'Quiero recibir ofertas y novedades de Hyvän Tuulen Sauna por correo electrónico. Puedo retirar mi consentimiento en cualquier momento. (Opcional)',
    firstNamePlaceholder: 'Juan',
    lastNamePlaceholder: 'García',
    emailPlaceholder: 'juan@example.com',
    summary: 'Resumen de la reserva',
    boat: 'Barco',
    date: 'Fecha',
    time: 'Hora',
    booker: 'Titular de la reserva',
    total: 'Total',
    paymentInfoTitle: 'Datos de pago',
    paymentInfoText: 'Al hacer clic en «Ir al pago», accederás a un sistema de pago seguro. La reserva se confirmará después del pago.',
    successTitle: '¡Reserva confirmada!',
    successText: 'Tu minicrucero ya está reservado. Hemos enviado una confirmación a tu correo electrónico.',
    bookingNumber: 'Número de reserva',
    back: 'Volver',
    continue: 'Continuar',
    proceedToPayment: 'Ir al pago',
    submitting: 'Reservando...',
    errorLoadDates: 'No se han podido cargar las fechas',
    errorLoadSlots: 'No se han podido cargar los horarios',
    errorSelectBoatAndTime: 'Selecciona un barco y una hora antes de reservar',
    errorBookingFailed: 'No se ha podido crear la reserva',
    previousDay: 'Día anterior',
    nextDay: 'Día siguiente',
    selectBoatOption: (name: string) => `Seleccionar ${name}`,
    selectTimeOption: (time: string, price: string) => `Seleccionar las ${time}, ${price}`,
    capacity: (boatId: string) => `Máx. ${getMaxCapacity(boatId)} personas`,
  },
  fr: {
    title: 'Réservez une mini-croisière',
    close: 'Fermer',
    steps: ['Bateau', 'Date et heure', 'Coordonnées', 'Confirmation'],
    selectBoat: 'Choisissez un bateau-sauna',
    selectBoatSubtitle: 'La mini-croisière est disponible à bord de nos deux bateaux-saunas.',
    selectDate: 'Choisissez une date',
    selectDateSubtitle: 'Les mini-croisières sont disponibles le dimanche.',
    loadingCalendar: 'Chargement du calendrier...',
    changeDay: 'Changer de date',
    selectTime: 'Choisissez une heure de départ',
    loadingTimes: 'Chargement des horaires...',
    noSlots: 'Aucun horaire disponible pour la date sélectionnée',
    chooseAnotherDay: 'Choisissez une autre date',
    contactTitle: 'Coordonnées',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Numéro de téléphone',
    marketingConsent: 'Je souhaite recevoir les offres et actualités de Hyvän Tuulen Sauna par e-mail. Je peux retirer mon consentement à tout moment. (Facultatif)',
    firstNamePlaceholder: 'Jean',
    lastNamePlaceholder: 'Dupont',
    emailPlaceholder: 'jean@example.com',
    summary: 'Récapitulatif de la réservation',
    boat: 'Bateau',
    date: 'Date',
    time: 'Horaire',
    booker: 'Réservé par',
    total: 'Total',
    paymentInfoTitle: 'Informations de paiement',
    paymentInfoText: 'En cliquant sur « Procéder au paiement », vous accéderez à un système de paiement sécurisé. La réservation sera confirmée après le paiement.',
    successTitle: 'Réservation confirmée !',
    successText: 'Votre mini-croisière est désormais réservée. Une confirmation a été envoyée à votre adresse e-mail.',
    bookingNumber: 'Numéro de réservation',
    back: 'Retour',
    continue: 'Continuer',
    proceedToPayment: 'Procéder au paiement',
    submitting: 'Réservation en cours...',
    errorLoadDates: 'Impossible de charger les dates',
    errorLoadSlots: 'Impossible de charger les horaires',
    errorSelectBoatAndTime: 'Sélectionnez un bateau et un horaire avant de réserver',
    errorBookingFailed: 'Impossible de créer la réservation',
    previousDay: 'Jour précédent',
    nextDay: 'Jour suivant',
    selectBoatOption: (name: string) => `Sélectionner ${name}`,
    selectTimeOption: (time: string, price: string) => `Sélectionner le créneau de ${time}, ${price}`,
    capacity: (boatId: string) => `Max. ${getMaxCapacity(boatId)} personnes`,
  },
  de: {
    title: 'Minikreuzfahrt buchen',
    close: 'Schließen',
    steps: ['Boot', 'Datum und Uhrzeit', 'Kontaktdaten', 'Bestätigung'],
    selectBoat: 'Saunaboot auswählen',
    selectBoatSubtitle: 'Die Minikreuzfahrt ist auf beiden Saunabooten verfügbar.',
    selectDate: 'Datum auswählen',
    selectDateSubtitle: 'Minikreuzfahrten finden sonntags statt.',
    loadingCalendar: 'Kalender wird geladen...',
    changeDay: 'Tag wechseln',
    selectTime: 'Startzeit auswählen',
    loadingTimes: 'Termine werden geladen...',
    noSlots: 'Für den gewählten Tag sind keine Termine verfügbar',
    chooseAnotherDay: 'Anderen Tag auswählen',
    contactTitle: 'Kontaktdaten',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    phone: 'Telefonnummer',
    marketingConsent: 'Ich möchte Angebote und Neuigkeiten von Hyvän Tuulen Sauna per E-Mail erhalten. Ich kann meine Einwilligung jederzeit widerrufen. (Optional)',
    firstNamePlaceholder: 'Max',
    lastNamePlaceholder: 'Mustermann',
    emailPlaceholder: 'max@example.com',
    summary: 'Buchungsübersicht',
    boat: 'Boot',
    date: 'Datum',
    time: 'Uhrzeit',
    booker: 'Gebucht von',
    total: 'Gesamt',
    paymentInfoTitle: 'Zahlungsinformationen',
    paymentInfoText: 'Wenn Sie auf „Zur Zahlung“ klicken, werden Sie zu einem sicheren Zahlungssystem weitergeleitet. Die Buchung wird nach der Zahlung bestätigt.',
    successTitle: 'Buchung bestätigt!',
    successText: 'Ihre Minikreuzfahrt ist jetzt reserviert. Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.',
    bookingNumber: 'Buchungsnummer',
    back: 'Zurück',
    continue: 'Weiter',
    proceedToPayment: 'Zur Zahlung',
    submitting: 'Buchung läuft...',
    errorLoadDates: 'Die Termine konnten nicht geladen werden',
    errorLoadSlots: 'Die Uhrzeiten konnten nicht geladen werden',
    errorSelectBoatAndTime: 'Wählen Sie vor der Buchung ein Boot und eine Uhrzeit aus',
    errorBookingFailed: 'Die Buchung konnte nicht erstellt werden',
    previousDay: 'Vorheriger Tag',
    nextDay: 'Nächster Tag',
    selectBoatOption: (name: string) => `${name} auswählen`,
    selectTimeOption: (time: string, price: string) => `${time} Uhr auswählen, ${price}`,
    capacity: (boatId: string) => `Max. ${getMaxCapacity(boatId)} Personen`,
  },
} as const;

export default function MiniCruiseBookingShell({ onClose, locale = 'fi' }: MiniCruiseBookingShellProps) {
  const t = miniCruiseCopy[locale];

  const requestIdRef = useRef(0);
  
  const [step, setStep] = useState(1);
  const [selectedBoat, setSelectedBoat] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [marketingConsent, setMarketingConsent] = useState(false);
  
  // API states
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [datesWithSlots, setDatesWithSlots] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [monthSlotsByDate, setMonthSlotsByDate] = useState<Record<string, TimeSlot[]>>({});
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingMonthData, setIsLoadingMonthData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ bookingId?: string; confirmationCode?: string } | null>(null);

  // Fetch available dates when boat is selected
  useEffect(() => {
    if (!selectedBoat) return;
    
    const fetchDates = async () => {
      setIsLoadingDates(true);
      setError(null);
      try {
        const res = await fetch('/api/bookla/minicruise/dates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            serviceId: MINI_CRUISE_SERVICE_ID,
            resourceId: selectedBoat 
          }),
        });
        
        if (!res.ok) throw new Error('Failed to fetch dates');
        
        const data = await res.json();
        setAvailableDates(data.dates || []);
      } catch (e) {
        console.error('Error fetching dates:', e);
        setError(t.errorLoadDates);
      } finally {
        setIsLoadingDates(false);
      }
    };
    
    fetchDates();
  }, [selectedBoat, t.errorLoadDates]);

  // Fetch time slots when date or boat changes
  useEffect(() => {
    if (!selectedBoat || !selectedDate) return;
    
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setError(null);
      try {
        const res = await fetch('/api/bookla/minicruise/times', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            date: selectedDate, 
            serviceId: MINI_CRUISE_SERVICE_ID,
            resourceId: selectedBoat
          }),
        });
        
        if (!res.ok) throw new Error('Failed to fetch slots');
        
        const data = await res.json();
        setTimeSlots(data.slots || []);
        if (data.slots && data.slots.length > 0) {
          setDatesWithSlots(prev => [...new Set([...prev, selectedDate])]);
        }
      } catch (e) {
        console.error('Error fetching slots:', e);
        setError(t.errorLoadSlots);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    
    fetchSlots();
  }, [selectedBoat, selectedDate, t.errorLoadSlots]);

  // Fetch available times for the month
  const fetchMonthSlots = async (year: number, month: number) => {
    if (!selectedBoat) return;
    
    const currentRequestId = ++requestIdRef.current;
    
    setIsLoadingMonthData(true);
    
    try {
      const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const to = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`;
      
      const res = await fetch('/api/bookla/minicruise/times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          from,
          to,
          serviceId: MINI_CRUISE_SERVICE_ID,
          resourceId: selectedBoat
        }),
      });
      
      if (!res.ok) {
        setIsLoadingMonthData(false);
        return;
      }
      
      const data = await res.json();
      const slotsByDate = data.slotsByDate || {};
      
      // All dates with any slots are considered available
      const datesWithAnySlots = Object.keys(slotsByDate).filter(date => 
        slotsByDate[date] && slotsByDate[date].length > 0
      );
      
      if (currentRequestId === requestIdRef.current) {
        setMonthSlotsByDate(slotsByDate);
        setDatesWithSlots(datesWithAnySlots);
      }
    } catch (e) {
      console.error('Error fetching month times:', e);
    } finally {
      setIsLoadingMonthData(false);
    }
  };

  // Navigate to prev/next day
  const navigateDay = (direction: 'prev' | 'next') => {
    if (!selectedDate) return;
    const date = new Date(selectedDate + 'T12:00:00');
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    const newDateStr = formatDateInHelsinki(date);
    setSelectedDate(newDateStr);
    setTimeSlots(monthSlotsByDate[newDateStr] || []);
    setSelectedSlot(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(localeTags[locale], {
      weekday: 'short',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(localeTags[locale], { hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (cents: number | null | undefined) => {
    if (!cents) return '0 €';
    return `${(cents / 100).toFixed(0)} €`;
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const h = parseInt(match?.[1] || '0', 10);
    const m = parseInt(match?.[2] || '0', 10);
    if (h && m) return `${h} h ${m} min`;
    if (h) return `${h} h`;
    return `${m} min`;
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedBoat) {
      setError(t.errorSelectBoatAndTime);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch('/api/bookla/minicruise/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: selectedSlot.startTime,
          duration: selectedSlot.duration,
          serviceId: MINI_CRUISE_SERVICE_ID,
          resourceId: selectedBoat,
          client: {
            email: customerInfo.email,
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            phone: customerInfo.phone
          },
          spots: 1,
          attribution: {
            ...getAttribution(),
            itemName: 'Miniristeily (yksityinen 1,5 h)',
            value: selectedSlot?.price ? selectedSlot.price.amount / 100 : 120,
          },
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || t.errorBookingFailed);
      }
      
      setBookingResult(data);

      const value = selectedSlot?.price ? selectedSlot.price.amount / 100 : 120;
      const txId = data.bookingId || 'minicruise-' + Date.now();
      if (data.requiresPayment) {
        // Paid booking: Bookla webhook fires purchase + Ads conversion after
        // Stripe payment is confirmed.
        trackBookingStarted({ value, currency: 'EUR' });
      } else {
        trackBookingCompleted({
          value,
          currency: 'EUR',
          transaction_id: txId,
          items: [
            {
              item_id: selectedBoat || 'minicruise',
              item_name: 'Miniristeily (yksityinen 1,5 h)',
              price: value,
              quantity: 1,
            },
          ],
        });
        trackAdsPurchase({ value, currency: 'EUR', transaction_id: txId });
      }
      trackPurchase({
        content_ids: selectedBoat ? [selectedBoat] : undefined,
        content_name: 'Miniristeily',
        currency: 'EUR',
        value,
        transaction_id: txId,
        num_items: 1,
      });

      if (data.requiresPayment && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      
      setStep(5); // Success step
    } catch (e: unknown) {
      console.error('Error creating booking:', e);
      setError(e instanceof Error ? e.message : t.errorBookingFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return selectedBoat !== null;
      case 2: return selectedDate !== null && selectedSlot !== null;
      case 3: return customerInfo.firstName && customerInfo.lastName && customerInfo.email;
      case 4: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step === 2) {
      const value = selectedSlot?.price ? selectedSlot.price.amount / 100 : 120;
      trackBookingStarted({
        value,
        currency: 'EUR',
      });
      trackInitiateCheckout({
        content_ids: selectedBoat ? [selectedBoat] : undefined,
        content_name: 'Miniristeily',
        currency: 'EUR',
        value,
      });
    }
    if (step === 3) {
      const value = selectedSlot?.price ? selectedSlot.price.amount / 100 : 120;
      trackAddPaymentInfo({
        content_ids: selectedBoat ? [selectedBoat] : undefined,
        content_name: 'Miniristeily',
        currency: 'EUR',
        value,
      });
    }
    if (step === 4) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone-900">{t.title}</h3>
        {onClose && (
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600" aria-label={t.close}>
            ✕
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {t.steps.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = step > stepNumber;
            const isCurrent = step === stepNumber;
            
            return (
              <div key={label} className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isCompleted || isCurrent
                    ? 'bg-lake text-white' 
                    : 'bg-stone-200 text-stone-500'
                }`}>
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                <span className={`ml-2 hidden text-sm font-medium sm:block ${
                  step >= stepNumber ? 'text-stone-900' : 'text-stone-500'
                }`}>
                  {label}
                </span>
                {index < 3 && <ChevronRight className="mx-2 h-4 w-4 text-stone-300" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Select Boat */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h4 className="mb-4 text-lg font-semibold text-stone-900">{t.selectBoat}</h4>
            <p className="mb-4 text-sm text-stone-600">
              {t.selectBoatSubtitle}
            </p>
            <div className="grid gap-4">
              {cruiseBoats.map((boat) => (
                <button
                  key={boat.id}
                  aria-label={t.selectBoatOption(boat.name)}
                  aria-pressed={selectedBoat === boat.id}
                  onClick={() => {
                    setSelectedBoat(boat.id);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    selectedBoat === boat.id 
                      ? 'border-lake bg-lake/5' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      selectedBoat === boat.id ? 'bg-lake text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <Ship className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{boat.name}</p>
                      <p className="text-sm text-stone-600">{t.capacity(boat.contentId)}</p>
                    </div>
                  </div>
                  {selectedBoat === boat.id && <Check className="h-5 w-5 text-lake" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="space-y-6">
          {!selectedDate ? (
            // Show calendar first
            <div>
              <h4 className="mb-4 text-lg font-semibold text-stone-900">{t.selectDate}</h4>
              <p className="mb-4 text-sm text-stone-600">
                {t.selectDateSubtitle}
              </p>
              {isLoadingDates ? (
                <div className="flex items-center justify-center gap-2 py-8 text-stone-600 rounded-xl border border-stone-200 bg-white">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t.loadingCalendar}</span>
                </div>
              ) : (
                <SummerCalendar
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setTimeSlots(monthSlotsByDate[date] || []);
                    setSelectedSlot(null);
                    trackSchedule({ content_name: 'Mini cruise date selected' });
                  }}
                  availableDates={availableDates}
                  datesWithSlots={datesWithSlots}
                  onMonthChange={fetchMonthSlots}
                  isLoading={isLoadingMonthData}
                  onNavigateDay={navigateDay}
                  locale={locale}
                />
              )}
            </div>
          ) : (
            // Show time slots after date selected
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateDay('prev')}
                    aria-label={t.previousDay}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-stone-600" />
                  </button>
                  <h4 className="text-lg font-semibold text-stone-900">
                    {formatDate(selectedDate)}
                  </h4>
                  <button
                    onClick={() => navigateDay('next')}
                    aria-label={t.nextDay}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-stone-600" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  className="text-sm text-lake hover:underline"
                >
                  {t.changeDay}
                </button>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-stone-900">{t.selectTime}</h4>
                {isLoadingSlots ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-stone-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">{t.loadingTimes}</span>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="rounded-xl bg-stone-50 p-6 text-center">
                    <p className="text-stone-600">{t.noSlots}</p>
                    <button
                      onClick={() => {
                        setSelectedDate(null);
                        setSelectedSlot(null);
                      }}
                      className="mt-3 text-sm text-lake hover:underline"
                    >
                      {t.chooseAnotherDay}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.startTime}
                        aria-label={t.selectTimeOption(formatTime(slot.startTime), formatPrice(slot.price?.amount))}
                        aria-pressed={selectedSlot?.startTime === slot.startTime}
                        onClick={() => {
                          setSelectedSlot(slot);
                          trackSchedule({
                            content_name: 'Mini cruise time selected',
                            currency: 'EUR',
                            value: slot.price ? slot.price.amount / 100 : 120,
                          });
                        }}
                        className={`rounded-lg border p-4 text-left transition-all ${
                          selectedSlot?.startTime === slot.startTime 
                            ? 'border-lake bg-lake/5' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <p className={`text-lg font-semibold ${
                          selectedSlot?.startTime === slot.startTime ? 'text-lake' : 'text-stone-900'
                        }`}>
                          {formatTime(slot.startTime)}
                        </p>
                        <p className="text-sm text-stone-500">
                          {formatPrice(slot.price?.amount)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-stone-900">{t.contactTitle}</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="mini-first-name" className="block text-sm font-medium text-stone-700 mb-1">
                  {t.firstName} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="mini-first-name"
                    type="text"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
                    placeholder={t.firstNamePlaceholder}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="mini-last-name" className="block text-sm font-medium text-stone-700 mb-1">
                  {t.lastName} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="mini-last-name"
                    type="text"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
                    placeholder={t.lastNamePlaceholder}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="mini-email" className="block text-sm font-medium text-stone-700 mb-1">
                {t.email} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="mini-email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
                  placeholder={t.emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mini-phone" className="block text-sm font-medium text-stone-700 mb-1">
                {t.phone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="mini-phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
                  placeholder="+358 40 123 4567"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-2.5 md:col-span-2">
              <input
                id="mini-marketing-consent"
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-lake focus:ring-lake"
              />
              <span className="text-xs leading-relaxed text-stone-600">{t.marketingConsent}</span>
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-stone-900">{t.summary}</h4>
          
          <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-stone-600">{t.boat}</span>
              <span className="font-medium">{cruiseBoats.find(b => b.id === selectedBoat)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">{t.date}</span>
              <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">{t.time}</span>
              <span className="font-medium">
                {selectedSlot && `${formatTime(selectedSlot.startTime)} (${formatDuration(selectedSlot.duration)})`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">{t.booker}</span>
              <span className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</span>
            </div>
            <div className="border-t border-stone-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>{t.total}</span>
                <span>{selectedSlot?.price ? formatPrice(selectedSlot.price.amount) : '120 €'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">{t.paymentInfoTitle}</p>
                <p className="mt-1 text-sm text-amber-800">
                  {t.paymentInfoText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Success */}
      {step === 5 && (
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-stone-900">{t.successTitle}</h4>
            <p className="mt-2 text-stone-600">
              {t.successText}
            </p>
          </div>
          {bookingResult?.confirmationCode && (
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-600">{t.bookingNumber}</p>
              <p className="text-2xl font-bold text-stone-900">{bookingResult.confirmationCode}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      {step < 5 && (
        <div className="flex justify-between pt-6 mt-6 border-t border-stone-200">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t.back}
            </Button>
          ) : (
            <div></div>
          )}
          <Button 
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            className="bg-ember hover:bg-ember-dark text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.submitting}
              </>
            ) : step === 4 ? (
              t.proceedToPayment
            ) : (
              <>
                {t.continue}
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
