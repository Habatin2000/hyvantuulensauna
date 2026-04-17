'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Users, 
  Ship, 
  Check, 
  ChevronRight,
  Info,
  Loader2,
  ChevronLeft,
  User,
  Mail,
  Phone
} from 'lucide-react';
import SummerCalendar from './SummerCalendar';

// Resource IDs
const AALTO_RESOURCE_ID = '3dd71bee-f303-463e-ad78-e05b4faa2234';
const VIRTA_RESOURCE_ID = '3bffeff6-4ef4-4865-a99b-370b956e355e';

const boats = [
  { id: AALTO_RESOURCE_ID, name: 'Aalto', capacity: 'Max 12hlö' },
  { id: VIRTA_RESOURCE_ID, name: 'Virta', capacity: 'Max 10hlö' },
];

const durations = [3, 4, 5];

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

export default function SummerBookingShell({ showTitle = true }: { showTitle?: boolean }) {
  // Ref for stale-request protection and duplicate prevention
  const requestIdRef = useRef(0);
  const lastFetchedMonthRef = useRef<{year: number; month: number} | null>(null);
  
  const [step, setStep] = useState(1);
  const [selectedBoat, setSelectedBoat] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [duration, setDuration] = useState(3);
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
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Fetch dates when boat is selected
  useEffect(() => {
    if (!selectedBoat) return;
    
    const fetchDates = async () => {
      setIsLoadingDates(true);
      setError(null);
      try {
        const res = await fetch('/api/bookla/summer/dates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resourceId: selectedBoat }),
        });
        
        if (!res.ok) throw new Error('Failed to fetch dates');
        
        const data = await res.json();
        setAvailableDates(data.dates || []);
      } catch (e) {
        console.error('Error fetching dates:', e);
        setError('Päivämäärien lataaminen epäonnistui');
      } finally {
        setIsLoadingDates(false);
      }
    };
    
    fetchDates();
  }, [selectedBoat]);

  // Fetch time slots when date or duration changes
  useEffect(() => {
    if (!selectedBoat || !selectedDate) return;
    
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
            resourceId: selectedBoat 
          }),
        });
        
        if (!res.ok) throw new Error('Failed to fetch slots');
        
        const data = await res.json();
        setTimeSlots(data.slots || []);
        // Track which dates have actual slots
        if (data.slots && data.slots.length > 0) {
          setDatesWithSlots(prev => [...new Set([...prev, selectedDate])]);
        }
      } catch (e) {
        console.error('Error fetching slots:', e);
        setError('Aikojen lataaminen epäonnistui');
      } finally {
        setIsLoadingSlots(false);
      }
    };
    
    fetchSlots();
  }, [selectedBoat, selectedDate, duration]);

  // Clear slots tracking when boat changes
  useEffect(() => {
    setDatesWithSlots([]);
  }, [selectedBoat]);

  // Helper: Parse ISO8601 duration to milliseconds
  const parseDuration = (duration: string): number => {
    // PT3H = 3 hours, PT2H30M = 2.5 hours
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 3 * 60 * 60 * 1000; // Default 3 hours
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    return (hours * 60 + minutes) * 60 * 1000;
  };

  // Helper: Check if available times have gaps (indicating bookings)
  const hasBookingGaps = (slots: TimeSlot[]): boolean => {
    if (slots.length < 2) return false;
    
    const sorted = [...slots].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    // Check for gaps between consecutive slots
    // A gap > 30 minutes indicates a missing/booked slot
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = new Date(sorted[i-1].startTime).getTime() + parseDuration(sorted[i-1].duration);
      const currStart = new Date(sorted[i].startTime).getTime();
      const gapMinutes = (currStart - prevEnd) / (1000 * 60);
      
      if (gapMinutes > 30) return true; // Gap found = partially booked
    }
    
    return false;
  };

  // Fetch available times for the month to detect gaps (bookings)
  const fetchMonthSlots = async (year: number, month: number) => {
    if (!selectedBoat) return;
    
    // Increment request ID for stale-request protection
    const currentRequestId = ++requestIdRef.current;
    
    setIsLoadingMonthData(true);
    
    try {
      // Fetch all times for the month in one call
      const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const to = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`;
      
      const res = await fetch('/api/bookla/summer/times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          from,
          to,
          duration: `PT${duration}H`,
          resourceId: selectedBoat 
        }),
      });
      
      if (!res.ok) {
        console.error('[SUMMER-MONTH] Failed to fetch times:', res.status);
        setIsLoadingMonthData(false);
        return;
      }
      
      const data = await res.json() as { slotsByDate?: Record<string, TimeSlot[]> };
      const slotsByDate = data.slotsByDate || {};
      
      const datesWithBookings = new Set<string>();
      
      // Check each date for gaps
      for (const dateStr of Object.keys(slotsByDate)) {
        const slots = slotsByDate[dateStr];
        if (slots && slots.length > 0) {
          if (hasBookingGaps(slots)) {
            datesWithBookings.add(dateStr);
          }
        }
      }
      
      console.log(`[SUMMER-MONTH] Found ${datesWithBookings.size} dates with booking gaps`);
      
      // Only update state if this is still the latest request
      if (currentRequestId === requestIdRef.current) {
        setMonthSlotsByDate(slotsByDate);
        setDatesWithSlots(Array.from(datesWithBookings));
      }
    } catch (e) {
      console.error('[SUMMER-MONTH] Error fetching times:', e);
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
    const newDateStr = date.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    // Set time slots for the new date
    setTimeSlots(monthSlotsByDate[newDateStr] || []);
    setSelectedSlot(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fi-FI', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (cents: number | null | undefined) => {
    if (!cents) return '0 €';
    return `${(cents / 100).toFixed(0)} €`;
  };

  const getTotalPrice = () => {
    if (!selectedSlot?.price?.amount) return 0;
    return selectedSlot.price.amount / 100;
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedBoat) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch('/api/bookla/summer/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: selectedSlot.startTime,
          duration: selectedSlot.duration,
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
        throw new Error(data.error || 'Varauksen luominen epäonnistui');
      }
      
      setBookingResult(data);
      
      if (data.requiresPayment && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      
      setStep(5); // Success step
    } catch (e: any) {
      console.error('Error creating booking:', e);
      setError(e.message || 'Varauksen luominen epäonnistui');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return selectedBoat !== null && duration >= 3;
      case 2: return selectedDate !== null && selectedSlot !== null;
      case 3: return customerInfo.firstName && customerInfo.lastName && customerInfo.email;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step === 4) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  // Clear slots tracking when boat changes
  useEffect(() => {
    setDatesWithSlots([]);
  }, [selectedBoat]);

  return (
    <div className="mx-auto max-w-4xl">
      {showTitle && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-stone-900">Varaa saunalautta kesäksi</h2>
          <p className="mt-2 text-stone-600">
            Valitse vene, päivämäärä ja kesto – varaus valmis minuuteissa
          </p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Vene ja kesto', 'Päivä ja aika', 'Yhteystiedot', 'Maksu'].map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = step > stepNumber;
            const isCurrent = step === stepNumber;
            const isClickable = isCompleted || isCurrent || (stepNumber <= step + 1 && isStepValid());
            
            return (
              <div 
                key={label} 
                className={`flex items-center ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => isClickable && setStep(stepNumber)}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isCompleted || isCurrent
                    ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]' 
                    : isClickable
                      ? 'bg-stone-300 text-stone-600 hover:bg-stone-400'
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Boat and Duration */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-900">Valitse saunalautta</h3>
                {isLoadingDates && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Ladataan saatavuutta...</span>
                  </div>
                )}
                <div className="mt-4 grid gap-4">
                  {boats.map((boat) => (
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
                          <p className="text-sm text-stone-600">{boat.capacity}</p>
                        </div>
                      </div>
                      {selectedBoat === boat.id && <Check className="h-5 w-5 text-[#3b82f6]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900">Varauksen kesto</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {durations.map((h) => (
                    <button
                      key={h}
                      onClick={() => {
                        setDuration(h);
                        setSelectedSlot(null);
                      }}
                      className={`rounded-lg border px-6 py-3 text-sm font-medium transition-all ${
                        duration === h 
                          ? 'border-[#3b82f6] bg-[#3b82f6] text-white' 
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {h} tuntia
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-stone-500">Minimi varausaika on 3 tuntia</p>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              {!selectedDate ? (
                // Show calendar first
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-stone-900">Valitse päivämäärä</h3>
                  {isLoadingDates ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-stone-600 rounded-xl border border-stone-200 bg-white">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Ladataan kalenteria...</span>
                    </div>
                  ) : (
                    <SummerCalendar
                      selectedDate={selectedDate}
                      onSelectDate={(date) => {
                        setSelectedDate(date);
                        setTimeSlots(monthSlotsByDate[date] || []);
                        setSelectedSlot(null);
                      }}
                      availableDates={availableDates}
                      datesWithSlots={datesWithSlots}
                      onMonthChange={fetchMonthSlots}
                      isLoading={isLoadingMonthData}
                      onRefresh={() => {
                        const now = new Date();
                        const helsinkiDateStr = new Intl.DateTimeFormat('en-CA', {
                          timeZone: 'Europe/Helsinki',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }).format(now);
                        const [year, month] = helsinkiDateStr.split('-').map(Number);
                        // Reset last fetched to force re-fetch
                        lastFetchedMonthRef.current = null;
                        fetchMonthSlots(year, month - 1);
                      }}
                      onNavigateDay={navigateDay}
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
                        aria-label="Edellinen päivä"
                      >
                        <ChevronLeft className="h-5 w-5 text-stone-600" />
                      </button>
                      <h3 className="text-lg font-semibold text-stone-900">
                        {formatDate(selectedDate)}
                      </h3>
                      <button
                        onClick={() => navigateDay('next')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                        aria-label="Seuraava päivä"
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
                      Vaihda päivä
                    </button>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-stone-900">Valitse aloitusaika</h3>
                    {isLoadingSlots ? (
                      <div className="flex items-center justify-center gap-2 py-8 text-stone-600">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">Ladataan aikoja...</span>
                      </div>
                    ) : timeSlots.length === 0 ? (
                      <div className="rounded-xl bg-stone-50 p-6 text-center">
                        <p className="text-stone-600">Ei vapaita aikoja valitulle päivälle</p>
                        <button
                          onClick={() => {
                            setSelectedDate(null);
                            setSelectedSlot(null);
                          }}
                          className="mt-3 text-sm text-[#3b82f6] hover:underline"
                        >
                          Valitse toinen päivä
                        </button>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto rounded-xl border border-stone-200 p-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {timeSlots.map((slot, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedSlot(slot)}
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
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Contact Info (was step 4) */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-stone-900">Yhteystiedot</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Etunimi *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                        className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                        placeholder="Matti"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Sukunimi *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                        className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                        placeholder="Meikäläinen"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Sähköposti *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                      placeholder="matti@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Puhelinnumero
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
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

          {/* Step 4: Summary & Payment (was step 5) */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-stone-900">Varauksen yhteenveto</h3>
              
              <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-stone-600">Vene</span>
                  <span className="font-medium">{boats.find(b => b.id === selectedBoat)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Päivämäärä</span>
                  <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Aika</span>
                  <span className="font-medium">
                    {selectedSlot && formatTime(selectedSlot.startTime)} ({duration}h)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Varaaja</span>
                  <span className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Sähköposti</span>
                  <span className="font-medium">{customerInfo.email}</span>
                </div>
                {customerInfo.phone && (
                  <div className="flex justify-between">
                    <span className="text-stone-600">Puhelin</span>
                    <span className="font-medium">{customerInfo.phone}</span>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Yhteensä</span>
                    <span>{selectedSlot?.price ? formatPrice(selectedSlot.price.amount) : '-'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">Maksutiedot</p>
                    <p className="mt-1 text-sm text-amber-800">
                      Painamalla "Siirry maksuun" ohjaudut turvalliseen maksujärjestelmään. 
                      Varaus vahvistuu maksun jälkeen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success - shown after payment */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900">Varaus vahvistettu!</h3>
                <p className="mt-2 text-stone-600">
                  Saunalautta on nyt varattu sinulle. Vahvistus on lähetetty sähköpostiisi.
                </p>
              </div>
              {bookingResult?.confirmationCode && (
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-sm text-stone-600">Varausnumero</p>
                  <p className="text-2xl font-bold text-stone-900">{bookingResult.confirmationCode}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Takaisin
                </Button>
              ) : (
                <div></div>
              )}
              <div>
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid() || isSubmitting}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Varataan...
                    </>
                  ) : step === 4 ? (
                    'Siirry maksuun'
                  ) : (
                    <>
                      Jatka
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="hidden lg:block">
          <Card className="sticky top-24 border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg">Varauksen tiedot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedBoat && (
                <div className="flex items-center gap-3">
                  <Ship className="h-5 w-5 text-[#3b82f6]" />
                  <div>
                    <p className="text-sm text-stone-500">Vene</p>
                    <p className="font-medium">{boats.find(b => b.id === selectedBoat)?.name}</p>
                  </div>
                </div>
              )}
              {selectedDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#3b82f6]" />
                  <div>
                    <p className="text-sm text-stone-500">Päivämäärä</p>
                    <p className="font-medium">{formatDate(selectedDate)}</p>
                  </div>
                </div>
              )}
              {selectedSlot && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#3b82f6]" />
                  <div>
                    <p className="text-sm text-stone-500">Aika</p>
                    <p className="font-medium">{formatTime(selectedSlot.startTime)} ({duration}h)</p>
                  </div>
                </div>
              )}
              {duration >= 3 && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#3b82f6]" />
                  <div>
                    <p className="text-sm text-stone-500">Kesto</p>
                    <p className="font-medium">{duration} tuntia</p>
                  </div>
                </div>
              )}
              
              {selectedSlot?.price && (
                <div className="border-t border-stone-200 pt-4">
                  <p className="text-sm text-stone-500">Hinta yhteensä</p>
                  <p className="text-2xl font-bold text-stone-900">{formatPrice(getTotalPrice() * 100)}</p>
                  <p className="text-xs text-stone-500">Sis. alv 25%</p>
                </div>
              )}

              <div className="rounded-lg bg-amber-50 p-3">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 shrink-0 text-amber-600" />
                  <p className="text-xs text-amber-800">
                    Varaus on sitova. Peruutus 7 vrk ennen veloituksetta.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
