'use client';

import { Check } from 'lucide-react';

type BookingLocale = 'fi' | 'en' | 'es' | 'fr' | 'de';

interface BookingStepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  locale?: BookingLocale;
}

const texts = {
  fi: {
    steps: ['Valitse vuoro', 'Valitse liput', 'Täytä tiedot', 'Vahvista ja maksa'],
    progressLabel: 'Varauksen vaiheet',
    step: 'Vaihe',
  },
  en: {
    steps: ['Select a session', 'Select tickets', 'Your details', 'Confirm and pay'],
    progressLabel: 'Booking progress',
    step: 'Step',
  },
  es: {
    steps: ['Elige el horario', 'Elige las entradas', 'Tus datos', 'Confirma y paga'],
    progressLabel: 'Progreso de la reserva',
    step: 'Paso',
  },
  fr: {
    steps: ['Choisir une séance', 'Choisir les billets', 'Vos coordonnées', 'Confirmer et payer'],
    progressLabel: 'Progression de la réservation',
    step: 'Étape',
  },
  de: {
    steps: ['Saunagang wählen', 'Tickets wählen', 'Daten eingeben', 'Bestätigen und bezahlen'],
    progressLabel: 'Buchungsfortschritt',
    step: 'Schritt',
  },
} as const;

export default function BookingStepIndicator({ 
  currentStep, 
  totalSteps = 4,
  locale = 'fi',
}: BookingStepIndicatorProps) {
  const t = texts[locale];
  const steps = t.steps;

  return (
    <nav className="mb-6" aria-label={t.progressLabel}>
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
                    ? 'bg-lake text-white' 
                    : isCurrent 
                      ? 'bg-lake text-white' 
                      : 'bg-stone-200 text-stone-500'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : stepNumber}
              </div>
              <span 
                className={`ml-1.5 hidden text-xs font-medium sm:block ${
                  isCurrent ? 'text-stone-900' : 'text-stone-500'
                }`}
              >
                {label}
              </span>
              {index < totalSteps - 1 && (
                <div className="mx-1.5 h-px w-6 bg-stone-300 sm:mx-3 sm:w-10" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile progress text */}
      <div className="mt-3 text-center sm:hidden">
        <p className="text-xs font-medium text-stone-900">
          {t.step} {currentStep}/{totalSteps}: {steps[currentStep - 1]}
        </p>
      </div>
    </nav>
  );
}
