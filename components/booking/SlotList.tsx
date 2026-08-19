'use client';

import { Clock, Plus, Minus, Loader2 } from 'lucide-react';

export interface TimeSlot {
  startTime: string;
  endTime?: string;
  duration: string;
  spotsAvailable: number;
  resourceId: string;
  price: { amount: number; currency: string; comparedAmount?: number } | null;
}

interface SlotListProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
  onExtend: () => void;
  onReduce?: () => void;
  isExtending?: boolean;
  isReducing?: boolean;
  canReduce?: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(cents: number | null | undefined) {
  if (!cents) return '0 €';
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`;
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours + minutes / 60;
}

function slotEnd(start: string, durationHours: number): string {
  const d = new Date(start);
  d.setHours(d.getHours() + Math.floor(durationHours));
  d.setMinutes(d.getMinutes() + Math.round((durationHours % 1) * 60));
  return formatTime(d.toISOString());
}

export default function SlotList({
  slots,
  selectedSlot,
  onSelect,
  onExtend,
  onReduce,
  isExtending,
  isReducing,
  canReduce,
}: SlotListProps) {
  const displaySlots = slots.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const morning = displaySlots.filter((s) => new Date(s.startTime).getHours() < 12);
  const evening = displaySlots.filter((s) => new Date(s.startTime).getHours() >= 12);

  const renderGroup = (title: string, group: TimeSlot[]) => {
    if (group.length === 0) return null;
    return (
      <div key={title} className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">{title}</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          {group.map((slot, index) => {
            const durationHours = parseDuration(slot.duration);
            const start = formatTime(slot.startTime);
            const end = slotEnd(slot.startTime, durationHours);
            const isSelected = selectedSlot?.startTime === slot.startTime;
            const price = formatPrice(slot.price?.amount);

            return (
              <div key={`${slot.startTime}-${index}`} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                <button
                  onClick={() => onSelect(slot)}
                  className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    isSelected ? 'bg-teal-50' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span className="font-semibold text-stone-900">
                        {start}–{end}
                      </span>
                    </div>
                    <span className="text-sm text-stone-500">{durationHours} h</span>
                  </div>
                  <span className="font-semibold text-stone-900">{price}</span>
                </button>

                {isSelected && (
                  <div className="border-t border-stone-100 bg-stone-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">Muuta kestoa</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={onReduce}
                          disabled={!canReduce || isReducing}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm font-medium text-teal-700 shadow-sm transition-colors hover:bg-teal-50 disabled:opacity-50"
                        >
                          {isReducing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Minus className="h-3.5 w-3.5" />
                          )}
                          -1h
                        </button>
                        <button
                          onClick={onExtend}
                          disabled={isExtending}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm font-medium text-teal-700 shadow-sm transition-colors hover:bg-teal-50 disabled:opacity-50"
                        >
                          {isExtending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                          +1h
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (displaySlots.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 text-center text-stone-600">
        Ei vapaita aikoja valitulle päivälle.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {renderGroup('Aamu', morning)}
      {renderGroup('Ilta', evening)}
    </div>
  );
}
