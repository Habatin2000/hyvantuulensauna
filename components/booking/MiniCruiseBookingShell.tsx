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
import { trackBookingStarted, trackBookingCompleted } from '@/lib/analytics';
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase, trackSchedule } from '@/lib/meta';

const MINI_CRUISE_SERVICE_ID = '533f08d0-c5ab-4358-a300-6d87295a2a26';
const AALTO_RESOURCE_ID = '3dd71bee-f303-463e-ad78-e05b4faa2234';
const VIRTA_RESOURCE_ID = '3bffeff6-4ef4-4865-a99b-370b956e355e';
const TIME_ZONE = 'Europe/Helsinki';

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

export default function MiniCruiseBookingShell({ onClose, locale = 'fi' }: MiniCruiseBookingShellProps) {
  const isEn = locale === 'en';
  const t = {
    title: isEn ? 'Book a mini cruise' : 'Varaa miniristeily',
    close: isEn ? 'Close' : 'Sulje',
    steps: isEn
      ? ['Boat', 'Date & time', 'Contact details', 'Confirmation']
      : ['Vene', 'Päivä ja aika', 'Yhteystiedot', 'Vahvistus'],
    selectBoat: isEn ? 'Choose a sauna boat' : 'Valitse saunalautta',
    selectBoatSubtitle: isEn
      ? 'The mini cruise is available on both of our sauna boats.'
      : 'Miniristeily on saatavilla molemmilla saunalautoillamme.',
    selectDate: isEn ? 'Choose a date' : 'Valitse päivämäärä',
    selectDateSubtitle: isEn
      ? 'Mini cruises are available on Sundays.'
      : 'Miniristeilyt saatavilla sunnuntaisin.',
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
    firstNamePlaceholder: isEn ? 'John' : 'Matti',
    lastNamePlaceholder: isEn ? 'Doe' : 'Meikäläinen',
    emailPlaceholder: isEn ? 'john@example.com' : 'matti@example.com',
    summary: isEn ? 'Booking summary' : 'Varauksen yhteenveto',
    boat: isEn ? 'Boat' : 'Vene',
    date: isEn ? 'Date' : 'Päivämäärä',
    time: isEn ? 'Time' : 'Aika',
    booker: isEn ? 'Booked by' : 'Varaaja',
    total: isEn ? 'Total' : 'Yhteensä',
    paymentInfoTitle: isEn ? 'Payment details' : 'Maksutiedot',
    paymentInfoText: isEn
      ? 'By clicking "Proceed to payment" you will be redirected to a secure payment system. The booking is confirmed after payment.'
      : 'Painamalla "Siirry maksuun" ohjaudut turvalliseen maksujärjestelmään. Varaus vahvistuu maksun jälkeen.',
    successTitle: isEn ? 'Booking confirmed!' : 'Varaus vahvistettu!',
    successText: isEn
      ? 'The mini cruise is now booked for you. A confirmation has been sent to your email.'
      : 'Miniristeily on nyt varattu sinulle. Vahvistus on lähetetty sähköpostiisi.',
    bookingNumber: isEn ? 'Booking number' : 'Varausnumero',
    back: isEn ? 'Back' : 'Takaisin',
    continue: isEn ? 'Continue' : 'Jatka',
    proceedToPayment: isEn ? 'Proceed to payment' : 'Siirry maksuun',
    submitting: isEn ? 'Booking...' : 'Varataan...',
    errorLoadDates: isEn ? 'Failed to load dates' : 'Päivämäärien lataaminen epäonnistui',
    errorLoadSlots: isEn ? 'Failed to load times' : 'Aikojen lataaminen epäonnistui',
    errorSelectBoatAndTime: isEn
      ? 'Select a boat and time before booking'
      : 'Valitse vene ja aika ennen varausta',
    errorBookingFailed: isEn ? 'Failed to create booking' : 'Varauksen luominen epäonnistui',
    capacity: (boatId: string) =>
      isEn ? `Max ${getMaxCapacity(boatId)} people` : `Max ${getMaxCapacity(boatId)} hlö`,
  };

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
    return date.toLocaleDateString(isEn ? 'en-GB' : 'fi-FI', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(isEn ? 'en-GB' : 'fi-FI', { hour: '2-digit', minute: '2-digit' });
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
          spots: 1
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || t.errorBookingFailed);
      }
      
      setBookingResult(data);

      const value = selectedSlot?.price ? selectedSlot.price.amount / 100 : 120;
      trackBookingCompleted({
        value,
        currency: 'EUR',
        transaction_id: data.bookingId || 'minicruise-' + Date.now(),
      });
      trackPurchase({
        content_ids: selectedBoat ? [selectedBoat] : undefined,
        content_name: 'Miniristeily',
        currency: 'EUR',
        value,
        transaction_id: data.bookingId || 'minicruise-' + Date.now(),
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
                    ? 'bg-[#3b82f6] text-white' 
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
                  onClick={() => {
                    setSelectedBoat(boat.id);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    selectedBoat === boat.id 
                      ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      selectedBoat === boat.id ? 'bg-[#3b82f6] text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <Ship className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{boat.name}</p>
                      <p className="text-sm text-stone-600">{t.capacity(boat.contentId)}</p>
                    </div>
                  </div>
                  {selectedBoat === boat.id && <Check className="h-5 w-5 text-[#3b82f6]" />}
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-stone-600" />
                  </button>
                  <h4 className="text-lg font-semibold text-stone-900">
                    {formatDate(selectedDate)}
                  </h4>
                  <button
                    onClick={() => navigateDay('next')}
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
                  className="text-sm text-[#3b82f6] hover:underline"
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
                      className="mt-3 text-sm text-[#3b82f6] hover:underline"
                    >
                      {t.chooseAnotherDay}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.startTime}
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
                            ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <p className={`text-lg font-semibold ${
                          selectedSlot?.startTime === slot.startTime ? 'text-[#3b82f6]' : 'text-stone-900'
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
                    className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
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
                    className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
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
                  className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
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
                  className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                  placeholder="+358 40 123 4567"
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
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
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
