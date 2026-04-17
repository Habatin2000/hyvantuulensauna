'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PublicSaunaCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
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

// Generate all Sundays from May 1 to September 13
const generateSundays = (year: number): string[] => {
  const sundays: string[] = [];
  
  // Start from May 1
  const startDate = new Date(year, 4, 1); // May 1
  // End at September 13
  const endDate = new Date(year, 8, 13); // September 13
  
  // Find first Sunday from May 1
  let current = new Date(startDate);
  while (current.getDay() !== 0) {
    current.setDate(current.getDate() + 1);
  }
  
  // Add all Sundays until September 13
  while (current <= endDate) {
    sundays.push(formatDateInHelsinki(current));
    current.setDate(current.getDate() + 7);
  }
  
  return sundays;
};

export default function PublicSaunaCalendar({ 
  selectedDate, 
  onSelectDate,
  isLoading = false,
}: PublicSaunaCalendarProps) {
  const currentYear = new Date().getFullYear();
  
  // Start from May 1st
  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(currentYear, 4, 1); // May 1st
  });

  // All Sundays from May 1 to Sept 13 are available
  const availableDates = useMemo(() => generateSundays(currentYear), [currentYear]);
  const availableDatesSet = useMemo(() => new Set(availableDates), [availableDates]);

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
  };

  const getDayStatus = (date: string, isPast: boolean, isCurrentMonth: boolean) => {
    if (isPast || !isCurrentMonth) return 'disabled';
    if (selectedDate === date) return 'selected';
    if (availableDatesSet.has(date)) return 'available';
    return 'unavailable';
  };

  const getDayStyles = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-[#3b82f6] text-white ring-2 ring-[#3b82f6] ring-offset-2';
      case 'available':
        return 'bg-green-500 text-white hover:bg-green-600 font-medium cursor-pointer';
      case 'unavailable':
        return 'text-stone-300 cursor-not-allowed';
      case 'disabled':
        return 'text-stone-200 cursor-not-allowed';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-stone-900">Valitse päivämäärä</h3>
        <p className="mb-4 text-sm text-stone-600">
          Julkisia saunavuoroja järjestetään sunnuntaisin. Vihreällä merkityt päivät ovat varattavissa.
        </p>

        <div className="rounded-xl border border-stone-200 bg-white p-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Edellinen kuukausi"
            >
              <ChevronLeft className="h-5 w-5 text-stone-600" />
            </button>
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

          {/* Loading indicator */}
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
              <span>Vapaa</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-[#3b82f6]"></div>
              <span>Valittu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
