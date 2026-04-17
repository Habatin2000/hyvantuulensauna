'use client';

import { useState } from 'react';
import { ChevronRight, Calendar } from 'lucide-react';

interface AvailabilityInfo {
  date: string;
  capacity: number;
  booked: number;
  available: number;
}

interface Step1SelectTimeProps {
  selectedDate: string | null;
  availability: AvailabilityInfo | null;
  isLoading: boolean;
  onSelect: (date: string) => void;
}

export default function Step1SelectTime({
  selectedDate,
  availability,
  isLoading,
  onSelect,
}: Step1SelectTimeProps) {
  const [dateInput, setDateInput] = useState(selectedDate || '');

  // Generate next 4 Sundays
  const getNextSundays = () => {
    const sundays = [];
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? 0 : 7 - day;
    
    for (let i = 0; i < 4; i++) {
      const sunday = new Date(today);
      sunday.setDate(today.getDate() + diff + (i * 7));
      sundays.push(sunday.toISOString().split('T')[0]);
    }
    return sundays;
  };

  const sundays = getNextSundays();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fi-FI', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-stone-900">Valitse päivämäärä</h3>
        <p className="mb-4 text-sm text-stone-600">
          Julkiset saunavuorot ovat sunnuntaisin klo 14:00 - 17:00
        </p>

        <div className="space-y-3">
          {sundays.map((date) => (
            <button
              key={date}
              onClick={() => {
                setDateInput(date);
                onSelect(date);
              }}
              disabled={isLoading}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selectedDate === date 
                  ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#3b82f6]" />
                  <span className="font-semibold text-stone-900">
                    Sunnuntai {formatDate(date)}
                  </span>
                </div>
                {selectedDate === date && isLoading ? (
                  <span className="text-sm text-stone-500">Tarkistetaan...</span>
                ) : selectedDate === date && availability ? (
                  <span className={`text-sm font-medium ${
                    availability.available > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {availability.available} paikkaa vapaana
                  </span>
                ) : (
                  <ChevronRight className="h-5 w-5 text-stone-400" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Tai valitse muu päivämäärä
          </label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          />
          {dateInput && (
            <button
              onClick={() => onSelect(dateInput)}
              disabled={isLoading}
              className="mt-2 w-full rounded-lg bg-[#3b82f6] px-4 py-2 text-white hover:bg-[#2563eb] disabled:opacity-50"
            >
              {isLoading ? 'Tarkistetaan...' : 'Tarkista saatavuus'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
