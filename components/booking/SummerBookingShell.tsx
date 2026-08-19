'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  Ship,
  Check,
  ChevronRight,
  Info,
  Loader2,
  ChevronLeft,
  User,
  Mail,
  Phone,
  CreditCard,
} from 'lucide-react';
import SummerCalendar from './SummerCalendar';
import BoatSelector, { BoatOption } from './BoatSelector';
import SlotList, { TimeSlot } from './SlotList';
import { trackBookingStarted, trackBookingCompleted } from '@/lib/analytics';
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase, trackSchedule } from '@/lib/meta';
import { getBoats } from '@/content/boats';
import type { Locale } from '@/content/pages';
import { cn } from '@/lib/utils';

const AALTO_RESOURCE_ID = '3dd71bee-f303-463e-ad78-e05b4faa2234';
const VIRTA_RESOURCE_ID = '3bffeff6-4ef4-4865-a99b-370b956e355e';

const BOAT_RESOURCE_MAP: Record<string, string> = {
  aalto: AALTO_RESOURCE_ID,
  virta: VIRTA_RESOURCE_ID,
};

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Response shape of POST /api/bookla/summer/booking (fields actually used).
interface BookingResult {
  bookingId?: string;
  confirmationCode?: string;
  requiresPayment?: boolean;
  paymentUrl?: string;
  status?: string;
}

interface SummerBookingShellProps {
  showTitle?: boolean;
  onClose?: () => void;
  locale?: Locale;
  className?: string;
  initialBoatId?: string;
}

