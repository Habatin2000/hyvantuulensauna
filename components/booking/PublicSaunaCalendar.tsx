'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PublicSaunaCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
  availableDates?: Set<string>;
  soldOutDates?: Set<string>;
  onMonthChange?: (year: number, month: number) => void;
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
  const isEn = locale === 'en';
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

  const getDayStatus = (date: string, isPast: boolean, isCurrentMonth: boolean) => {
    if (isPast || !isCurrentMonth) return 'disabled';
    if (selectedDate === date) return 'selected';
    if (soldOutDates.has(date)) return 'soldout';
    if (availableDates.has(date)) return 'available';
    return 'unavailable';
  };

  const getDayStyles = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-[#3b82f6] text-white ring-2 ring-[#3b82f6] ring-offset-2';
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
        case 'soldout':
          return isEn ? 'sold out' : 'loppuunmyyty';
        default:
          return isEn ? 'not available' : 'ei varattavissa';
      }
    })();
    return `${dateText}, ${statusText}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-base font-semibold text-stone-900">Valitse päivämäärä</h3>
        <p className="mb-3 text-xs text-stone-600">
          Vihreällä merkityt päivät ovat varattavissa.
        </p>

        <div className="rounded-xl border border-stone-200 bg-white p-3 max-w-md mx-auto">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigateMonth('prev')}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Edellinen kuukausi"
            >
              <ChevronLeft className="h-[18px] w-[18px] text-stone-600" />
            </button>
            <h4 className="text-base font-semibold text-stone-900">
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
            <div className="flex items-center justify-center py-3 mb-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#3b82f6]" />
              <span className="ml-2 text-xs text-stone-600">Haetaan aikoja...</span>
            </div>
          )}

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1.5">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-center text-xs font-medium text-stone-500 py-1.5">
                {day}
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
              <div className="h-2.5 w-2.5 rounded bg-green-500"></div>
              <span>Vapaa</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded bg-red-500"></div>
              <span>Loppuunmyyty</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded bg-[#3b82f6]"></div>
              <span>Valittu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
