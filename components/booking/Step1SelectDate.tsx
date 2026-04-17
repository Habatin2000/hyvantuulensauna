'use client';

import { useState } from 'react';
import { ChevronRight, Calendar } from 'lucide-react';

interface Step1SelectDateProps {
  selectedDate: string | null;
  isLoading: boolean;
  onSelect: (date: string) => void;
}

export default function Step1SelectDate({
  selectedDate,
  isLoading,
  onSelect,
}: Step1SelectDateProps) {
  const [dateInput, setDateInput] = useState(selectedDate || '');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fi-FI', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Quick select: next 14 days
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      days.push(day.toISOString().split('T')[0]);
    }
    return days;
  };

  const nextDays = getNextDays();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-stone-900">Valitse päivämäärä</h3>
        <p className="mb-4 text-sm text-stone-600">
          Valitse haluamasi päivä. Saatavuus ja ajat näytetään seuraavassa vaiheessa.
        </p>

        {/* Quick select grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {nextDays.slice(0, 8).map((date) => (
            <button
              key={date}
              onClick={() => onSelect(date)}
              disabled={isLoading}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedDate === date 
                  ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <span className="text-sm font-medium text-stone-900">
                {formatDate(date)}
              </span>
            </button>
          ))}
        </div>

        {/* Date picker */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Tai valitse muu päivämäärä
          </label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => {
              setDateInput(e.target.value);
              if (e.target.value) {
                onSelect(e.target.value);
              }
            }}
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          />
        </div>
      </div>
    </div>
  );
}
