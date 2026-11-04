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
} from 'lucide-react';
import SummerCalendar from './SummerCalendar';
import type { Locale } from '@/content/pages';
import { trackBookingStarted, trackBookingCompleted, trackAdsPurchase } from '@/lib/analytics';
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase, trackSchedule } from '@/lib/meta';

export const WINTER_SERVICE_ID = '8ecd1d49-ae5b-4c56-a62d-2cffb2314143';
const TIME_ZONE = 'Europe/Helsinki';

interface TimeSlot {
  startTime: string;
  duration: string;
  spotsAvailable: number;
  resourceId: string;
  price: { amount: number; comparedAmount: number; currency: string } | null;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface WinterSaunaBookingShellProps {
  /** Pre-selected sauna resource; if omitted the user picks one on step 1. */
  resourceId?: string;
  resourceName?: string;
  onClose?: () => void;
  locale?: Locale;
}

export default function WinterSaunaBookingShell({
  resourceId: initialResourceId,
  resourceName,
  onClose,
  locale = 'fi',
}: WinterSaunaBookingShellProps) {
  const isEn = locale === 'en';
  const t = {
    title: isEn ? 'Book a private ice sauna' : 'Varaa yksityinen avantosauna',
    close: isEn ? 'Close' : 'Sulje',
    steps: isEn
      ? ['Sauna', 'Date & time', 'Contact details', 'Confirmation']
      : ['Sauna', 'Päivä ja aika', 'Yhteystiedot', 'Vahvistus'],
    selectSauna: isEn ? 'Choose a sauna' : 'Valitse sauna',
    selectSaunaSubtitle: isEn
      ? 'Both saunas are wood-fired and include access to the ice hole.'
      : 'Molemmat saunat ovat puulämmitteisiä ja avanto kuuluu mukaan.',
    saunaNames: {
      aalto: isEn ? 'Sauna boat Aalto' : 'Aalto-sauna',
      virta: isEn ? 'Sauna boat Virta' : 'Virta-sauna',
    },
    saunaCapacity: {
      aalto: isEn ? 'Max 10 people' : 'Max 10 hlö',
      virta: isEn ? 'Max 6 people' : 'Max 6 hlö',
    },
    saunaPrice: {
      aalto: '140 € / 2 h',
      virta: '120 € / 2 h',
    },
    selectDate: isEn ? 'Choose a date' : 'Valitse päivämäärä',
    selectDateSubtitle: isEn
      ? 'The winter season runs from November to April.'
      : 'Talvikausi pyörii marraskuusta huhtikuuhun.',
    loadingCalendar: isEn ? 'Loading calendar...' : 'Ladataan kalenteria...',
    changeDay: isEn ? 'Change day' : 'Vaihda päivä',
    selectTime: isEn ? 'Choose a start time' : 'Valitse aloitusaika',
    loadingTimes: isEn ? 'Loading times...' : 'Ladataan aikoja...',
    noSlots: isEn ? 'No available times for the selected day' : 'Ei vapaita aikoja valitulle päivälle',
    chooseAnotherDay: isEn ? 'Choose another day' : 'Valitse toinen päivä',
    contactTitle: isEn ? 'Contact details' : 'Yhteystiedot',
    firstName: isEn ? 'First name' : 'Etunimi',
    lastName: isEn ? 'Last name' : 'Sukunimi',
    email: isEn ? 'Email' : 'Sähköposti',
    phone: isEn ? 'Phone number' : 'Puhelinnumero',
    summary: isEn ? 'Booking summary' : 'Varauksen yhteenveto',
    sauna: isEn ? 'Sauna' : 'Sauna',
    date: isEn ? 'Date' : 'Päivämäärä',
    time: isEn ? 'Time' : 'Aika',
    duration: isEn ? 'Duration' : 'Kesto',
    booker: isEn ? 'Booked by' : 'Varaaja',
    total: isEn ? 'Total' : 'Yhteensä',
    paymentInfoTitle: isEn ? 'Payment details' : 'Maksutiedot',
    paymentInfoText: isEn
      ? 'By clicking "Proceed to payment" you will be redirected to a secure payment system. The booking is confirmed after payment.'
      : 'Painamalla "Siirry maksuun" ohjaudut turvalliseen maksujärjestelmään. Varaus vahvistuu maksun jälkeen.',
    successTitle: isEn ? 'Booking confirmed!' : 'Varaus vahvistettu!',
    successText: isEn
      ? 'The sauna is now booked for you. A confirmation has been sent to your email.'
      : 'Sauna on nyt varattu sinulle. Vahvistus on lähetetty sähköpostiisi.',
    bookingNumber: isEn ? 'Booking number' : 'Varausnumero',
    back: isEn ? 'Back' : 'Takaisin',
    continue: isEn ? 'Continue' : 'Jatka',
    proceedToPayment: isEn ? 'Proceed to payment' : 'Siirry maksuun',
    submitting: isEn ? 'Booking...' : 'Varataan...',
    errorLoadDates: isEn ? 'Failed to load dates' : 'Päivämäärien lataaminen epäonnistui',
    errorLoadSlots: isEn ? 'Failed to load times' : 'Aikojen lataaminen epäonnistui',
    errorSelectTime: isEn ? 'Select a time before booking' : 'Valitse aika ennen varausta',
    errorBookingFailed: isEn ? 'Failed to create booking' : 'Varauksen luominen epäonnistui',
    includesIceHole: isEn ? 'Ice hole included' : 'Avanto sisältyy',
    perSession: isEn ? '/ session' : '/ vuoro',
  };

  const AALTO_ID = '3dd71bee-f303-463e-ad78-e05b4faa2234';
  const VIRTA_ID = '3bffeff6-4ef4-4865-a99b-370b956e355e';

  const saunas = [
    { id: VIRTA_ID, key: 'virta' as const },
    { id: AALTO_ID, key: 'aalto' as const },
  ];

  const [step, setStep] = useState(initialResourceId ? 2 : 1);
  const [selectedSauna, setSelectedSauna] = useState<string | null>(initialResourceId || null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ bookingId?: string; confirmationCode?: string } | null>(null);

  const requestIdRef = useRef(0);

  // Fetch available dates when sauna is selected
  useEffect(() => {
    if (!selectedSauna) return;

    const fetchDates = async () => {
      setIsLoadingDates(true);
      setError(null);
      try {
        const res = await fetch('/api/bookla/winter/dates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resourceId: selectedSauna }),
        });
        if (!res.ok) throw new Error('Failed to fetch dates');
        const data = await res.json();
        setAvailableDates(data.dates || []);
      } catch (e) {
        console.error('Error fetching winter dates:', e);
        setError(t.errorLoadDates);
      } finally {
        setIsLoadingDates(false);
      }
    };

    fetchDates();
  }, [selectedSauna]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch time slots when sauna or date changes
  useEffect(() => {
    if (!selectedSauna || !selectedDate) return;

    const fetchSlots = async () => {
      const requestId = ++requestIdRef.current;
      setIsLoadingSlots(true);
      setError(null);
      try {
        const res = await fetch('/api/bookla/winter/times', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: selectedDate, resourceId: selectedSauna }),
        });
        if (!res.ok) throw new Error('Failed to fetch slots');
        const data = await res.json();
        if (requestId === requestIdRef.current) {
          setTimeSlots(data.slots || []);
        }
      } catch (e) {
        console.error('Error fetching winter slots:', e);
        if (requestId === requestIdRef.current) {
          setError(t.errorLoadSlots);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoadingSlots(false);
        }
      }
    };

