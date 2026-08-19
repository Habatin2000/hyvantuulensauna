'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Info } from 'lucide-react';
import { useServiceInfo, useAvailability, useBooking, useMonthAvailability } from '@/hooks/useBookla';
import { trackBookingStarted, trackBookingCompleted } from '@/lib/analytics';
import { trackSchedule, trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/lib/meta';
import { calculateFriendOfferTotal } from '@/lib/pricing';
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
  code?: string;
  contractId?: string;
  subscriptionId?: string;
  remainingUses?: number | null;
}

interface PublicBookingWidgetProps {
  showTitle?: boolean;
  locale?: 'fi' | 'en';
}

export default function PublicBookingWidget({ showTitle = true, locale = 'fi' }: PublicBookingWidgetProps) {
  const isEn = locale === 'en';
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
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentURL, setPaymentURL] = useState<string | null>(null);
  const [membershipNotApplied, setMembershipNotApplied] = useState(false);
  const [membershipErrorMessage, setMembershipErrorMessage] = useState<string | null>(null);
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

  const bookingValue = calculateFriendOfferTotal(tickets, getBooklaPrice).total;

  const handleBook = async () => {
    if (!selectedSlot || tickets.length === 0) return;

    // Reset membership error state
    setMembershipNotApplied(false);
    setMembershipErrorMessage(null);

    const result = await createBooking({
      startTime: selectedSlot.startTime,
      tickets: tickets.map(t => ({ ticketID: t.ticketID, quantity: t.quantity })),
      client: customerInfo,
      subscriptionCode: membership?.code,
      contractId: membership?.contractId,
      resourceId: selectedSlot.resourceId,
    });

    if (result.success) {
      const value = bookingValue;
      trackBookingCompleted({
        value,
        currency: 'EUR',
        transaction_id: result.bookingId || 'public-' + Date.now(),
      });
      trackPurchase({
        content_name: 'Julkinen saunavuoro',
        currency: 'EUR',
        value,
        transaction_id: result.bookingId || 'public-' + Date.now(),
        num_items: tickets.reduce((sum, t) => sum + t.quantity, 0),
      });
      setBookingSuccess(true);
      // Track if membership was attempted but not applied
      if (membership?.code && result.membershipApplied === false) {
        setMembershipNotApplied(true);
        setMembershipErrorMessage('Jäsenyyttä ei voitu käyttää tähän varaukseen.');
      }
      setStep(5);
    } else if (result.requiresPayment && result.paymentURL) {
      // Membership was attempted but Bookla requires payment
      if (membership?.code) {
        setMembershipNotApplied(true);
        setMembershipErrorMessage(
          membership?.remainingUses === 0 
            ? 'Sarjakortissasi ei ole käyntikertoja jäljellä.'
            : 'Jäsenyytesi ei kata tätä varausta.'
        );
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

  return (
    <div ref={widgetRef} className="relative mx-auto max-w-4xl min-h-[500px]">
      {/* Friend offer corner badge */}
      <div className="absolute -top-4 -right-4 z-10 rotate-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-4 py-2 text-center text-xs font-bold text-white shadow-xl shadow-amber-500/30 md:-top-5 md:-right-5 md:px-5 md:py-2.5 md:text-sm">
        <span className="block leading-tight">
          {isEn ? 'Friend offer:' : 'Kaveritarjous:'}
        </span>
        <span className="block leading-tight">
          {isEn ? '3 for 2 ❤️' : 'kolme kahden hinnalla ❤️'}
        </span>
      </div>

      {showTitle && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-stone-900">{isEn ? 'Book a public sauna session' : 'Varaa paikka julkiselta vuorolta'}</h2>
          <p className="mt-2 text-sm text-stone-600">
            {info?.service?.name || (isEn ? 'Select date, time and tickets' : 'Valitse päivämäärä, aika ja liput')}
          </p>
        </div>
      )}

      {isLoadingInfo ? (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3b82f6] border-t-transparent mx-auto" />
          <p className="mt-4 text-stone-600">Ladataan tietoja...</p>
        </div>
      ) : bookingSuccess ? (
        <div className="rounded-xl bg-green-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-900">Varaus onnistui!</h3>
          {membershipNotApplied && membershipErrorMessage && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
              <div className="flex gap-3 justify-center">
                <Info className="h-5 w-5 shrink-0 text-amber-600" />
                <div className="text-left">
                  <p className="font-medium text-amber-900">Jäsenyyttä ei voitu käyttää</p>
                  <p className="mt-1 text-sm text-amber-800">{membershipErrorMessage}</p>
                  <p className="mt-1 text-sm text-amber-700">Varaus on tehty normaalihintaisena.</p>
                </div>
              </div>
            </div>
          )}
          <p className="mt-4 text-green-700">
            Vahvistus on lähetetty osoitteeseen {customerInfo.email}
          </p>
          <p className="mt-4 text-sm text-green-600">
            Saavuthan paikalle 15 minuuttia ennen vuoron alkua.
          </p>
        </div>
      ) : paymentURL ? (
        <div className="rounded-xl bg-amber-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-amber-900">Siirry maksamaan</h3>
          
          {membershipNotApplied && membershipErrorMessage && (
            <div className="mt-4 rounded-lg bg-amber-100 border border-amber-300 p-4">
              <div className="flex gap-3 justify-center">
                <Info className="h-5 w-5 shrink-0 text-amber-700" />
                <div className="text-left">
                  <p className="font-medium text-amber-900">Jäsenyyttä ei voitu käyttää</p>
                  <p className="mt-1 text-sm text-amber-800">{membershipErrorMessage}</p>
                  <p className="mt-1 text-sm text-amber-700">Varaus jatkuu normaalihintaisena.</p>
                </div>
              </div>
            </div>
          )}
          
          <p className="mt-4 text-amber-700">
            Painamalla alla olevaa nappia siirryt turvalliseen maksujärjestelmään.
          </p>
          
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                setPaymentURL(null);
                setMembershipNotApplied(false);
                setMembershipErrorMessage(null);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 px-6 py-3 font-medium text-amber-800 hover:bg-amber-100"
            >
              Takaisin
            </button>
            <button
              onClick={handleProceedToPayment}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb]"
            >
              Jatka maksuun
            </button>
          </div>
        </div>
      ) : (
        <>
          <BookingStepIndicator currentStep={step} />
          
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
                <p className="text-stone-600">Ei vapaita aikoja tälle päivälle.</p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
                >
                  Takaisin
                </button>
              </div>
            )}

            {step === 3 && (
              <Step3PersonalInfo
                customerInfo={customerInfo}
                onUpdateInfo={setCustomerInfo}
                onMembershipCheck={setMembership}
                locale={locale}
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
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
