'use client';

import { Calendar, Clock, Ticket, User, CreditCard, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';

type BookingLocale = 'fi' | 'en' | 'es' | 'fr' | 'de';

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
    title: 'Vahvista varaus',
    date: 'Päivämäärä',
    time: 'Aika',
    tickets: 'Liput',
    customer: 'Varaaja',
    payment: 'Maksu',
    perTicket: '/ kpl',
    total: 'Yhteensä',
    paymentNote: 'Maksu tapahtuu varauksen yhteydessä',
    important: 'Tärkeää muistaa',
    arriveEarly: 'Saavuthan paikalle 15 minuuttia ennen vuoron alkua',
    bringSwimwear: 'Ota mukaan uimapuku ja pyyhe',
    ownDrinks: 'Omat juomat ovat sallittuja',
    studentIdChecked: 'opiskelijakortti tarkistetaan',
    back: 'Takaisin',
    processing: 'Käsitellään...',
    confirm: 'Vahvista ja varaa',
    errors: {
      slotUnavailable: 'Tämä aika on jo varattu. Valitse toinen aika.',
      membershipNotApplied: 'Jäsenyyttä ei voitu käyttää tähän varaukseen juuri nyt. Varausta ei tehty — kokeile hetken kuluttua uudelleen tai ota yhteyttä info@hyvantuulensauna.fi.',
      invalidBooking: 'Tarkista varaustiedot ja yritä uudelleen.',
      bookingFailed: 'Varauksen luominen epäonnistui. Yritä myöhemmin uudelleen.',
    },
  },
  en: {
    title: 'Confirm your booking',
    date: 'Date',
    time: 'Time',
    tickets: 'Tickets',
    customer: 'Customer',
    payment: 'Payment',
    perTicket: 'each',
    total: 'Total',
    paymentNote: 'Payment is made when you complete the booking',
    important: 'Important to remember',
    arriveEarly: 'Please arrive 15 minutes before your session starts',
    bringSwimwear: 'Bring swimwear and a towel',
    ownDrinks: 'You may bring your own drinks',
    studentIdChecked: 'student ID will be checked',
    back: 'Back',
    processing: 'Processing...',
    confirm: 'Confirm and book',
    errors: {
      slotUnavailable: 'This time has already been booked. Please select another time.',
      membershipNotApplied: 'Your membership could not be used for this booking right now. No booking was made — please try again in a moment or contact info@hyvantuulensauna.fi.',
      invalidBooking: 'Please check your booking details and try again.',
      bookingFailed: 'The booking could not be created. Please try again later.',
    },
  },
  es: {
    title: 'Confirma tu reserva',
    date: 'Fecha',
    time: 'Hora',
    tickets: 'Entradas',
    customer: 'Datos de la reserva',
    payment: 'Pago',
    perTicket: 'por entrada',
    total: 'Total',
    paymentNote: 'El pago se realiza al completar la reserva',
    important: 'Información importante',
    arriveEarly: 'Llega 15 minutos antes del inicio de la sesión',
    bringSwimwear: 'Trae bañador y toalla',
    ownDrinks: 'Puedes traer tus propias bebidas',
    studentIdChecked: 'se comprobará el carné de estudiante',
    back: 'Atrás',
    processing: 'Procesando...',
    confirm: 'Confirmar y reservar',
    errors: {
      slotUnavailable: 'Este horario ya está reservado. Selecciona otra hora.',
      membershipNotApplied: 'No se pudo utilizar tu membresía para esta reserva en este momento. No se ha realizado ninguna reserva; inténtalo de nuevo dentro de unos instantes o escribe a info@hyvantuulensauna.fi.',
      invalidBooking: 'Comprueba los datos de la reserva e inténtalo de nuevo.',
      bookingFailed: 'No se pudo crear la reserva. Inténtalo de nuevo más tarde.',
    },
  },
  fr: {
    title: 'Confirmez votre réservation',
    date: 'Date',
    time: 'Horaire',
    tickets: 'Billets',
    customer: 'Coordonnées',
    payment: 'Paiement',
    perTicket: 'par billet',
    total: 'Total',
    paymentNote: 'Le paiement s’effectue lors de la réservation',
    important: 'À retenir',
    arriveEarly: 'Merci d’arriver 15 minutes avant le début de la séance',
    bringSwimwear: 'Apportez un maillot de bain et une serviette',
    ownDrinks: 'Vous pouvez apporter vos propres boissons',
    studentIdChecked: 'la carte étudiante sera vérifiée',
    back: 'Retour',
    processing: 'Traitement en cours...',
    confirm: 'Confirmer et réserver',
    errors: {
      slotUnavailable: 'Cet horaire est déjà réservé. Veuillez choisir un autre horaire.',
      membershipNotApplied: 'Votre adhésion ne peut pas être utilisée pour cette réservation pour le moment. Aucune réservation n’a été effectuée ; réessayez dans un instant ou contactez info@hyvantuulensauna.fi.',
      invalidBooking: 'Vérifiez les informations de réservation et réessayez.',
      bookingFailed: 'La réservation n’a pas pu être créée. Veuillez réessayer plus tard.',
    },
  },
  de: {
    title: 'Buchung bestätigen',
    date: 'Datum',
    time: 'Uhrzeit',
    tickets: 'Tickets',
    customer: 'Kontaktdaten',
    payment: 'Zahlung',
    perTicket: 'pro Ticket',
    total: 'Gesamt',
    paymentNote: 'Die Zahlung erfolgt beim Abschluss der Buchung',
    important: 'Wichtige Hinweise',
    arriveEarly: 'Bitte kommen Sie 15 Minuten vor Beginn Ihres Saunagangs',
    bringSwimwear: 'Bringen Sie Badekleidung und ein Handtuch mit',
    ownDrinks: 'Sie dürfen eigene Getränke mitbringen',
    studentIdChecked: 'der Studierendenausweis wird überprüft',
    back: 'Zurück',
    processing: 'Wird verarbeitet...',
    confirm: 'Bestätigen und buchen',
    errors: {
      slotUnavailable: 'Diese Uhrzeit ist bereits gebucht. Bitte wählen Sie eine andere Uhrzeit.',
      membershipNotApplied: 'Ihre Mitgliedschaft kann derzeit nicht für diese Buchung verwendet werden. Es wurde keine Buchung vorgenommen. Versuchen Sie es in Kürze erneut oder kontaktieren Sie info@hyvantuulensauna.fi.',
      invalidBooking: 'Bitte überprüfen Sie Ihre Buchungsdaten und versuchen Sie es erneut.',
      bookingFailed: 'Die Buchung konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.',
    },
  },
} as const;

