'use client';

import { Minus, Plus, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

interface AvailabilityInfo {
  date: string;
  capacity: number;
  booked: number;
  available: number;
}

interface Step2SelectTicketsProps {
  selectedDate: string;
  availability: AvailabilityInfo;
  availableTickets: TicketType[];
  tickets: { ticketID: string; name: string; quantity: number }[];
  onUpdateTickets: (tickets: { ticketID: string; name: string; quantity: number }[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2SelectTickets({
  selectedDate,
  availability,
  availableTickets,
  tickets,
  onUpdateTickets,
  onNext,
  onBack,
}: Step2SelectTicketsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fi-FI', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  const updateTicketQuantity = (ticket: TicketType, delta: number) => {
    const existing = tickets.find(t => t.ticketID === ticket.id);
    const currentQty = existing?.quantity || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0) - currentQty + newQty;
    
    if (totalTickets > availability.available) return;

    if (newQty === 0) {
      onUpdateTickets(tickets.filter(t => t.ticketID !== ticket.id));
    } else if (existing) {
      onUpdateTickets(tickets.map(t => 
        t.ticketID === ticket.id ? { ...t, quantity: newQty } : t
      ));
    } else {
      onUpdateTickets([...tickets, { ticketID: ticket.id, name: ticket.name, quantity: newQty }]);
    }
  };

  const totalQuantity = tickets.reduce((sum, t) => sum + t.quantity, 0);
  const totalPrice = tickets.reduce((sum, t) => {
    const ticket = availableTickets.find(at => at.id === t.ticketID);
    return sum + (ticket?.price || 0) * t.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Date info */}
      <div className="rounded-lg bg-[#3b82f6]/5 p-4">
        <p className="font-medium text-stone-900">{formatDate(selectedDate)}</p>
        <p className="text-sm text-stone-600">klo 14:00 - 17:00</p>
        <p className="mt-2 text-sm">
          <span className={availability.available > 5 ? 'text-green-600' : 'text-amber-600'}>
            {availability.available} paikkaa vapaana
          </span>
          <span className="text-stone-500"> / {availability.capacity} paikkaa</span>
        </p>
      </div>

      {/* Tickets */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-stone-900">Valitse liput</h3>
        
        <div className="space-y-4">
          {availableTickets.map((ticket) => {
            const selected = tickets.find(t => t.ticketID === ticket.id);
            const quantity = selected?.quantity || 0;
            
            return (
              <div 
                key={ticket.id}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-stone-900">{ticket.name}</p>
                  <p className="text-sm text-stone-600">{ticket.price}€ / hlö</p>
                  {ticket.name.toLowerCase().includes('opiskelija') && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                      <Info className="h-3 w-3" />
                      Opiskelijakortti tarkistetaan sisäänkäynnillä
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateTicketQuantity(ticket, -1)}
                    disabled={quantity === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => updateTicketQuantity(ticket, 1)}
                    disabled={totalQuantity >= availability.available}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalQuantity >= availability.available && (
          <p className="mt-3 text-center text-sm text-amber-600">
            Enintään {availability.available} lippua saatavilla
          </p>
        )}
      </div>

      {/* Total */}
      {totalQuantity > 0 && (
        <div className="rounded-lg bg-stone-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-stone-600">Yhteensä ({totalQuantity} lippua)</span>
            <span className="text-xl font-bold">{totalPrice}€</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Takaisin
        </button>
        <button
          onClick={onNext}
          disabled={totalQuantity === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          Jatka
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
