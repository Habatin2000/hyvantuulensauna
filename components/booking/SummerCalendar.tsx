'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';

interface SummerCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  availableDates: string[];
  datesWithSlots: string[]; // Dates that have available time slots
  onMonthChange?: (year: number, month: number) => void; // Called when month changes
  isLoading?: boolean; // Loading state for fetching month data
  onRefresh?: () => void; // Refresh button handler
  onNavigateDay?: (direction: 'prev' | 'next') => void; // Day navigation handler
  locale?: 'fi' | 'en';
}

const WEEKDAYS = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
const MONTH_NAMES = [
  'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
  'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'
];

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

export default function SummerCalendar({
  selectedDate,
  onSelectDate,
  availableDates,
  datesWithSlots,
  onMonthChange,
  isLoading = false,
  onRefresh,
  locale = 'fi',
}: SummerCalendarProps) {
  const isEn = locale === 'en';
  const [mounted, setMounted] = useState(false);

  // Start from May 1st of current year (summer season start)
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 4, 1));
  const [today, setToday] = useState(() => new Date(2026, 4, 1));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard: must set state after mount (server has no clock/timezone)
    setMounted(true);
    const now = new Date();
    const helsinkiDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    const [year, month, day] = helsinkiDateStr.split('-').map(Number);
    const startMonth = month < 5 ? 4 : month - 1;
    const initialMonth = new Date(year, startMonth, 1);
    setCurrentMonth(initialMonth);
    setToday(new Date(year, month - 1, day));
    onMonthChange?.(initialMonth.getFullYear(), initialMonth.getMonth() + 1);
  }, [onMonthChange]);

  // Create set for faster lookup
  const availableDatesSet = useMemo(() => new Set(availableDates), [availableDates]);
  const datesWithSlotsSet = useMemo(() => new Set(datesWithSlots), [datesWithSlots]);

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Adjust for Monday start (0 = Monday in our system)
    // getDay() returns 0 for Sunday, so we need to adjust
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
    
    // Next month padding days to complete the grid (6 rows x 7 cols = 42 cells)
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    // Notify parent after state update (use setTimeout to avoid render-phase update)
    setTimeout(() => {
      onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth() + 1);
    }, 0);
  };

  const getDayStatus = (date: string, isPast: boolean, isCurrentMonth: boolean) => {
    if (isPast || !isCurrentMonth) return 'disabled';
    if (!availableDatesSet.has(date)) return 'unavailable';
    if (selectedDate === date) return 'selected';
    if (datesWithSlotsSet.has(date)) return 'booked'; // Päivällä on aikoja, osittain varattu
    return 'available'; // Päivä vapaa, ei varauksia vielä
  };

  const getDayStyles = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-[#3b82f6] text-white ring-2 ring-[#3b82f6] ring-offset-2';
      // Underline styles are the non-color cues for availability status
      case 'available':
        return 'bg-green-500 text-white hover:bg-green-600 font-medium underline underline-offset-2'; // Vihreä = vapaa
      case 'booked':
        return 'bg-amber-200 text-amber-900 hover:bg-amber-300 font-medium border border-amber-300 underline decoration-dotted underline-offset-2'; // Haalea keltainen = osittain varattu
      case 'unavailable':
        return 'text-stone-300 cursor-not-allowed';
      case 'disabled':
        return 'text-stone-200 cursor-not-allowed';
      default:
        return '';
    }
  };

  // Full-date bilingual accessible name, e.g. "12. kesäkuuta, vapaa" / "12 June, available"
  const getDayAriaLabel = (date: string, status: string) => {
    const dateText = new Intl.DateTimeFormat(isEn ? 'en-GB' : 'fi-FI', {
      day: 'numeric',
      month: 'long',
    }).format(new Date(date + 'T00:00:00'));
    const statusText = (() => {
      switch (status) {
        case 'selected':
          return isEn ? 'selected' : 'valittu';
        case 'available':
          return isEn ? 'available' : 'vapaa';
        case 'booked':
          return isEn ? 'partially booked' : 'osittain varattu';
        default:
          return isEn ? 'not available' : 'ei varattavissa';
      }
    })();
    return `${dateText}, ${statusText}`;
  };

  if (!mounted) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-3 w-full flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-[#3b82f6]" />
        <span className="ml-2 text-sm text-stone-600">Ladataan kalenteria...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white w-full p-2 md:p-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateMonth('prev')}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Edellinen kuukausi"
          >
            <ChevronLeft className="h-[18px] w-[18px] text-stone-600" />
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-50"
              aria-label="Päivitä"
              title="Päivitä"
            >
              <RefreshCw className={`h-[18px] w-[18px] text-stone-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        <h4 className="font-semibold text-stone-900 text-sm md:text-base">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <button
          onClick={() => navigateMonth('next')}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Seuraava kuukausi"
        >
          <ChevronRight className="h-[18px] w-[18px] text-stone-600" />
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-4 mb-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#3b82f6]" />
          <span className="ml-2 text-sm text-stone-600">Haetaan aikoja...</span>
        </div>
      )}

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1.5">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center font-medium text-stone-500 text-[10px] md:text-xs py-1 md:py-1.5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5" data-testid="calendar-grid">
        {calendarDays.map((day, i) => {
          const status = getDayStatus(day.date, day.isPast, day.isCurrentMonth);
          const isClickable = status === 'available' || (status === 'booked' && datesWithSlotsSet.has(day.date));
          
          return (
            <button
              key={i}
              onClick={() => {
                if (isClickable || availableDatesSet.has(day.date)) {
                  onSelectDate(day.date);
                }
              }}
              disabled={!isClickable && !availableDatesSet.has(day.date)}
              aria-label={getDayAriaLabel(day.date, status)}
              className={`
                rounded-md transition-all h-8 text-[10px] md:aspect-square md:h-auto md:text-xs
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
      <div className="mt-3 hidden md:flex gap-4 text-[10px] text-stone-600 justify-center">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-green-500"></div>
          <span>Vapaa (ei varauksia)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-amber-200 border border-amber-300"></div>
          <span>Osittain varattu</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-[#3b82f6]"></div>
          <span>Valittu</span>
        </div>
      </div>

      {/* Payment notice */}
      <div className="mt-4 hidden md:block rounded-lg bg-[#fef3c7] border border-amber-200 p-3 text-center">
        <p className="text-xs font-medium text-amber-900">
          Haluatko maksaa myöhemmin? Tiedustele saatavuutta puhelimitse, Whatsapilla tai sähköpostilla!
        </p>
      </div>
    </div>
  );
}
