'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
  onNavigateDay
}: SummerCalendarProps) {
  // Start from May 1st of current year (summer season start)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    // Get current date in Helsinki timezone
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

  const today = useMemo(() => {
    const now = new Date();
    // Get today's date in Helsinki timezone
    const helsinkiDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    return new Date(helsinkiDateStr + 'T00:00:00');
  }, []);

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

  // Track if initial fetch has been done
  const hasInitialFetchRef = useRef(false);
  
  // Initial fetch on mount only
  useEffect(() => {
    if (!hasInitialFetchRef.current && onMonthChange) {
      hasInitialFetchRef.current = true;
      onMonthChange(currentMonth.getFullYear(), currentMonth.getMonth());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

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
      onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth());
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
      case 'available':
        return 'bg-green-500 text-white hover:bg-green-600 font-medium'; // Vihreä = vapaa
      case 'booked':
        return 'bg-amber-200 text-amber-900 hover:bg-amber-300 font-medium border border-amber-300'; // Haalea keltainen = osittain varattu
      case 'unavailable':
        return 'text-stone-300 cursor-not-allowed';
      case 'disabled':
        return 'text-stone-200 cursor-not-allowed';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateMonth('prev')}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Edellinen kuukausi"
          >
            <ChevronLeft className="h-5 w-5 text-stone-600" />
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-50"
              aria-label="Päivitä"
              title="Päivitä"
            >
              <RefreshCw className={`h-4 w-4 text-stone-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        <h4 className="text-lg font-semibold text-stone-900">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <button
          onClick={() => navigateMonth('next')}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Seuraava kuukausi"
        >
          <ChevronRight className="h-5 w-5 text-stone-600" />
        </button>
      </div>

      {/* Loading indicator -->
      {isLoading && (
        <div className="flex items-center justify-center py-4 mb-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#3b82f6]" />
          <span className="ml-2 text-sm text-stone-600">Haetaan aikoja...</span>
        </div>
      )}

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-stone-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
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
              className={`
                aspect-square rounded-lg text-sm transition-all
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
      <div className="mt-4 flex gap-4 text-xs text-stone-600 justify-center">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-green-500"></div>
          <span>Vapaa (ei varauksia)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-amber-200 border border-amber-300"></div>
          <span>Osittain varattu</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-[#3b82f6]"></div>
          <span>Valittu</span>
        </div>
      </div>
    </div>
  );
}
