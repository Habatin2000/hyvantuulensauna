'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';

export interface BoatOption {
  id: string;
  resourceId: string;
  name: string;
  capacity: string;
  description: string;
  image: string;
}

interface BoatSelectorProps {
  boats: BoatOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
}

export default function BoatSelector({ boats, selectedId, onSelect, compact = false }: BoatSelectorProps) {
  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
      {boats.map((boat) => {
        const isSelected = selectedId === boat.id;
        return (
          <button
            key={boat.id}
            data-boat={boat.id}
            onClick={() => onSelect(boat.id)}
            className={`relative overflow-hidden rounded-2xl border-2 bg-white text-left transition-all hover:shadow-md ${
              isSelected
                ? 'border-teal-600 shadow-md ring-1 ring-teal-600'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className={`relative w-full overflow-hidden ${compact ? 'aspect-video' : 'aspect-[4/3]'}`}>
              <Image
                src={boat.image}
                alt={boat.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {isSelected && (
                <div className={`absolute right-2 top-2 flex items-center justify-center rounded-full bg-teal-600 text-white shadow-sm ${compact ? 'h-6 w-6' : 'h-8 w-8'}`}>
                  <Check className={compact ? 'h-3.5 w-3.5' : 'h-5 w-5'} />
                </div>
              )}
            </div>
            <div className={compact ? 'p-2.5' : 'p-4'}>
              <p className={`font-semibold ${isSelected ? 'text-teal-700' : 'text-stone-900'} ${compact ? 'text-sm' : 'text-lg'}`}>
                {boat.name}
              </p>
              <p className={`text-stone-500 ${compact ? 'text-[10px]' : 'text-sm'}`}>{boat.capacity}</p>
              <p className={`leading-relaxed text-stone-600 ${compact ? 'mt-1 text-[11px] line-clamp-2' : 'mt-2 text-sm line-clamp-2'}`}>
                {boat.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
