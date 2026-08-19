'use client';

import { Calendar, Clock, Ticket, User, CreditCard, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { calculateFriendOfferTotal } from '@/lib/pricing';

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

  const { total: totalPrice, originalTotal, savings } = calculateFriendOfferTotal(
    tickets,
    getTicketPrice
  );

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-stone-900">Vahvista varaus</h3>

      {/* Summary Card */}
      <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-2.5">
        {/* Date */}
        <div className="flex items-start gap-2.5">
          <Calendar className="h-4 w-4 text-[#3b82f6]" />
          <div>
            <p className="text-sm text-stone-500">Päivämäärä</p>
            <p className="font-medium text-stone-900">{formatDate(selectedDate)}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-2.5">
          <Clock className="h-4 w-4 text-[#3b82f6]" />
          <div>
            <p className="text-sm text-stone-500">Aika</p>
            <p className="font-medium text-stone-900">
              {formatTime(selectedSlot.startHour)} - {formatTime(selectedSlot.endHour)}
            </p>
          </div>
        </div>

        {/* Tickets */}
        <div className="flex items-start gap-2.5">
          <Ticket className="h-4 w-4 text-[#3b82f6]" />
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
        <div className="flex items-start gap-2.5">
          <User className="h-4 w-4 text-[#3b82f6]" />
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
        <div className="flex items-start gap-2.5">
          <CreditCard className="h-4 w-4 text-[#3b82f6]" />
          <div className="flex-1">
            <p className="text-sm text-stone-500">Maksu</p>
            <div className="mt-1 space-y-1">
              {tickets.map((t, i) => {
                const price = getTicketPrice(t.ticketID);
                const freeQty = Math.floor(t.quantity / 3);
                const lineTotal = price * (t.quantity - freeQty);
                const lineOriginal = price * t.quantity;
                return (
                  <p key={i} className="text-sm text-stone-700">
                    {t.quantity}x {t.name} — {lineTotal.toFixed(2)}€
                    <span className="text-stone-400"> ({price.toFixed(2)}€/kpl)</span>
                    {freeQty > 0 && (
                      <span className="ml-1 text-xs font-medium text-amber-600">
                        ({freeQty}x ilmainen kaveritarjouksella)
                      </span>
                    )}
                    {freeQty > 0 && (
                      <span className="ml-1 text-xs text-stone-400 line-through">
                        {lineOriginal.toFixed(2)}€
                      </span>
                    )}
                  </p>
                );
              })}
            </div>
            <p className="mt-2 font-semibold text-stone-900">
              Yhteensä: {totalPrice.toFixed(2)}€
              {savings > 0 && (
                <span className="ml-2 text-sm font-normal text-stone-400 line-through">
                  {originalTotal.toFixed(2)}€
                </span>
              )}
            </p>
            {savings > 0 && (
              <p className="text-xs font-medium text-amber-600">
                Säästät {savings.toFixed(2)}€ kaveritarjouksella
              </p>
            )}
            <p className="text-xs text-stone-500">Maksu tapahtuu varauksen yhteydessä</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-[#3b82f6]/5 p-3">
        <div className="flex gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#3b82f6]" />
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
        <div className="rounded-lg bg-red-50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <p className="text-xs text-red-700">{bookingError}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isBooking}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Takaisin
        </button>
        <button
          onClick={onBook}
          disabled={isBooking}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBooking ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
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
