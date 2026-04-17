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
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <div key={label} className="flex items-center">
              <div 
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isCompleted 
                    ? 'bg-[#3b82f6] text-white' 
                    : isCurrent 
                      ? 'bg-[#3b82f6] text-white' 
                      : 'bg-stone-200 text-stone-500'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span 
                className={`ml-2 hidden text-sm font-medium sm:block ${
                  isCurrent ? 'text-stone-900' : 'text-stone-500'
                }`}
              >
                {label}
              </span>
              {index < totalSteps - 1 && (
                <div className="mx-2 h-px w-8 bg-stone-300 sm:mx-4 sm:w-12" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile progress text */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm font-medium text-stone-900">
          Vaihe {currentStep}/{totalSteps}: {steps[currentStep - 1]}
        </p>
      </div>
    </div>
  );
}
