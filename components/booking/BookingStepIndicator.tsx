'use client';

import { Check } from 'lucide-react';

interface BookingStepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  'Valitse vuoro',
  'Valitse liput',
  'Täytä tiedot',
  'Vahvista ja maksa',
];

export default function BookingStepIndicator({ 
  currentStep, 
  totalSteps = 4 
}: BookingStepIndicatorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <div key={label} className="flex items-center">
              <div 
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  isCompleted 
                    ? 'bg-[#3b82f6] text-white' 
                    : isCurrent 
                      ? 'bg-[#3b82f6] text-white' 
                      : 'bg-stone-200 text-stone-500'
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepNumber}
              </div>
              <span 
                className={`ml-1.5 hidden text-xs font-medium sm:block ${
                  isCurrent ? 'text-stone-900' : 'text-stone-500'
                }`}
              >
                {label}
              </span>
              {index < totalSteps - 1 && (
                <div className="mx-1.5 h-px w-6 bg-stone-300 sm:mx-3 sm:w-10" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile progress text */}
      <div className="mt-3 text-center sm:hidden">
        <p className="text-xs font-medium text-stone-900">
          Vaihe {currentStep}/{totalSteps}: {steps[currentStep - 1]}
        </p>
      </div>
    </div>
  );
}
