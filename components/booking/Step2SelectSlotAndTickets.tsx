'use client';

import { Minus, Plus, ChevronLeft, ChevronRight, Info, Clock } from 'lucide-react';

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

interface Step2SelectSlotAndTicketsProps {
  selectedDate: string;
  slots: TimeSlot[];
  availableTickets: TicketType[];
  selectedSlot: TimeSlot | null;
  tickets: { ticketID: string; name: string; quantity: number }[];
  onSelectSlot: (slot: TimeSlot) => void;
  onUpdateTickets: (tickets: { ticketID: string; name: string; quantity: number }[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2SelectSlotAndTickets({
  selectedDate,
  slots,
  availableTickets,
  selectedSlot,
  tickets,
  onSelectSlot,
  onUpdateTickets,
  onNext,
  onBack,
}: Step2SelectSlotAndTicketsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fi-FI', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const updateTicketQuantity = (ticket: TicketType, delta: number) => {
    const existing = tickets.find(t => t.ticketID === ticket.id);
    const currentQty = existing?.quantity || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    const maxTickets = selectedSlot?.spotsAvailable || 0;
    const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0) - currentQty + newQty;
    
    if (totalTickets > maxTickets) return;

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

  const formatTime = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

  return (
    <div className="space-y-6">
      {/* Date info */}
      <div className="rounded-lg bg-[#3b82f6]/5 p-4">
        <p className="font-medium text-stone-900">{formatDate(selectedDate)}</p>
      </div>

      {/* Time slots */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-stone-900">Valitse aika</h3>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.startTime}
              onClick={() => onSelectSlot(slot)}
              disabled={slot.spotsAvailable === 0}
              className={`rounded-xl border p-4 text-center transition-all ${
                selectedSlot?.startTime === slot.startTime
                  ? 'border-[#3b82f6] bg-[#3b82f6]/5'
                  : slot.spotsAvailable === 0
                    ? 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-[#3b82f6]" />
                <span className="font-semibold text-stone-900">
                  {formatTime(slot.startHour)} - {formatTime(slot.endHour)}
                </span>
              </div>
              <p className={`mt-1 text-sm ${
                slot.spotsAvailable > 5 ? 'text-green-600' : 
                slot.spotsAvailable > 0 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {slot.spotsAvailable === 0 ? 'Täynnä' : `${slot.spotsAvailable} paikkaa`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Tickets */}
      {selectedSlot && (
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
                    <p className="text-sm text-stone-600">{ticket.price.toFixed(2)}€ / hlö</p>
                    {ticket.name.toLowerCase().includes('opiskelija') && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                        <Info className="h-3 w-3" />
                        Opiskelijakortti tarkistetaan
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
                      disabled={totalQuantity >= selectedSlot.spotsAvailable}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalQuantity >= selectedSlot.spotsAvailable && (
            <p className="mt-3 text-center text-sm text-amber-600">
              Enintään {selectedSlot.spotsAvailable} lippua tähän vuoroon
            </p>
          )}
        </div>
      )}

      {/* Total */}
      {totalQuantity > 0 && (
        <div className="rounded-lg bg-stone-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-stone-600">Yhteensä ({totalQuantity} lippua)</span>
            <span className="text-xl font-bold">{totalPrice.toFixed(2)}€</span>
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
          disabled={!selectedSlot || totalQuantity === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          Jatka
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