    fetchSlots();
  }, [selectedSauna, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString(isEn ? 'en-GB' : 'fi-FI', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString(isEn ? 'en-GB' : 'fi-FI', { hour: '2-digit', minute: '2-digit' });

  const formatPrice = (cents: number | null | undefined) => {
    if (!cents) return '';
    return `${(cents / 100).toFixed(0)} €`;
  };

  const selectedSaunaKey = saunas.find((s) => s.id === selectedSauna)?.key;
  const saunaDisplayName = resourceName || (selectedSaunaKey ? t.saunaNames[selectedSaunaKey] : '');

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedSauna) {
      setError(t.errorSelectTime);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // The minicruise booking route is generic (serviceId from body).
      const res = await fetch('/api/bookla/minicruise/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: WINTER_SERVICE_ID,
          resourceId: selectedSauna,
          startTime: selectedSlot.startTime,
          duration: 'PT2H',
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
        throw new Error(data.error || t.errorBookingFailed);
      }

      setBookingResult(data);

      const value = selectedSlot?.price ? selectedSlot.price.amount / 100 : 0;
      const saunaName =
        selectedSauna === AALTO_ID
          ? isEn
            ? 'Sauna boat Aalto (private, 2 h)'
            : 'Aalto-sauna (yksityinen, 2 h)'
          : isEn
            ? 'Sauna boat Virta (private, 2 h)'
            : 'Virta-sauna (yksityinen, 2 h)';
      const txId = data.bookingId || 'winter-' + Date.now();
      trackBookingCompleted({
        value,
        currency: 'EUR',
        transaction_id: txId,
        items: [
          {
            item_id: selectedSauna || 'winter-sauna',
            item_name: saunaName,
            price: value,
            quantity: 1,
          },
        ],
      });
      trackAdsPurchase({ value, currency: 'EUR', transaction_id: txId });
      trackPurchase({
        content_ids: [selectedSauna],
        content_name: 'Yksityinen avantosauna',
        currency: 'EUR',
        value,
        transaction_id: txId,
        num_items: 1,
      });

      if (data.requiresPayment && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      setStep(5);
    } catch (e: unknown) {
      console.error('Error creating winter booking:', e);
      setError(e instanceof Error ? e.message : t.errorBookingFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return selectedSauna !== null;
      case 2:
        return selectedDate !== null && selectedSlot !== null;
      case 3:
        return Boolean(customerInfo.firstName && customerInfo.lastName && customerInfo.email);
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step === 2) {
      const value = selectedSlot?.price ? selectedSlot.price.amount / 100 : 0;
      trackBookingStarted({ value, currency: 'EUR' });
      trackInitiateCheckout({
        content_ids: selectedSauna ? [selectedSauna] : undefined,
        content_name: 'Yksityinen avantosauna',
        currency: 'EUR',
        value,
      });
    }
    if (step === 3) {
      const value = selectedSlot?.price ? selectedSlot.price.amount / 100 : 0;
      trackAddPaymentInfo({
        content_ids: selectedSauna ? [selectedSauna] : undefined,
        content_name: 'Yksityinen avantosauna',
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
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-stone-900">{t.title}</h3>
        {onClose && (
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600" aria-label={t.close}>
            ✕
          </button>
        )}
      </div>

      {/* Progress steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {t.steps.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = step > stepNumber;
            const isCurrent = step === stepNumber;
            // Skip sauna step display when sauna is pre-selected
            if (initialResourceId && index === 0) return null;
            return (
              <div key={label} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isCompleted || isCurrent ? 'bg-lake text-white' : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : initialResourceId ? stepNumber - 1 : stepNumber}
                </div>
                <span
                  className={`ml-2 hidden text-sm font-medium sm:block ${
                    step >= stepNumber ? 'text-stone-900' : 'text-stone-500'
                  }`}
                >
                  {label}
                </span>
                {index < t.steps.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-stone-300" />}
              </div>
            );
          })}
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

      {/* Step 1: Select sauna (only when not pre-selected) */}
      {step === 1 && !initialResourceId && (
        <div className="space-y-6">
          <div>
            <h4 className="mb-4 text-lg font-semibold text-stone-900">{t.selectSauna}</h4>
            <p className="mb-4 text-sm text-stone-600">{t.selectSaunaSubtitle}</p>
            <div className="grid gap-4">
              {saunas.map((sauna) => (
                <button
                  key={sauna.id}
                  onClick={() => {
                    setSelectedSauna(sauna.id);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    selectedSauna === sauna.id ? 'border-lake bg-lake/5' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-stone-900">{t.saunaNames[sauna.key]}</p>
                    <p className="text-sm text-stone-600">
                      {t.saunaCapacity[sauna.key]} · {t.saunaPrice[sauna.key]} · {t.includesIceHole}
                    </p>
                  </div>
                  {selectedSauna === sauna.id && <Check className="h-5 w-5 text-lake" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Date & time */}
      {step === 2 && (
        <div className="space-y-6">
          {!selectedDate ? (
            <div>
              <h4 className="mb-4 text-lg font-semibold text-stone-900">{t.selectDate}</h4>
              <p className="mb-4 text-sm text-stone-600">{t.selectDateSubtitle}</p>
              {isLoadingDates ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-8 text-stone-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t.loadingCalendar}</span>
                </div>
              ) : (
                <SummerCalendar
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                    trackSchedule({ content_name: 'Winter sauna date selected' });
                  }}
                  availableDates={availableDates}
                  datesWithSlots={[]}
                  onMonthChange={() => {}}
                  isLoading={false}
                  onRefresh={() => {}}
                  locale={locale}
                />
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-stone-900">{formatDate(selectedDate)}</h4>
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
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.startTime}
                        onClick={() => {
                          setSelectedSlot(slot);
                          trackSchedule({
                            content_name: 'Winter sauna time selected',
                            currency: 'EUR',
                            value: slot.price ? slot.price.amount / 100 : 0,
                          });
                        }}
                        className={`rounded-lg border p-4 text-left transition-all ${
                          selectedSlot?.startTime === slot.startTime
                            ? 'border-lake bg-lake/5'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <p
                          className={`text-lg font-semibold ${
                            selectedSlot?.startTime === slot.startTime ? 'text-lake' : 'text-stone-900'
                          }`}
                        >
                          {formatTime(slot.startTime)}
                        </p>
                        <p className="text-sm text-stone-500">
                          {slot.price?.comparedAmount ? (
                            <>
                              <span className="mr-1 line-through opacity-70">{formatPrice(slot.price.comparedAmount)}</span>
                              <span className="font-semibold text-lake">{formatPrice(slot.price.amount)}</span>
                            </>
                          ) : (
                            formatPrice(slot.price?.amount)
                          )}
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

      {/* Step 3: Contact info */}
      {step === 3 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-stone-900">{t.contactTitle}</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="winter-first-name" className="mb-1 block text-sm font-medium text-stone-700">
                  {t.firstName} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="winter-first-name"
                    type="text"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="winter-last-name" className="mb-1 block text-sm font-medium text-stone-700">
                  {t.lastName} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="winter-last-name"
                    type="text"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="winter-email" className="mb-1 block text-sm font-medium text-stone-700">
                {t.email} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="winter-email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
                />
              </div>
            </div>
            <div>
              <label htmlFor="winter-phone" className="mb-1 block text-sm font-medium text-stone-700">
                {t.phone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="winter-phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-stone-900">{t.summary}</h4>
          <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
            <div className="flex justify-between">
              <span className="text-stone-600">{t.sauna}</span>
              <span className="font-medium">{saunaDisplayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">{t.date}</span>
              <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">{t.time}</span>
              <span className="font-medium">{selectedSlot && formatTime(selectedSlot.startTime)} (2 h)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">{t.booker}</span>
              <span className="font-medium">
                {customerInfo.firstName} {customerInfo.lastName}
              </span>
            </div>
            <div className="border-t border-stone-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>{t.total}</span>
                <span>
                  {selectedSlot?.price?.comparedAmount ? (
                    <>
                      <span className="mr-2 text-sm font-normal text-stone-400 line-through">
                        {formatPrice(selectedSlot.price.comparedAmount)}
                      </span>
                      {formatPrice(selectedSlot.price.amount)}
                    </>
                  ) : (
                    formatPrice(selectedSlot?.price?.amount)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">{t.paymentInfoTitle}</p>
                <p className="mt-1 text-sm text-amber-800">{t.paymentInfoText}</p>
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
            <p className="mt-2 text-stone-600">{t.successText}</p>
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
        <div className="mt-6 flex justify-between border-t border-stone-200 pt-6">
          {step > (initialResourceId ? 2 : 1) ? (
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
            className="bg-lake text-white hover:bg-lake-deep"
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