function formatDate(dateStr: string, locale: Locale) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(locale === 'en' ? 'en-GB' : 'fi-FI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(cents: number | null | undefined) {
  if (!cents) return '0 €';
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`;
}

function getDefaultDuration(dateStr: string): number {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  // Mon-Thu = 1-4 -> 2h, Fri-Sun = 5-0 -> 3h
  return day >= 1 && day <= 4 ? 2 : 3;
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours + minutes / 60;
}

function slotEndTime(start: string, durationHours: number): string {
  const d = new Date(start);
  d.setHours(d.getHours() + Math.floor(durationHours));
  d.setMinutes(d.getMinutes() + Math.round((durationHours % 1) * 60));
  return formatTime(d.toISOString());
}

export default function SummerBookingShell({ showTitle = true, onClose, locale = 'fi', className, initialBoatId }: SummerBookingShellProps) {
  const isEn = locale === 'en';
  const t = {
    title: isEn ? 'Book a sauna boat for summer' : 'Varaa saunalautta kesäksi',
    subtitle: isEn ? 'Choose a boat, day and time – booking ready in minutes' : 'Valitse vene, päivämäärä ja aika – varaus valmis minuuteissa',
    selectBoat: isEn ? 'Choose a sauna boat' : 'Valitse saunalautta',
    selectDate: isEn ? 'Choose a date' : 'Valitse päivämäärä',
    selectTime: isEn ? 'Choose a time' : 'Valitse aika',
    stepLabels: [
      isEn ? 'Boat' : 'Vene',
      isEn ? 'Date' : 'Päivä',
      isEn ? 'Time' : 'Aika',
      isEn ? 'Details' : 'Tiedot',
    ],
    noSlots: isEn ? 'No slots for the selected day' : 'Ei vapaita aikoja valitulle päivälle',
    changeDay: isEn ? 'Choose another day' : 'Valitse toinen päivä',
    contactTitle: isEn ? 'Contact details' : 'Yhteystiedot',
    firstName: isEn ? 'First name' : 'Etunimi',
    lastName: isEn ? 'Last name' : 'Sukunimi',
    email: isEn ? 'Email' : 'Sähköposti',
    phone: isEn ? 'Phone' : 'Puhelinnumero',
    summary: isEn ? 'Booking summary' : 'Varausyhteenveto',
    boat: isEn ? 'Boat' : 'Vene',
    date: isEn ? 'Date' : 'Päivämäärä',
    time: isEn ? 'Time' : 'Aika',
    duration: isEn ? 'Duration' : 'Kesto',
    total: isEn ? 'Total' : 'Yhteensä',
    vat: isEn ? 'incl. VAT 13.5%' : 'sis. alv 13,5%',
    bookNow: isEn ? 'Book now' : 'Varaa nyt',
    continue: isEn ? 'Continue' : 'Jatka',
    back: isEn ? 'Back' : 'Takaisin',
    submitting: isEn ? 'Booking...' : 'Varataan...',
    successTitle: isEn ? 'Booking confirmed!' : 'Varaus vahvistettu!',
    successText: isEn
      ? 'The sauna boat is now reserved for you. A confirmation has been sent to your email.'
      : 'Saunalautta on nyt varattu sinulle. Vahvistus on lähetetty sähköpostiisi.',
    bookingNumber: isEn ? 'Booking number' : 'Varausnumero',
    paymentInfo: isEn
      ? 'By clicking "Book now" you will be redirected to a secure payment system. The booking is confirmed after payment.'
      : 'Painamalla "Varaa nyt" ohjaudut turvalliseen maksujärjestelmään. Varaus vahvistuu maksun jälkeen.',
    cancellation: isEn
      ? 'Booking is binding. Cancellation up to 7 days before is free of charge.'
      : 'Varaus on sitova. Peruutus 7 vrk ennen veloituksetta.',
    extrasTitle: isEn ? 'Additional services' : 'Lisäpalvelut',
    extrasNote: isEn
      ? 'Want extras? Please contact us by phone 0442313546 or email info@hyvantuulensauna.fi.'
      : 'Haluatko lisäpalveluita? Olethan yhteydessä puhelimitse 0442313546 tai sähköpostilla info@hyvantuulensauna.fi.',
  };

  const boatOptions: BoatOption[] = useMemo(() => {
    const boats = getBoats(locale);
    return [
      {
        id: 'virta',
        resourceId: VIRTA_RESOURCE_ID,
        name: boats.find((b) => b.id === 'virta')?.name || 'Saunalautta Virta',
        capacity: `Max ${boats.find((b) => b.id === 'virta')?.capacity.max || 10} hlö`,
        description:
          boats.find((b) => b.id === 'virta')?.description.split('\n\n')[0] ||
          'Risteily saaristossa – intiimimpi kokemus pienemmälle porukalle.',
        image: '/images/virta-01.webp',
      },
      {
        id: 'aalto',
        resourceId: AALTO_RESOURCE_ID,
        name: boats.find((b) => b.id === 'aalto')?.name || 'Saunalautta Aalto',
        capacity: `Max ${boats.find((b) => b.id === 'aalto')?.capacity.max || 12} hlö`,
        description:
          boats.find((b) => b.id === 'aalto')?.description.split('\n\n')[0] ||
          'Ankkuroituna merellä – täydellinen isommille seurueille.',
        image: '/images/aalto-01.webp',
      },
    ];
  }, [locale]);

  const TOTAL_STEPS = 4; // boat, date, time, contact
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(2);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Pre-select boat when opening from a specific boat card CTA
  useEffect(() => {
    if (initialBoatId && !selectedBoatId) {
      setSelectedBoatId(initialBoatId);
      setStepIndex(1);
    }
  }, [initialBoatId, selectedBoatId]);
  const skipSlotFetchRef = useRef(false);

  // Fetch available dates when boat changes
  useEffect(() => {
    if (!selectedBoatId) return;
    const resourceId = BOAT_RESOURCE_MAP[selectedBoatId];
    if (!resourceId) return;

    const fetchDates = async () => {
      setIsLoadingDates(true);
      setError(null);
      try {
        const res = await fetch('/api/bookla/summer/dates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resourceId }),
        });
        if (!res.ok) throw new Error('Failed to fetch dates');
        const data = await res.json();
        setAvailableDates(data.dates || []);
      } catch (e) {
        console.error('Error fetching dates:', e);
        setError(t.noSlots);
      } finally {
        setIsLoadingDates(false);
      }
    };

    fetchDates();
  }, [selectedBoatId]);

  // Fetch time slots when date or duration changes
  useEffect(() => {
    if (!selectedBoatId || !selectedDate) return;
    if (skipSlotFetchRef.current) {
      skipSlotFetchRef.current = false;
      return;
    }
    const resourceId = BOAT_RESOURCE_MAP[selectedBoatId];
    if (!resourceId) return;

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setError(null);
      try {
        const res = await fetch('/api/bookla/summer/times', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: selectedDate,
            duration: `PT${duration}H`,
            resourceId,
          }),
        });
        if (!res.ok) throw new Error('Failed to fetch slots');
        const data = await res.json();
        const slots = (data.slots || []) as TimeSlot[];
        setTimeSlots(slots);

        // Try to keep the same start time if it still exists
        if (selectedSlot) {
          const matching = slots.find((s) => s.startTime === selectedSlot.startTime);
          if (matching) {
            setSelectedSlot(matching);
          } else {
            setSelectedSlot(null);
          }
        }
      } catch (e) {
        console.error('Error fetching slots:', e);
        setError(t.noSlots);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedBoatId, selectedDate, duration]);

  const handleSelectBoat = (id: string) => {
    setSelectedBoatId(id);
    setSelectedDate(null);
    setSelectedSlot(null);
    setTimeSlots([]);
    setStepIndex(1); // move to date step
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setDuration(getDefaultDuration(date));
    setSelectedSlot(null);
    setTimeSlots([]);
    setStepIndex(2); // move to time step
    trackSchedule({ content_name: 'Summer boat date selected' });
  };

  const minDuration = selectedDate ? getDefaultDuration(selectedDate) : 1;

  const handleExtendDuration = async () => {
    if (!selectedBoatId || !selectedDate || !selectedSlot) return;
    const resourceId = BOAT_RESOURCE_MAP[selectedBoatId];
    if (!resourceId) return;

    const newDuration = duration + 1;
    setIsLoadingSlots(true);
    try {
      const res = await fetch('/api/bookla/summer/times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          duration: `PT${newDuration}H`,
          resourceId,
        }),
      });
      if (!res.ok) throw new Error('Failed to fetch extended slot');
      const data = await res.json();
      const slots = (data.slots || []) as TimeSlot[];
      const matching = slots.find((s) => s.startTime === selectedSlot.startTime);
      if (matching) {
        skipSlotFetchRef.current = true;
        setDuration(newDuration);
        setTimeSlots(slots);
        setSelectedSlot(matching);
      } else {
        setError(isEn ? 'Extra hour is not available for this slot' : 'Lisätunti ei ole saatavilla tähän vuoroon');
      }
    } catch (e) {
      console.error('Error extending slot:', e);
      setError(isEn ? 'Failed to add extra hour' : 'Lisätunnin hakeminen epäonnistui');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleReduceDuration = async () => {
    if (!selectedBoatId || !selectedDate || !selectedSlot) return;
    const resourceId = BOAT_RESOURCE_MAP[selectedBoatId];
    if (!resourceId) return;

    const newDuration = duration - 1;
    if (newDuration < minDuration) return;
    setIsLoadingSlots(true);
    try {
      const res = await fetch('/api/bookla/summer/times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          duration: `PT${newDuration}H`,
          resourceId,
        }),
      });
      if (!res.ok) throw new Error('Failed to fetch reduced slot');
      const data = await res.json();
      const slots = (data.slots || []) as TimeSlot[];
      const matching = slots.find((s) => s.startTime === selectedSlot.startTime);
      if (matching) {
        skipSlotFetchRef.current = true;
        setDuration(newDuration);
        setTimeSlots(slots);
        setSelectedSlot(matching);
      } else {
        setError(isEn ? 'Shorter duration is not available for this slot' : 'Lyhyempi kesto ei ole saatavilla tähän vuoroon');
      }
    } catch (e) {
      console.error('Error reducing slot:', e);
      setError(isEn ? 'Failed to reduce duration' : 'Keston lyhentäminen epäonnistui');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedBoatId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/bookla/summer/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: selectedSlot.startTime,
          duration: selectedSlot.duration,
          resourceId: BOAT_RESOURCE_MAP[selectedBoatId],
          client: {
            email: customerInfo.email,
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            phone: customerInfo.phone,
          },
          spots: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.submitting);
      }

      setBookingResult(data);
      setStepIndex(4); // success view

      trackBookingCompleted({
        value: selectedSlot.price ? selectedSlot.price.amount / 100 : 0,
        currency: 'EUR',
        transaction_id: data.bookingId || 'summer-' + Date.now(),
      });
      trackPurchase({
        content_ids: [selectedBoatId],
        content_name: 'Saunalauttaristeily',
        currency: 'EUR',
        value: selectedSlot.price ? selectedSlot.price.amount / 100 : 0,
        transaction_id: data.bookingId || 'summer-' + Date.now(),
        num_items: 1,
      });

      if (data.requiresPayment && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
    } catch (e) {
      console.error('Error creating booking:', e);
      setError(e instanceof Error && e.message ? e.message : t.submitting);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isContactValid =
    customerInfo.firstName.trim() &&
    customerInfo.lastName.trim() &&
    customerInfo.email.trim();

  const selectedBoatName = selectedBoatId
    ? boatOptions.find((b) => b.id === selectedBoatId)?.name
    : undefined;

  const durationLabel = `${duration} ${isEn ? 'hours' : 'tuntia'}`;

  return (
    <div className={cn('mx-auto flex max-w-5xl flex-col', className)}>
      {(showTitle || onClose) && (
        <div className="relative mb-4 text-center">
          <h2 className="text-xl font-bold text-stone-900">{t.title}</h2>
          <p className="mt-1.5 text-sm text-stone-600">{t.subtitle}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-1 text-stone-400 hover:text-stone-600"
              aria-label="Sulje"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {stepIndex !== 4 && (
        <>
          {/* Stepper header */}
          <div className="mb-4">
        <div className="flex items-center justify-between">
          {t.stepLabels.map((label, idx) => {
            const isActive = idx === stepIndex;
            const isCompleted = idx < stepIndex;
            const clickable = idx <= stepIndex || (idx === 1 && selectedBoatId) || (idx === 2 && selectedDate) || (idx === 3 && selectedSlot);
            return (
              <button
                key={label}
                onClick={() => clickable && setStepIndex(idx)}
                disabled={!clickable}
                className="group flex flex-col items-center gap-2 focus:outline-none"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-2'
                      : isCompleted
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-stone-200 text-stone-500 group-enabled:hover:bg-stone-300'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-teal-700' : isCompleted ? 'text-stone-700' : 'text-stone-500'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative mt-3 h-1.5 rounded-full bg-stone-200">
          <div
            className="absolute h-1.5 rounded-full bg-teal-600 transition-all duration-500"
            style={{ width: `${(stepIndex / (TOTAL_STEPS - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-3">
        {/* Main content slider */}
        <div className="flex min-h-0 flex-col overflow-hidden lg:col-span-2">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${stepIndex * 100}%)` }}
          >
            {/* Step 0: Boat */}
            <div className="flex h-full w-full shrink-0 flex-col overflow-hidden px-1">
              <section className="flex h-full flex-col overflow-hidden">
                <h3 className="text-sm font-semibold text-stone-900">{t.selectBoat}</h3>
                <div className="min-h-0 max-h-[55vh] overflow-y-auto pt-2">
                  <BoatSelector
                    boats={boatOptions}
                    selectedId={selectedBoatId}
                    onSelect={handleSelectBoat}
                    compact
                  />
                </div>
                {selectedBoatId && (
                  <Button
                    onClick={() => setStepIndex(1)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {t.continue}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </section>
            </div>

            {/* Step 1: Date */}
            <div className="flex h-full w-full shrink-0 flex-col overflow-hidden px-1">
              <section className="flex h-full flex-col overflow-hidden">
                <h3 className="text-sm font-semibold text-stone-900">{t.selectDate}</h3>
                <div className="min-h-0 max-h-[55vh] overflow-y-auto pt-2">
                  {isLoadingDates ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-8 text-stone-600">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{isEn ? 'Loading calendar...' : 'Ladataan kalenteria...'}</span>
                    </div>
                  ) : (
                    <SummerCalendar
                      selectedDate={selectedDate}
                      onSelectDate={handleSelectDate}
                      availableDates={availableDates}
                      datesWithSlots={[]}
                      isLoading={isLoadingDates}
                      onMonthChange={() => {}}
                      onRefresh={() => {}}
                      onNavigateDay={() => {}}
                      locale={locale}
                    />
                  )}
                </div>
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setStepIndex(0)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t.back}
                  </Button>
                  <Button
                    onClick={() => setStepIndex(2)}
                    disabled={!selectedDate}
                    className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                  >
                    {t.continue}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>
            </div>

            {/* Step 2: Time */}
            <div className="flex h-full w-full shrink-0 flex-col overflow-hidden px-1">
              <section className="flex h-full flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-900">{t.selectTime}</h3>
                  <span className="text-xs text-stone-500">
                    {selectedDate ? `${formatDate(selectedDate, locale)} · ${durationLabel}` : durationLabel}
                  </span>
                </div>

                <div className="min-h-0 max-h-[55vh] overflow-y-auto pt-2">
                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-stone-600">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{isEn ? 'Loading times...' : 'Ladataan aikoja...'}</span>
                    </div>
                  ) : (
                    <SlotList
                      slots={timeSlots}
                      selectedSlot={selectedSlot}
                      onSelect={(slot) => {
                        setSelectedSlot(slot);
                        trackSchedule({
                          content_name: 'Summer boat time selected',
                          currency: 'EUR',
                          value: slot.price ? slot.price.amount / 100 : 0,
                        });
                      }}
                      onExtend={handleExtendDuration}
                      onReduce={handleReduceDuration}
                      isExtending={isLoadingSlots}
                      isReducing={isLoadingSlots}
                      canReduce={duration > minDuration}
                    />
                  )}
                </div>

                {selectedSlot && (
                  <div className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 lg:hidden">
                    <span className="text-sm text-stone-600">{t.total}</span>
                    <span className="font-semibold text-stone-900">{formatPrice(selectedSlot.price?.amount)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setStepIndex(1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t.back}
                  </Button>
                  <Button
                    onClick={() => {
                      trackBookingStarted({
                        value: selectedSlot!.price ? selectedSlot!.price.amount / 100 : 0,
                        currency: 'EUR',
                      });
                      trackInitiateCheckout({
                        content_ids: [selectedBoatId!],
                        content_name: 'Saunalauttaristeily',
                        currency: 'EUR',
                        value: selectedSlot!.price ? selectedSlot!.price.amount / 100 : 0,
                      });
                      setStepIndex(3);
                    }}
                    disabled={!selectedSlot}
                    className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                  >
                    {t.continue}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>
            </div>

            {/* Step 3: Contact */}
            <div className="flex h-full w-full shrink-0 flex-col overflow-hidden px-1">
              <section className="flex h-full flex-col overflow-hidden">
                <h3 className="text-sm font-semibold text-stone-900">{t.contactTitle}</h3>

                <div className="min-h-0 max-h-[55vh] space-y-3 overflow-y-auto pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="summer-first-name" className="mb-1 block text-xs font-medium text-stone-700">
                        {t.firstName} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                          id="summer-first-name"
                          type="text"
                          value={customerInfo.firstName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                          className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          placeholder={isEn ? 'Matti' : 'Matti'}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="summer-last-name" className="mb-1 block text-xs font-medium text-stone-700">
                        {t.lastName} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                          id="summer-last-name"
                          type="text"
                          value={customerInfo.lastName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                          className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          placeholder={isEn ? 'Meikäläinen' : 'Meikäläinen'}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="summer-email" className="mb-1 block text-xs font-medium text-stone-700">
                      {t.email} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        id="summer-email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="matti@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="summer-phone" className="mb-1 block text-xs font-medium text-stone-700">{t.phone}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        id="summer-phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="+358 40 123 4567"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                    <p className="text-xs font-medium text-stone-700">{t.extrasTitle}</p>
                    <p className="mt-1 text-xs text-stone-600">{t.extrasNote}</p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-3">
                    <div className="flex gap-2">
                      <Info className="h-4 w-4 shrink-0 text-amber-600" />
                      <p className="text-xs text-amber-800">{t.paymentInfo}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setStepIndex(2)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t.back}
                  </Button>
                  <Button
                    onClick={() => {
                      trackAddPaymentInfo({
                        content_ids: [selectedBoatId!],
                        content_name: 'Saunalauttaristeily',
                        currency: 'EUR',
                        value: selectedSlot?.price ? selectedSlot.price.amount / 100 : 0,
                      });
                      handleSubmit();
                    }}
                    disabled={!isContactValid || isSubmitting}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t.bookNow}
                      </>
                    )}
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="hidden h-full lg:block">
          <Card className="flex h-full flex-col border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg">{t.summary}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 overflow-y-auto">
              {selectedBoatId && (
                <div className="flex items-center gap-3">
                  <Ship className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-stone-500">{t.boat}</p>
                    <p className="font-medium">{selectedBoatName}</p>
                  </div>
                </div>
              )}
              {selectedDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-stone-500">{t.date}</p>
                    <p className="font-medium">{formatDate(selectedDate, locale)}</p>
                  </div>
                </div>
              )}
              {selectedSlot && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-stone-500">{t.time}</p>
                    <p className="font-medium">
                      {formatTime(selectedSlot.startTime)}–
                      {slotEndTime(selectedSlot.startTime, parseDuration(selectedSlot.duration))}
                    </p>
                  </div>
                </div>
              )}
              {selectedSlot && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-stone-500">{t.duration}</p>
                    <p className="font-medium">{durationLabel}</p>
                  </div>
                </div>
              )}
              {selectedSlot?.price && (
                <div className="border-t border-stone-200 pt-4">
                  <p className="text-sm text-stone-500">{t.total}</p>
                  <p className="text-2xl font-bold text-stone-900">
                    {formatPrice(selectedSlot.price.amount)}
                  </p>
                  <p className="text-xs text-stone-500">{t.vat}</p>
                </div>
              )}

              <div className="rounded-lg bg-amber-50 p-3">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 shrink-0 text-amber-600" />
                  <p className="text-xs text-amber-800">{t.cancellation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

        </>
      )}

      {/* Success overlay */}
      {stepIndex === 4 && (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-semibold text-stone-900">{t.successTitle}</h3>
            <p className="mt-2 text-stone-600">{t.successText}</p>
          </div>
          {bookingResult?.confirmationCode && (
            <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-600">{t.bookingNumber}</p>
              <p className="text-2xl font-bold text-stone-900">{bookingResult.confirmationCode}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
