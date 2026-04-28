'use client';

import { Calendar, Clock, Ticket, User, CreditCard, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

interface Step4ConfirmProps {
  selectedDate: string;
  selectedSlot: {
    startHour: number;
    endHour: number;
  };
  tickets: { ticketID: string; name: string; quantity: number }[];
  availableTickets: TicketType[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  isBooking: boolean;
  bookingError: string | null;
  onBook: () => void;
  onBack: () => void;
}

export default function Step4Confirm({
  selectedDate,
  selectedSlot,
  tickets,
  availableTickets,
  customerInfo,
  isBooking,
  bookingError,
  onBook,
  onBack,
}: Step4ConfirmProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fi-FI', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

  const totalQuantity = tickets.reduce((sum, t) => sum + t.quantity, 0);
  
  // Use actual prices from Bookla API
  const getTicketPrice = (ticketID: string) => {
    const ticket = availableTickets.find(at => at.id === ticketID);
    return ticket?.price || 0;
  };

  const totalPrice = tickets.reduce((sum, t) => {
    return sum + getTicketPrice(t.ticketID) * t.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-stone-900">Vahvista varaus</h3>

      {/* Summary Card */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
        {/* Date */}
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-[#3b82f6]" />
          <div>
            <p className="text-sm text-stone-500">Päivämäärä</p>
            <p className="font-medium text-stone-900">{formatDate(selectedDate)}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-[#3b82f6]" />
          <div>
            <p className="text-sm text-stone-500">Aika</p>
            <p className="font-medium text-stone-900">
              {formatTime(selectedSlot.startHour)} - {formatTime(selectedSlot.endHour)}
            </p>
          </div>
        </div>

        {/* Tickets */}
        <div className="flex items-start gap-3">
          <Ticket className="h-5 w-5 text-[#3b82f6]" />
          <div>
            <p className="text-sm text-stone-500">Liput ({totalQuantity})</p>
            <div className="space-y-1">
              {tickets.map((ticket, index) => (
                <p key={index} className="font-medium text-stone-900">
                  {ticket.quantity}x {ticket.name}
                  {ticket.name.toLowerCase().includes('opiskelija') && (
                    <span className="ml-2 text-xs text-amber-600">
                      (opiskelijakortti tarkistetaan)
                    </span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-[#3b82f6]" />
          <div>
            <p className="text-sm text-stone-500">Varaaja</p>
            <p className="font-medium text-stone-900">
              {customerInfo.firstName} {customerInfo.lastName}
            </p>
            <p className="text-sm text-stone-600">{customerInfo.email}</p>
            {customerInfo.phone && (
              <p className="text-sm text-stone-600">{customerInfo.phone}</p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-[#3b82f6]" />
          <div className="flex-1">
            <p className="text-sm text-stone-500">Maksu</p>
            <div className="mt-1 space-y-1">
              {tickets.map((t, i) => {
                const price = getTicketPrice(t.ticketID);
                return (
                  <p key={i} className="text-sm text-stone-700">
                    {t.quantity}x {t.name} — {(price * t.quantity).toFixed(2)}€
                    <span className="text-stone-400"> ({price.toFixed(2)}€/kpl)</span>
                  </p>
                );
              })}
            </div>
            <p className="mt-2 font-semibold text-stone-900">Yhteensä: {totalPrice.toFixed(2)}€</p>
            <p className="text-xs text-stone-500">Maksu tapahtuu varauksen yhteydessä</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-[#3b82f6]/5 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-[#3b82f6]" />
          <div>
            <p className="font-medium text-stone-900">Tärkeää muistaa</p>
            <ul className="mt-1 space-y-1 text-sm text-stone-600">
              <li>• Saavuthan paikalle 15 minuuttia ennen vuoron alkua</li>
              <li>• Ota mukaan uimapuku ja pyyhe</li>
              <li>• Omat juomat ovat sallittuja</li>
            </ul>
          </div>
        </div>
      </div>

      {bookingError && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{bookingError}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isBooking}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Takaisin
        </button>
        <button
          onClick={onBook}
          disabled={isBooking}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBooking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Käsitellään...
            </>
          ) : (
            'Vahvista ja varaa'
          )}
        </button>
      </div>
    </div>
  );
}
