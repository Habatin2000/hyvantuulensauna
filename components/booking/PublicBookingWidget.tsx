'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { useServiceInfo, useAvailability, useBooking } from '@/hooks/useBookla';
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
  subscriptionId?: string;
  remainingUses?: number | null;
}

interface PublicBookingWidgetProps {
  showTitle?: boolean;
}

export default function PublicBookingWidget({ showTitle = true }: PublicBookingWidgetProps) {
  const [step, setStep] = useState(1);
  
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

  // Hooks
  const { info, isLoading: isLoadingInfo } = useServiceInfo();
  const { availability, isLoading: isLoadingAvailability, fetchAvailability } = useAvailability();
  const { isLoading: isBooking, error: bookingError, createBooking } = useBooking();

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    await fetchAvailability(date);
    setStep(2);
  };

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
    });

    if (result.success) {
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
      window.location.href = paymentURL;
    }
  };

  const availableTickets = info?.tickets?.filter((t: TicketType) => t.enabled) || [];

  return (
    <div className="mx-auto max-w-4xl">
      {showTitle && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-stone-900">Varaa paikka julkiselta vuorolta</h2>
          <p className="mt-2 text-stone-600">
            {info?.service?.name || 'Valitse päivämäärä, aika ja liput'}
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
                isLoading={isLoadingAvailability}
                onSelectDate={handleDateSelect}
              />
            )}

            {step === 2 && selectedDate && availability && (
              <Step2SelectSlotAndTickets
                selectedDate={selectedDate}
                slots={availability.slots}
                availableTickets={availableTickets}
                selectedSlot={selectedSlot}
                tickets={tickets}
                onSelectSlot={setSelectedSlot}
                onUpdateTickets={setTickets}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <Step3PersonalInfo
                customerInfo={customerInfo}
                onUpdateInfo={setCustomerInfo}
                onMembershipCheck={setMembership}
                onNext={() => setStep(4)}
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
