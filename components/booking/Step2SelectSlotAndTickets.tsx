'use client';

import { Minus, Plus, ChevronLeft, ChevronRight, Info, Clock } from 'lucide-react';

type BookingLocale = 'fi' | 'en' | 'es' | 'fr' | 'de';

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
  locale?: BookingLocale;
}

const DATE_LOCALES: Record<BookingLocale, string> = {
  fi: 'fi-FI',
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

const texts = {
  fi: {
    selectTime: 'Valitse aika',
    full: 'Täynnä',
    spotsAvailable: (count: number) => `${count} ${count === 1 ? 'paikka' : 'paikkaa'}`,
    selectTickets: 'Valitse liput',
    perPerson: 'hlö',
    studentIdChecked: 'Opiskelijakortti tarkistetaan',
    decrease: (ticketName: string) => `Vähennä ${ticketName}`,
    increase: (ticketName: string) => `Lisää ${ticketName}`,
    maxTickets: (count: number) => `Enintään ${count} ${count === 1 ? 'lippu' : 'lippua'} tähän vuoroon`,
    total: (count: number) => `Yhteensä (${count} ${count === 1 ? 'lippu' : 'lippua'})`,
    back: 'Takaisin',
    continue: 'Jatka',
  },
  en: {
    selectTime: 'Select a time',
    full: 'Full',
    spotsAvailable: (count: number) => `${count} ${count === 1 ? 'spot' : 'spots'} available`,
    selectTickets: 'Select tickets',
    perPerson: 'person',
    studentIdChecked: 'Student ID will be checked',
    decrease: (ticketName: string) => `Decrease ${ticketName}`,
    increase: (ticketName: string) => `Increase ${ticketName}`,
    maxTickets: (count: number) => `Maximum ${count} ${count === 1 ? 'ticket' : 'tickets'} for this session`,
    total: (count: number) => `Total (${count} ${count === 1 ? 'ticket' : 'tickets'})`,
    back: 'Back',
    continue: 'Continue',
  },
  es: {
    selectTime: 'Selecciona una hora',
    full: 'Completo',
    spotsAvailable: (count: number) => `${count} ${count === 1 ? 'plaza disponible' : 'plazas disponibles'}`,
    selectTickets: 'Selecciona las entradas',
    perPerson: 'persona',
    studentIdChecked: 'Se comprobará el carné de estudiante',
    decrease: (ticketName: string) => `Reducir ${ticketName}`,
    increase: (ticketName: string) => `Aumentar ${ticketName}`,
    maxTickets: (count: number) => `Máximo ${count} ${count === 1 ? 'entrada' : 'entradas'} para esta sesión`,
    total: (count: number) => `Total (${count} ${count === 1 ? 'entrada' : 'entradas'})`,
    back: 'Atrás',
    continue: 'Continuar',
  },
  fr: {
    selectTime: 'Sélectionnez un horaire',
    full: 'Complet',
    spotsAvailable: (count: number) => `${count} ${count === 1 ? 'place disponible' : 'places disponibles'}`,
    selectTickets: 'Sélectionnez les billets',
    perPerson: 'personne',
    studentIdChecked: 'La carte étudiante sera vérifiée',
    decrease: (ticketName: string) => `Retirer un billet ${ticketName}`,
    increase: (ticketName: string) => `Ajouter un billet ${ticketName}`,
    maxTickets: (count: number) => `Maximum ${count} ${count === 1 ? 'billet' : 'billets'} pour cette séance`,
    total: (count: number) => `Total (${count} ${count === 1 ? 'billet' : 'billets'})`,
    back: 'Retour',
    continue: 'Continuer',
  },
  de: {
    selectTime: 'Uhrzeit auswählen',
    full: 'Ausgebucht',
    spotsAvailable: (count: number) => `${count} ${count === 1 ? 'Platz' : 'Plätze'} verfügbar`,
    selectTickets: 'Tickets auswählen',
    perPerson: 'Person',
    studentIdChecked: 'Der Studierendenausweis wird überprüft',
    decrease: (ticketName: string) => `Anzahl für ${ticketName} verringern`,
    increase: (ticketName: string) => `Anzahl für ${ticketName} erhöhen`,
    maxTickets: (count: number) => `Maximal ${count} ${count === 1 ? 'Ticket' : 'Tickets'} für diesen Saunagang`,
    total: (count: number) => `Gesamt (${count} ${count === 1 ? 'Ticket' : 'Tickets'})`,
    back: 'Zurück',
    continue: 'Weiter',
  },
} as const;

const TICKET_NAMES: Record<BookingLocale, { adult: string; student: string }> = {
  fi: { adult: 'Aikuinen', student: 'Opiskelija' },
  en: { adult: 'Adult', student: 'Student' },
  es: { adult: 'Adulto', student: 'Estudiante' },
  fr: { adult: 'Adulte', student: 'Étudiant' },
  de: { adult: 'Erwachsener', student: 'Studierender' },
};

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
  locale = 'fi',
}: Step2SelectSlotAndTicketsProps) {
  const t = texts[locale];
  const dateLocale = DATE_LOCALES[locale];
  const priceFormatter = new Intl.NumberFormat(dateLocale, { style: 'currency', currency: 'EUR' });
  const formatPrice = (price: number) => priceFormatter.format(price);
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(dateLocale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTicketDisplayName = (ticket: TicketType) => {
    const normalizedName = ticket.name.toLowerCase();
    if (normalizedName === 'adult' || normalizedName === 'aikuinen') return TICKET_NAMES[locale].adult;
    if (normalizedName === 'student' || normalizedName === 'opiskelija') return TICKET_NAMES[locale].student;
    return ticket.name;
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
  const getTicketPrice = (ticketID: string) =>
    availableTickets.find(at => at.id === ticketID)?.price || 0;
  const totalPrice = tickets.reduce(
    (sum, t) => sum + getTicketPrice(t.ticketID) * t.quantity,
    0
  );

  const formatTime = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

  return (
    <div className="space-y-4">
      {/* Date info */}
      <div className="rounded-lg bg-lake/5 p-2.5">
        <p className="text-sm font-medium text-stone-900">{formatDate(selectedDate)}</p>
      </div>

      {/* Time slots */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-stone-900">{t.selectTime}</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {slots.map((slot) => (
            <button
              key={slot.startTime}
              onClick={() => onSelectSlot(slot)}
              disabled={slot.spotsAvailable === 0}
              aria-pressed={selectedSlot?.startTime === slot.startTime}
              className={`rounded-lg border p-3 text-center transition-all ${
                selectedSlot?.startTime === slot.startTime
                  ? 'border-lake bg-lake/5'
                  : slot.spotsAvailable === 0
                    ? 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-3.5 w-3.5 text-lake" aria-hidden="true" />
                <span className="text-sm font-semibold text-stone-900">
                  {formatTime(slot.startHour)} - {formatTime(slot.endHour)}
                </span>
              </div>
              <p className={`mt-1 text-xs ${
                slot.spotsAvailable > 5 ? 'text-green-600' : 
                slot.spotsAvailable > 0 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {slot.spotsAvailable === 0 ? t.full : t.spotsAvailable(slot.spotsAvailable)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Tickets */}
      {selectedSlot && (
        <div>
          <h3 className="mb-3 text-base font-semibold text-stone-900">{t.selectTickets}</h3>
          
          <div className="space-y-3">
            {availableTickets.map((ticket) => {
              const selected = tickets.find(t => t.ticketID === ticket.id);
              const quantity = selected?.quantity || 0;
              
              return (
                <div 
                  key={ticket.id}
                  className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">{getTicketDisplayName(ticket)}</p>
                    <p className="text-xs text-stone-600">{formatPrice(ticket.price)} / {t.perPerson}</p>
                    {/opiskelija|student/i.test(ticket.name) && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-amber-600">
                        <Info className="h-3 w-3" aria-hidden="true" />
                        {t.studentIdChecked}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateTicketQuantity(ticket, -1)}
                      disabled={quantity === 0}
                      aria-label={t.decrease(getTicketDisplayName(ticket))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium" aria-live="polite">{quantity}</span>
                    <button
                      onClick={() => updateTicketQuantity(ticket, 1)}
                      disabled={totalQuantity >= selectedSlot.spotsAvailable}
                      aria-label={t.increase(getTicketDisplayName(ticket))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalQuantity >= selectedSlot.spotsAvailable && (
            <p className="mt-2 text-center text-xs text-amber-600">
              {t.maxTickets(selectedSlot.spotsAvailable)}
            </p>
          )}
        </div>
      )}

      {/* Total */}
      {totalQuantity > 0 && (
        <div className="rounded-lg bg-stone-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-600">{t.total(totalQuantity)}</span>
            <div className="text-right">
              <span className="text-lg font-bold">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {t.back}
        </button>
        <button
          onClick={onNext}
          disabled={!selectedSlot || totalQuantity === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-lake px-5 py-2.5 text-sm font-medium text-white hover:bg-lake-deep disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {t.continue}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
