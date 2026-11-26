'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Info } from 'lucide-react';
import { useServiceInfo, useAvailability, useBooking, useMonthAvailability } from '@/hooks/useBookla';
import { trackBookingStarted, trackBookingCompleted, trackAdsPurchase } from '@/lib/analytics';
import { getAttribution } from '@/lib/attribution';
import { trackSchedule, trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/lib/meta';
import BookingStepIndicator from './BookingStepIndicator';
import PublicSaunaCalendar from './PublicSaunaCalendar';
import Step2SelectSlotAndTickets from './Step2SelectSlotAndTickets';
import Step3PersonalInfo from './Step3PersonalInfo';
import Step4Confirm from './Step4Confirm';

// Types
interface TimeSlot {
  startTime: string;
  endTime: string;
  startHour: number;
  endHour: number;
  spotsAvailable: number;
  resourceId: string;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

interface MembershipInfo {
  isMember: boolean;
  // The subscription code never reaches the client — the booking route
  // resolves it server-side from the customer email when this flag is set.
  useMembership?: boolean;
  subscriptionId?: string;
  remainingUses?: number | null;
}

type BookingLocale = 'fi' | 'en' | 'es' | 'fr' | 'de';
type MembershipError = 'generic' | 'noUses' | 'notCovered';

interface PublicBookingWidgetProps {
  showTitle?: boolean;
  locale?: BookingLocale;
}

const texts = {
  fi: {
    title: 'Varaa paikka julkiselta vuorolta',
    subtitle: 'Valitse päivämäärä, aika ja liput',
    loading: 'Ladataan tietoja...',
    successTitle: 'Varaus onnistui!',
    membershipNotApplied: 'Jäsenyyttä ei voitu käyttää',
    membershipErrors: {
      generic: 'Jäsenyyttä ei voitu käyttää tähän varaukseen.',
      noUses: 'Sarjakortissasi ei ole käyntikertoja jäljellä.',
      notCovered: 'Jäsenyytesi ei kata tätä varausta.',
    },
    regularPriceSuccess: 'Varaus on tehty normaalihintaisena.',
    regularPricePayment: 'Varaus jatkuu normaalihintaisena.',
    confirmationSent: 'Vahvistus on lähetetty osoitteeseen',
    arriveEarly: 'Saavuthan paikalle 15 minuuttia ennen vuoron alkua.',
    paymentTitle: 'Siirry maksamaan',
    paymentDescription: 'Painamalla alla olevaa nappia siirryt turvalliseen maksujärjestelmään.',
    back: 'Takaisin',
    continueToPayment: 'Jatka maksuun',
    noSlots: 'Ei vapaita aikoja tälle päivälle.',
  },
  en: {
    title: 'Book a public sauna session',
    subtitle: 'Select date, time and tickets',
    loading: 'Loading information...',
    successTitle: 'Booking successful!',
    membershipNotApplied: 'Membership could not be applied',
    membershipErrors: {
      generic: 'Your membership could not be used for this booking.',
      noUses: 'Your sauna card has no visits remaining.',
      notCovered: 'Your membership does not cover this booking.',
    },
    regularPriceSuccess: 'The booking has been made at the regular price.',
    regularPricePayment: 'The booking will continue at the regular price.',
    confirmationSent: 'A confirmation has been sent to',
    arriveEarly: 'Please arrive 15 minutes before your session starts.',
    paymentTitle: 'Proceed to payment',
    paymentDescription: 'Click the button below to go to the secure payment system.',
    back: 'Back',
    continueToPayment: 'Continue to payment',
    noSlots: 'No available times for this date.',
  },
  es: {
    title: 'Reserva una sesión pública de sauna',
    subtitle: 'Selecciona la fecha, la hora y las entradas',
    loading: 'Cargando información...',
    successTitle: '¡Reserva realizada con éxito!',
    membershipNotApplied: 'No se pudo aplicar la membresía',
    membershipErrors: {
      generic: 'No se pudo utilizar tu membresía para esta reserva.',
      noUses: 'No quedan visitas disponibles en tu tarjeta de sauna.',
      notCovered: 'Tu membresía no cubre esta reserva.',
    },
    regularPriceSuccess: 'La reserva se ha realizado al precio normal.',
    regularPricePayment: 'La reserva continuará al precio normal.',
    confirmationSent: 'Se ha enviado una confirmación a',
    arriveEarly: 'Llega 15 minutos antes del inicio de la sesión.',
    paymentTitle: 'Ir al pago',
    paymentDescription: 'Al pulsar el botón de abajo, accederás al sistema de pago seguro.',
    back: 'Atrás',
    continueToPayment: 'Continuar con el pago',
    noSlots: 'No hay horarios disponibles para esta fecha.',
  },
  fr: {
    title: 'Réserver une séance de sauna public',
    subtitle: 'Sélectionnez la date, l’heure et les billets',
    loading: 'Chargement des informations...',
    successTitle: 'Réservation confirmée !',
    membershipNotApplied: 'L’adhésion n’a pas pu être appliquée',
    membershipErrors: {
      generic: 'Votre adhésion n’a pas pu être utilisée pour cette réservation.',
      noUses: 'Il ne reste aucune visite sur votre carte de sauna.',
      notCovered: 'Votre adhésion ne couvre pas cette réservation.',
    },
    regularPriceSuccess: 'La réservation a été effectuée au tarif normal.',
    regularPricePayment: 'La réservation se poursuivra au tarif normal.',
    confirmationSent: 'Une confirmation a été envoyée à',
    arriveEarly: 'Merci d’arriver 15 minutes avant le début de la séance.',
    paymentTitle: 'Procéder au paiement',
    paymentDescription: 'En cliquant sur le bouton ci-dessous, vous accéderez au système de paiement sécurisé.',
    back: 'Retour',
    continueToPayment: 'Continuer vers le paiement',
    noSlots: 'Aucun horaire disponible pour cette date.',
  },
  de: {
    title: 'Einen öffentlichen Saunagang buchen',
    subtitle: 'Wählen Sie Datum, Uhrzeit und Tickets',
    loading: 'Informationen werden geladen...',
    successTitle: 'Buchung erfolgreich!',
    membershipNotApplied: 'Mitgliedschaft konnte nicht angewendet werden',
    membershipErrors: {
      generic: 'Ihre Mitgliedschaft konnte für diese Buchung nicht verwendet werden.',
      noUses: 'Auf Ihrer Saunakarte sind keine Besuche mehr verfügbar.',
      notCovered: 'Ihre Mitgliedschaft deckt diese Buchung nicht ab.',
    },
    regularPriceSuccess: 'Die Buchung wurde zum regulären Preis vorgenommen.',
    regularPricePayment: 'Die Buchung wird zum regulären Preis fortgesetzt.',
    confirmationSent: 'Eine Bestätigung wurde gesendet an',
    arriveEarly: 'Bitte kommen Sie 15 Minuten vor Beginn Ihres Saunagangs.',
    paymentTitle: 'Zur Zahlung',
    paymentDescription: 'Klicken Sie auf die Schaltfläche unten, um zum sicheren Zahlungssystem zu gelangen.',
    back: 'Zurück',
    continueToPayment: 'Weiter zur Zahlung',
    noSlots: 'Für dieses Datum sind keine Zeiten verfügbar.',
  },
} as const;

export default function PublicBookingWidget({ showTitle = true, locale = 'fi' }: PublicBookingWidgetProps) {
  const t = texts[locale];
  const widgetRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const prevStepRef = useRef(step);

  // Auto-scroll to top of widget only when advancing past step 1
  useEffect(() => {
    if (step > 1 && prevStepRef.current !== step) {
      widgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    prevStepRef.current = step;
  }, [step]);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [tickets, setTickets] = useState<{ ticketID: string; name: string; quantity: number }[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentURL, setPaymentURL] = useState<string | null>(null);
  const [membershipNotApplied, setMembershipNotApplied] = useState(false);
  const [membershipError, setMembershipError] = useState<MembershipError | null>(null);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());

  // Hooks
  const { info, isLoading: isLoadingInfo } = useServiceInfo();

  const { availability, isLoading: isLoadingAvailability, fetchAvailability } = useAvailability();
  const { isLoading: isBooking, error: bookingError, createBooking } = useBooking();
  const { data: monthData, isLoading: isLoadingMonth, fetchMonth } = useMonthAvailability();

  const soldOutDates = useMemo(() => {
    const set = new Set<string>();
    if (monthData?.dates) {
      for (const [date, info] of Object.entries(monthData.dates)) {
        if (
          info.slots.length > 0 &&
          info.slots.every((s) => s.spotsAvailable <= 0)
        ) {
          set.add(date);
        }
      }
    }
    return set;
  }, [monthData]);

  // Populate availableDates when month data arrives
  useEffect(() => {
    if (monthData?.dates) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs fetched month availability into local state; intentional cache-merge pattern
      setAvailableDates(prev => {
        const next = new Set(prev);
        for (const [date, info] of Object.entries(monthData.dates)) {
          if (info.hasSlots) {
            next.add(date);
          }
        }
        return next;
      });
    }
  }, [monthData]);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    trackSchedule({ content_name: 'Public sauna date selected' });
    // Use cached month slots if available
    const cached = monthData?.dates?.[date];
    if (cached) {
      setAvailableDates(prev => {
        const next = new Set(prev);
        if (cached.hasSlots) next.add(date);
        return next;
      });
      setStep(2);
      return;
    }
    // Fallback: fetch per-day
    const data = await fetchAvailability(date);
    if (data?.slots?.some((s: { spotsAvailable: number }) => s.spotsAvailable > 0)) {
      setAvailableDates(prev => new Set(prev).add(date));
    }
    setStep(2);
  };

  // Use cached month slots for the selected date if available
  const currentSlots = monthData?.dates?.[selectedDate || '']?.slots || availability?.slots || [];

  const getBooklaPrice = (ticketID: string) =>
    info?.tickets?.find((ti: TicketType) => ti.id === ticketID)?.price || 0;

  const bookingValue = tickets.reduce((sum, t) => sum + getBooklaPrice(t.ticketID) * t.quantity, 0);

  const handleBook = async () => {
    if (!selectedSlot || tickets.length === 0) return;

    // Reset membership error state
    setMembershipNotApplied(false);
    setMembershipError(null);

    const result = await createBooking({
      startTime: selectedSlot.startTime,
      tickets: tickets.map(t => ({ ticketID: t.ticketID, quantity: t.quantity })),
      client: customerInfo,
      useMembership: membership?.useMembership === true,
      resourceId: selectedSlot.resourceId,
      marketingConsent,
      attribution: {
        ...getAttribution(),
        itemName: tickets.map((t) => t.name).join(', ') || 'Julkinen saunavuoro',
        value: bookingValue,
      },
    });

    if (result.success) {
      const value = bookingValue;
      const txId = result.bookingId || 'public-' + Date.now();
      if (result.requiresPayment) {
        // Paid booking: Bookla webhook fires purchase + Ads conversion after
        // Stripe payment is confirmed.
        trackBookingStarted({ value, currency: 'EUR' });
      } else {
        trackBookingCompleted({
          value,
          currency: 'EUR',
          transaction_id: txId,
          items: tickets.map((t) => ({
            item_id: t.ticketID,
            item_name: t.name,
            price: getBooklaPrice(t.ticketID),
            quantity: t.quantity,
          })),
        });
        trackAdsPurchase({ value, currency: 'EUR', transaction_id: txId });
      }
      trackPurchase({
        content_name: 'Julkinen saunavuoro',
        currency: 'EUR',
        value,
        transaction_id: txId,
        num_items: tickets.reduce((sum, t) => sum + t.quantity, 0),
      });
      setBookingSuccess(true);
      // Track if membership was attempted but not applied
      if (membership?.useMembership && result.membershipApplied === false) {
        setMembershipNotApplied(true);
        setMembershipError('generic');
      }
      setStep(5);
    } else if (result.requiresPayment && result.paymentURL) {
      // Membership was attempted but Bookla requires payment
      if (membership?.useMembership) {
        setMembershipNotApplied(true);
        setMembershipError(membership?.remainingUses === 0 ? 'noUses' : 'notCovered');
      }
      setPaymentURL(result.paymentURL);
      // Don't redirect immediately — let user see the payment screen first
    }
  };

  const handleProceedToPayment = () => {
    if (paymentURL) {
      trackPurchase({
        content_name: 'Julkinen saunavuoro',
        currency: 'EUR',
        value: bookingValue,
      });
      window.location.href = paymentURL;
    }
  };

  const availableTickets = info?.tickets?.filter((t: TicketType) => t.enabled) || [];
  const membershipErrorMessage = membershipError ? t.membershipErrors[membershipError] : null;

  return (
    <div ref={widgetRef} className="relative mx-auto max-w-4xl min-h-[500px]">
      {showTitle && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-stone-900">{t.title}</h2>
          <p className="mt-2 text-sm text-stone-600">
            {locale === 'fi' && info?.service?.name ? info.service.name : t.subtitle}
          </p>
        </div>
      )}

      {isLoadingInfo ? (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center" role="status">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-lake border-t-transparent mx-auto" aria-hidden="true" />
          <p className="mt-4 text-stone-600">{t.loading}</p>
        </div>
      ) : bookingSuccess ? (
        <div className="rounded-xl bg-green-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-900">{t.successTitle}</h3>
          {membershipNotApplied && membershipErrorMessage && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
              <div className="flex gap-3 justify-center">
                <Info className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                <div className="text-left">
                  <p className="font-medium text-amber-900">{t.membershipNotApplied}</p>
                  <p className="mt-1 text-sm text-amber-800">{membershipErrorMessage}</p>
                  <p className="mt-1 text-sm text-amber-700">{t.regularPriceSuccess}</p>
                </div>
              </div>
            </div>
          )}
          <p className="mt-4 text-green-700">
            {t.confirmationSent} {customerInfo.email}
          </p>
          <p className="mt-4 text-sm text-green-600">
            {t.arriveEarly}
          </p>
        </div>
      ) : paymentURL ? (
        <div className="rounded-xl bg-amber-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-amber-900">{t.paymentTitle}</h3>
          
          {membershipNotApplied && membershipErrorMessage && (
            <div className="mt-4 rounded-lg bg-amber-100 border border-amber-300 p-4">
              <div className="flex gap-3 justify-center">
                <Info className="h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                <div className="text-left">
                  <p className="font-medium text-amber-900">{t.membershipNotApplied}</p>
                  <p className="mt-1 text-sm text-amber-800">{membershipErrorMessage}</p>
                  <p className="mt-1 text-sm text-amber-700">{t.regularPricePayment}</p>
                </div>
              </div>
            </div>
          )}
          
          <p className="mt-4 text-amber-700">
            {t.paymentDescription}
          </p>
          
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                setPaymentURL(null);
                setMembershipNotApplied(false);
                setMembershipError(null);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 px-6 py-3 font-medium text-amber-800 hover:bg-amber-100"
            >
              {t.back}
            </button>
            <button
              onClick={handleProceedToPayment}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-lake px-6 py-3 font-medium text-white hover:bg-lake-deep"
            >
              {t.continueToPayment}
            </button>
          </div>
        </div>
      ) : (
        <>
          <BookingStepIndicator currentStep={step} locale={locale} />
          
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            {step === 1 && (
              <PublicSaunaCalendar
                selectedDate={selectedDate}
                isLoading={isLoadingMonth || isLoadingAvailability}
                onSelectDate={handleDateSelect}
                availableDates={availableDates}
                soldOutDates={soldOutDates}
                onMonthChange={(year, month) => fetchMonth(year, month)}
                locale={locale}
              />
            )}

            {step === 2 && selectedDate && currentSlots.length > 0 && (
              <Step2SelectSlotAndTickets
                selectedDate={selectedDate}
                slots={currentSlots}
                availableTickets={availableTickets}
                selectedSlot={selectedSlot}
                tickets={tickets}
                onSelectSlot={setSelectedSlot}
                onUpdateTickets={setTickets}
                locale={locale}
                onNext={() => {
                  trackBookingStarted();
                  trackInitiateCheckout({
                    content_name: 'Julkinen saunavuoro',
                    currency: 'EUR',
                    value: bookingValue,
                  });
                  setStep(3);
                }}
                onBack={() => setStep(1)}
              />
            )}

            {step === 2 && selectedDate && currentSlots.length === 0 && !isLoadingAvailability && (
              <div className="text-center py-8">
                <p className="text-stone-600">{t.noSlots}</p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
                >
                  {t.back}
                </button>
              </div>
            )}

            {step === 3 && (
              <Step3PersonalInfo
                customerInfo={customerInfo}
                onUpdateInfo={setCustomerInfo}
                onMembershipCheck={setMembership}
                locale={locale}
                marketingConsent={marketingConsent}
                onMarketingConsentChange={setMarketingConsent}
                onNext={() => {
                  trackAddPaymentInfo({ content_name: 'Julkinen saunavuoro' });
                  setStep(4);
                }}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && selectedSlot && (
              <Step4Confirm
                selectedDate={selectedDate!}
                selectedSlot={selectedSlot}
                tickets={tickets}
                availableTickets={availableTickets}
                customerInfo={customerInfo}
                isBooking={isBooking}
                bookingError={bookingError}
                onBook={handleBook}
                onBack={() => setStep(3)}
                locale={locale}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