const TICKET_NAMES: Record<BookingLocale, { adult: string; student: string }> = {
  fi: { adult: 'Aikuinen', student: 'Opiskelija' },
  en: { adult: 'Adult', student: 'Student' },
  es: { adult: 'Adulto', student: 'Estudiante' },
  fr: { adult: 'Adulte', student: 'Étudiant' },
  de: { adult: 'Erwachsener', student: 'Studierender' },
};

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
  locale = 'fi',
}: Step4ConfirmProps) {
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

  const formatTime = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

  const totalQuantity = tickets.reduce((sum, t) => sum + t.quantity, 0);

  // Use actual prices from Bookla API
  const getTicketPrice = (ticketID: string) => {
    const ticket = availableTickets.find(at => at.id === ticketID);
    return ticket?.price || 0;
  };

  const totalPrice = tickets.reduce(
    (sum, t) => sum + getTicketPrice(t.ticketID) * t.quantity,
    0
  );

  const getTicketDisplayName = (name: string) => {
    const normalizedName = name.toLowerCase();
    if (normalizedName === 'adult' || normalizedName === 'aikuinen') return TICKET_NAMES[locale].adult;
    if (normalizedName === 'student' || normalizedName === 'opiskelija') return TICKET_NAMES[locale].student;
    return name;
  };

  const getLocalizedBookingError = (error: string) => {
    switch (error) {
      case 'SLOT_UNAVAILABLE':
      case 'Tämä aika on jo varattu. Valitse toinen aika.':
        return t.errors.slotUnavailable;
      case 'MEMBERSHIP_NOT_APPLIED':
      case 'Jäsenyyttä ei voitu käyttää tähän varaukseen juuri nyt. Varausta ei tehty — kokeile hetken kuluttua uudelleen tai ota yhteyttä info@hyvantuulensauna.fi.':
        return t.errors.membershipNotApplied;
      case 'Missing required fields: startTime, tickets, client.email, client.firstName, client.lastName':
      case 'At least one ticket required':
        return t.errors.invalidBooking;
      default:
        return t.errors.bookingFailed;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-stone-900">{t.title}</h3>

      {/* Summary Card */}
      <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-2.5">
        {/* Date */}
        <div className="flex items-start gap-2.5">
          <Calendar className="h-4 w-4 text-lake" aria-hidden="true" />
          <div>
            <p className="text-sm text-stone-500">{t.date}</p>
            <p className="font-medium text-stone-900">{formatDate(selectedDate)}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-2.5">
          <Clock className="h-4 w-4 text-lake" aria-hidden="true" />
          <div>
            <p className="text-sm text-stone-500">{t.time}</p>
            <p className="font-medium text-stone-900">
              {formatTime(selectedSlot.startHour)} - {formatTime(selectedSlot.endHour)}
            </p>
          </div>
        </div>

        {/* Tickets */}
        <div className="flex items-start gap-2.5">
          <Ticket className="h-4 w-4 text-lake" aria-hidden="true" />
          <div>
            <p className="text-sm text-stone-500">{t.tickets} ({totalQuantity})</p>
            <div className="space-y-1">
              {tickets.map((ticket, index) => (
                <p key={index} className="font-medium text-stone-900">
                  {ticket.quantity}× {getTicketDisplayName(ticket.name)}
                  {/opiskelija|student/i.test(ticket.name) && (
                    <span className="ml-2 text-xs text-amber-600">
                      ({t.studentIdChecked})
                    </span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="flex items-start gap-2.5">
          <User className="h-4 w-4 text-lake" aria-hidden="true" />
          <div>
            <p className="text-sm text-stone-500">{t.customer}</p>
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
          <CreditCard className="h-4 w-4 text-lake" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm text-stone-500">{t.payment}</p>
            <div className="mt-1 space-y-1">
              {tickets.map((ticket, i) => {
                const price = getTicketPrice(ticket.ticketID);
                const lineTotal = price * ticket.quantity;
                return (
                  <p key={i} className="text-sm text-stone-700">
                    {ticket.quantity}× {getTicketDisplayName(ticket.name)} — {formatPrice(lineTotal)}
                    <span className="text-stone-400"> ({formatPrice(price)} {t.perTicket})</span>
                  </p>
                );
              })}
            </div>
            <p className="mt-2 font-semibold text-stone-900">
              {t.total}: {formatPrice(totalPrice)}
            </p>
            <p className="text-xs text-stone-500">{t.paymentNote}</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-lake/5 p-3">
        <div className="flex gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-lake" aria-hidden="true" />
          <div>
            <p className="font-medium text-stone-900">{t.important}</p>
            <ul className="mt-1 space-y-1 text-sm text-stone-600">
              <li>• {t.arriveEarly}</li>
              <li>• {t.bringSwimwear}</li>
              <li>• {t.ownDrinks}</li>
            </ul>
          </div>
        </div>
      </div>

      {bookingError && (
        <div className="rounded-lg bg-red-50 p-3" role="alert">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <p className="text-xs text-red-700">{getLocalizedBookingError(bookingError)}</p>
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
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {t.back}
        </button>
        <button
          onClick={onBook}
          disabled={isBooking}
          className="inline-flex items-center gap-2 rounded-lg bg-lake px-5 py-2.5 text-sm font-medium text-white hover:bg-lake-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBooking ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              {t.processing}
            </>
          ) : (
            t.confirm
          )}
        </button>
      </div>
    </div>
  );
}
