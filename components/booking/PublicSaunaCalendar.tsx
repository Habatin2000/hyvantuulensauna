'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

type BookingLocale = 'fi' | 'en' | 'es' | 'fr' | 'de';
type DayStatus = 'disabled' | 'selected' | 'soldout' | 'available' | 'unavailable';

interface PublicSaunaCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
  availableDates?: Set<string>;
  soldOutDates?: Set<string>;
  onMonthChange?: (year: number, month: number) => void;
  locale?: BookingLocale;
}

const DATE_LOCALES: Record<BookingLocale, string> = {
  fi: 'fi-FI',
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

const WEEKDAYS: Record<BookingLocale, string[]> = {
  fi: ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
  fr: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
  de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
};

const texts = {
  fi: {
    title: 'Valitse päivämäärä',
    availabilityHint: 'Vihreällä merkityt päivät ovat varattavissa.',
    previousMonth: 'Edellinen kuukausi',
    nextMonth: 'Seuraava kuukausi',
    loading: 'Haetaan aikoja...',
    available: 'Vapaa',
    soldOut: 'Loppuunmyyty',
    selected: 'Valittu',
    status: {
      selected: 'valittu',
      available: 'vapaa',
      soldout: 'loppuunmyyty',
      unavailable: 'ei varattavissa',
    },
  },
  en: {
    title: 'Select a date',
    availabilityHint: 'Days marked in green are available to book.',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    loading: 'Loading times...',
    available: 'Available',
    soldOut: 'Sold out',
    selected: 'Selected',
    status: {
      selected: 'selected',
      available: 'available',
      soldout: 'sold out',
      unavailable: 'not available',
    },
  },
  es: {
    title: 'Selecciona una fecha',
    availabilityHint: 'Los días marcados en verde están disponibles para reservar.',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    loading: 'Cargando horarios...',
    available: 'Disponible',
    soldOut: 'Agotado',
    selected: 'Seleccionado',
    status: {
      selected: 'seleccionado',
      available: 'disponible',
      soldout: 'agotado',
      unavailable: 'no disponible',
    },
  },
  fr: {
    title: 'Sélectionnez une date',
    availabilityHint: 'Les jours indiqués en vert peuvent être réservés.',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    loading: 'Chargement des horaires...',
    available: 'Disponible',
    soldOut: 'Complet',
    selected: 'Sélectionné',
    status: {
      selected: 'sélectionné',
      available: 'disponible',
      soldout: 'complet',
      unavailable: 'non disponible',
    },
  },
  de: {
    title: 'Datum auswählen',
    availabilityHint: 'Grün markierte Tage können gebucht werden.',
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    loading: 'Zeiten werden geladen...',
    available: 'Verfügbar',
    soldOut: 'Ausgebucht',
    selected: 'Ausgewählt',
    status: {
      selected: 'ausgewählt',
      available: 'verfügbar',
      soldout: 'ausgebucht',
      unavailable: 'nicht verfügbar',
    },
  },
} as const;

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

// Season range: May 1 to September 13

export default function PublicSaunaCalendar({ 
  selectedDate, 
  onSelectDate,
  isLoading = false,
  availableDates = new Set(),
  soldOutDates = new Set(),
  onMonthChange,
  locale = 'fi',
}: PublicSaunaCalendarProps) {
  const t = texts[locale];
  const dateLocale = DATE_LOCALES[locale];
  // Start from current month, but not before May 1st
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    const helsinkiDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    const [year, month] = helsinkiDateStr.split('-').map(Number);
    // If we're before May, start from May; otherwise start from current month
    const startMonth = month < 5 ? 4 : month - 1; // 4 = May (0-indexed)
    return new Date(year, startMonth, 1);
  });

  // Fetch month availability on mount and when month changes
  useEffect(() => {
    onMonthChange?.(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const today = useMemo(() => {
    const now = new Date();
    const helsinkiDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    return new Date(helsinkiDateStr + 'T00:00:00');
  }, []);

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    
    const days = [];
    
    // Previous month padding days
    const prevMonth = new Date(year, month, 0);
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = new Date(prevMonth);
      day.setDate(prevMonth.getDate() - i);
      days.push({
        date: formatDateInHelsinki(day),
        dayOfMonth: day.getDate(),
        isCurrentMonth: false,
        isPast: day < today
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      days.push({
        date: formatDateInHelsinki(day),
        dayOfMonth: i,
        isCurrentMonth: true,
        isPast: day < today
      });
    }
    
    // Next month padding days
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const day = new Date(year, month + 1, i);
      days.push({
        date: formatDateInHelsinki(day),
        dayOfMonth: i,
        isCurrentMonth: false,
        isPast: day < today
      });
    }
    
    return days;
  }, [currentMonth, today]);

  const weekdayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(dateLocale, { weekday: 'long', timeZone: 'UTC' });
    return WEEKDAYS[locale].map((short, index) => ({
      short,
      long: formatter.format(new Date(Date.UTC(2024, 0, index + 1))),
    }));
  }, [dateLocale, locale]);

  const monthLabel = useMemo(() => {
    const label = new Intl.DateTimeFormat(dateLocale, {
      month: 'long',
      year: 'numeric',
    }).format(currentMonth);
    return label.charAt(0).toLocaleUpperCase(dateLocale) + label.slice(1);
  }, [currentMonth, dateLocale]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth() + 1);
  };

  const getDayStatus = (date: string, isPast: boolean, isCurrentMonth: boolean): DayStatus => {
    if (isPast || !isCurrentMonth) return 'disabled';
    if (selectedDate === date) return 'selected';
    if (soldOutDates.has(date)) return 'soldout';
    if (availableDates.has(date)) return 'available';
    return 'unavailable';
  };

  const getDayStyles = (status: DayStatus) => {
    switch (status) {
      case 'selected':
        return 'bg-lake text-white ring-2 ring-lake ring-offset-2';
      // Underline / strikethrough are the non-color cues for availability
      case 'available':
        return 'bg-green-500 text-white hover:bg-green-600 font-medium underline underline-offset-2 cursor-pointer';
      case 'soldout':
        return 'bg-red-500 text-white font-medium line-through cursor-not-allowed';
      case 'unavailable':
        return 'text-stone-300 cursor-not-allowed';
      case 'disabled':
        return 'text-stone-200 cursor-not-allowed';
      default:
        return '';
    }
  };

  const getDayAriaLabel = (date: string, status: DayStatus) => {
    const dateText = new Intl.DateTimeFormat(dateLocale, {
      day: 'numeric',
      month: 'long',
    }).format(new Date(date + 'T00:00:00'));
    const statusText = status === 'disabled' || status === 'unavailable'
      ? t.status.unavailable
      : t.status[status];
    return `${dateText}, ${statusText}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-base font-semibold text-stone-900">{t.title}</h3>
        <p className="mb-3 text-xs text-stone-600">
          {t.availabilityHint}
        </p>

        <div className="rounded-xl border border-stone-200 bg-white p-3 max-w-md mx-auto">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigateMonth('prev')}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
              aria-label={t.previousMonth}
            >
              <ChevronLeft className="h-[18px] w-[18px] text-stone-600" aria-hidden="true" />
            </button>
            <h4 className="text-base font-semibold text-stone-900">
              {monthLabel}
            </h4>
            <button
              onClick={() => navigateMonth('next')}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
              aria-label={t.nextMonth}
            >
              <ChevronRight className="h-[18px] w-[18px] text-stone-600" aria-hidden="true" />
            </button>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-3 mb-2" role="status">
              <Loader2 className="h-5 w-5 animate-spin text-lake" aria-hidden="true" />
              <span className="ml-2 text-xs text-stone-600">{t.loading}</span>
            </div>
          )}

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1.5">
            {weekdayNames.map(day => (
              <div key={day.long} className="text-center text-xs font-medium text-stone-500 py-1.5">
                <span aria-hidden="true">{day.short}</span>
                <span className="sr-only">{day.long}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {calendarDays.map((day, i) => {
              const status = getDayStatus(day.date, day.isPast, day.isCurrentMonth);
              const isClickable = status === 'available';
              
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isClickable) {
                      onSelectDate(day.date);
                    }
                  }}
                  disabled={!isClickable}
                  aria-label={getDayAriaLabel(day.date, status)}
                  aria-pressed={selectedDate === day.date}
                  className={`
                    aspect-square rounded-md text-xs transition-all
                    ${getDayStyles(status)}
                    ${!day.isCurrentMonth ? 'opacity-50' : ''}
                  `}
                >
                  {day.dayOfMonth}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-600 justify-center">
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded bg-green-500" aria-hidden="true"></div>
              <span>{t.available}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded bg-red-500" aria-hidden="true"></div>
              <span>{t.soldOut}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded bg-lake" aria-hidden="true"></div>
              <span>{t.selected}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
