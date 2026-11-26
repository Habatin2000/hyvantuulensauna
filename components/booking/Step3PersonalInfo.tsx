'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, ChevronLeft, ChevronRight, Check, X, Loader2 } from 'lucide-react';

type BookingLocale = 'fi' | 'en' | 'es' | 'fr' | 'de';

interface MembershipInfo {
  isMember: boolean;
  // The subscription code never leaves the server — when a membership is
  // recognized we only pass useMembership: true up and the booking route
  // resolves the code from the customer email server-side.
  useMembership?: boolean;
  subscriptionId?: string;
  subscriptionName?: string;
  remainingUses?: number | null;
  totalLimit?: number | null;
  usedCount?: number | null;
  isUnlimited?: boolean;
  canUseSubscription?: boolean;
  expiresAt?: string | null;
}

interface Step3PersonalInfoProps {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onUpdateInfo: (info: { firstName: string; lastName: string; email: string; phone: string }) => void;
  onMembershipCheck: (membership: MembershipInfo | null) => void;
  onNext: () => void;
  onBack: () => void;
  locale?: BookingLocale;
  marketingConsent?: boolean;
  onMarketingConsentChange?: (value: boolean) => void;
}

const DATE_LOCALES: Record<BookingLocale, string> = {
  fi: 'fi-FI',
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

const texts = {
  fi: {
    title: 'Täytä yhteystiedot',
    firstName: 'Etunimi',
    lastName: 'Sukunimi',
    email: 'Sähköposti',
    phone: 'Puhelinnumero',
    marketingConsent: 'Haluan saada Hyvän Tuulen Saunan tarjouksia ja uutisia sähköpostiini. Voin perua suostumuksen milloin tahansa. (Vapaaehtoinen)',
    firstNamePlaceholder: 'Matti',
    lastNamePlaceholder: 'Meikäläinen',
    emailPlaceholder: 'matti@example.com',
    firstNameRequired: 'Etunimi on pakollinen',
    lastNameRequired: 'Sukunimi on pakollinen',
    emailRequired: 'Sähköposti on pakollinen',
    emailInvalid: 'Tarkista sähköpostiosoite',
    checkingMembership: 'Tarkistetaan kanta-asiakkuutta...',
    membershipRecognized: (name?: string) => name ? `${name} tunnistettu!` : 'Kanta-asiakkuus tunnistettu!',
    unlimitedUse: 'Rajaton käyttöoikeus',
    visitsRemaining: (remaining: number, total?: number | null) =>
      `${remaining} ${remaining === 1 ? 'käynti' : 'käyntiä'} jäljellä${total ? ` (yht. ${total})` : ''}`,
    memberPrice: 'Saat jäsenhinnan varaukseesi.',
    membershipCharged: 'Kanta-asiakkuus tunnistettu — varaus veloitetaan jäsenyydestäsi.',
    validUntil: (date: string) => `Voimassa ${date} asti`,
    noMembership: 'Ei aktiivista kanta-asiakkuutta',
    back: 'Takaisin',
    continue: 'Jatka',
  },
  en: {
    title: 'Fill in your contact details',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    marketingConsent: 'I want to receive offers and news from Hyvän Tuulen Sauna by email. I can withdraw my consent at any time. (Optional)',
    firstNamePlaceholder: 'John',
    lastNamePlaceholder: 'Doe',
    emailPlaceholder: 'john@example.com',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Check the email address',
    checkingMembership: 'Checking membership...',
    membershipRecognized: (name?: string) => name ? `${name} recognized!` : 'Membership recognized!',
    unlimitedUse: 'Unlimited usage',
    visitsRemaining: (remaining: number, total?: number | null) =>
      `${remaining} ${remaining === 1 ? 'visit' : 'visits'} remaining${total ? ` (total ${total})` : ''}`,
    memberPrice: 'You get the member price for your booking.',
    membershipCharged: 'Membership recognized — your booking will be charged to your membership.',
    validUntil: (date: string) => `Valid until ${date}`,
    noMembership: 'No active membership',
    back: 'Back',
    continue: 'Continue',
  },
  es: {
    title: 'Introduce tus datos de contacto',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    email: 'Correo electrónico',
    phone: 'Número de teléfono',
    marketingConsent: 'Quiero recibir ofertas y novedades de Hyvän Tuulen Sauna por correo electrónico. Puedo retirar mi consentimiento en cualquier momento. (Opcional)',
    firstNamePlaceholder: 'María',
    lastNamePlaceholder: 'García',
    emailPlaceholder: 'maria@example.com',
    firstNameRequired: 'El nombre es obligatorio',
    lastNameRequired: 'Los apellidos son obligatorios',
    emailRequired: 'El correo electrónico es obligatorio',
    emailInvalid: 'Comprueba la dirección de correo electrónico',
    checkingMembership: 'Comprobando la membresía...',
    membershipRecognized: (name?: string) => name ? `Membresía reconocida: ${name}` : '¡Membresía reconocida!',
    unlimitedUse: 'Uso ilimitado',
    visitsRemaining: (remaining: number, total?: number | null) =>
      `${remaining} ${remaining === 1 ? 'visita restante' : 'visitas restantes'}${total ? ` (total: ${total})` : ''}`,
    memberPrice: 'Obtienes el precio de miembro para tu reserva.',
    membershipCharged: 'Tu reserva se cargará a tu membresía.',
    validUntil: (date: string) => `Válida hasta el ${date}`,
    noMembership: 'No hay ninguna membresía activa',
    back: 'Atrás',
    continue: 'Continuar',
  },
  fr: {
    title: 'Saisissez vos coordonnées',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Numéro de téléphone',
    marketingConsent: 'Je souhaite recevoir les offres et actualités de Hyvän Tuulen Sauna par e-mail. Je peux retirer mon consentement à tout moment. (Facultatif)',
    firstNamePlaceholder: 'Marie',
    lastNamePlaceholder: 'Dupont',
    emailPlaceholder: 'marie@example.com',
    firstNameRequired: 'Le prénom est obligatoire',
    lastNameRequired: 'Le nom est obligatoire',
    emailRequired: 'L’e-mail est obligatoire',
    emailInvalid: 'Vérifiez l’adresse e-mail',
    checkingMembership: 'Vérification de l’adhésion...',
    membershipRecognized: (name?: string) => name ? `Adhésion reconnue : ${name}` : 'Adhésion reconnue !',
    unlimitedUse: 'Utilisation illimitée',
    visitsRemaining: (remaining: number, total?: number | null) =>
      `${remaining} ${remaining === 1 ? 'visite restante' : 'visites restantes'}${total ? ` (total : ${total})` : ''}`,
    memberPrice: 'Vous bénéficiez du tarif adhérent pour votre réservation.',
    membershipCharged: 'Votre réservation sera débitée de votre adhésion.',
    validUntil: (date: string) => `Valable jusqu’au ${date}`,
    noMembership: 'Aucune adhésion active',
    back: 'Retour',
    continue: 'Continuer',
  },
  de: {
    title: 'Geben Sie Ihre Kontaktdaten ein',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    phone: 'Telefonnummer',
    marketingConsent: 'Ich möchte Angebote und Neuigkeiten von Hyvän Tuulen Sauna per E-Mail erhalten. Ich kann meine Einwilligung jederzeit widerrufen. (Optional)',
    firstNamePlaceholder: 'Max',
    lastNamePlaceholder: 'Mustermann',
    emailPlaceholder: 'max@example.com',
    firstNameRequired: 'Der Vorname ist erforderlich',
    lastNameRequired: 'Der Nachname ist erforderlich',
    emailRequired: 'Die E-Mail-Adresse ist erforderlich',
    emailInvalid: 'Überprüfen Sie die E-Mail-Adresse',
    checkingMembership: 'Mitgliedschaft wird überprüft...',
    membershipRecognized: (name?: string) => name ? `Mitgliedschaft erkannt: ${name}` : 'Mitgliedschaft erkannt!',
    unlimitedUse: 'Unbegrenzte Nutzung',
    visitsRemaining: (remaining: number, total?: number | null) =>
      `${remaining} ${remaining === 1 ? 'Besuch' : 'Besuche'} verbleibend${total ? ` (insgesamt ${total})` : ''}`,
    memberPrice: 'Sie erhalten den Mitgliederpreis für Ihre Buchung.',
    membershipCharged: 'Ihre Buchung wird über Ihre Mitgliedschaft abgerechnet.',
    validUntil: (date: string) => `Gültig bis ${date}`,
    noMembership: 'Keine aktive Mitgliedschaft',
    back: 'Zurück',
    continue: 'Weiter',
  },
} as const;

export default function Step3PersonalInfo({
  customerInfo,
  onUpdateInfo,
  onMembershipCheck,
  onNext,
  onBack,
  locale = 'fi',
  marketingConsent = false,
  onMarketingConsentChange,
}: Step3PersonalInfoProps) {
  const t = texts[locale];
  const formatValidUntil = (date: string) => {
    const formatted = new Intl.DateTimeFormat(DATE_LOCALES[locale], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
    return t.validUntil(formatted);
  };

  const [localInfo, setLocalInfo] = useState(customerInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);

  // Check membership when email changes
  useEffect(() => {
    const checkMembership = async () => {
      if (!localInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localInfo.email)) {
        setMembership(null);
        onMembershipCheck(null);
        return;
      }

      setIsCheckingMembership(true);
      try {
        const res = await fetch('/api/bookla/membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: localInfo.email }),
        });

        if (res.ok) {
          const data: MembershipInfo = await res.json();
          // The API only reports status — flag the booking to use the
          // membership; the server re-verifies and resolves the code itself.
          const membershipData: MembershipInfo = data.isMember
            ? { ...data, useMembership: true }
            : data;
          setMembership(membershipData);
          onMembershipCheck(membershipData);
        }
      } catch (e) {
        console.error('Membership check failed:', e);
      } finally {
        setIsCheckingMembership(false);
      }
    };

    const timeout = setTimeout(checkMembership, 500);
    return () => clearTimeout(timeout);
  }, [localInfo.email]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!localInfo.firstName.trim()) {
      newErrors.firstName = t.firstNameRequired;
    }
    if (!localInfo.lastName.trim()) {
      newErrors.lastName = t.lastNameRequired;
    }
    if (!localInfo.email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!isValidEmail(localInfo.email)) {
      newErrors.email = t.emailInvalid;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onUpdateInfo(localInfo);
      onNext();
    }
  };

  const isFormValid = localInfo.firstName && localInfo.lastName && isValidEmail(localInfo.email);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-stone-900">{t.title}</h3>

      <div className="space-y-2.5">
        {/* First Name */}
        <div>
          <label htmlFor="step3-first-name" className="block text-sm font-medium text-stone-700">
            {t.firstName} <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
            <input
              id="step3-first-name"
              type="text"
              value={localInfo.firstName}
              onChange={(e) => setLocalInfo({ ...localInfo, firstName: e.target.value })}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'step3-first-name-error' : undefined}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
              placeholder={t.firstNamePlaceholder}
            />
          </div>
          {errors.firstName && (
            <p id="step3-first-name-error" className="mt-1 text-xs text-red-600" role="alert">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="step3-last-name" className="block text-sm font-medium text-stone-700">
            {t.lastName} <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
            <input
              id="step3-last-name"
              type="text"
              value={localInfo.lastName}
              onChange={(e) => setLocalInfo({ ...localInfo, lastName: e.target.value })}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'step3-last-name-error' : undefined}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
              placeholder={t.lastNamePlaceholder}
            />
          </div>
          {errors.lastName && (
            <p id="step3-last-name-error" className="mt-1 text-xs text-red-600" role="alert">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="step3-email" className="block text-sm font-medium text-stone-700">
            {t.email} <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
            <input
              id="step3-email"
              type="email"
              value={localInfo.email}
              onChange={(e) => setLocalInfo({ ...localInfo, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'step3-email-error' : undefined}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
              placeholder={t.emailPlaceholder}
            />
          </div>
          {errors.email && (
            <p id="step3-email-error" className="mt-1 text-xs text-red-600" role="alert">{errors.email}</p>
          )}
        </div>

        {/* Membership Status */}
        {localInfo.email && isValidEmail(localInfo.email) && (
          <div className="rounded-lg border border-stone-200 p-3" aria-live="polite">
            {isCheckingMembership ? (
              <div className="flex items-center gap-2 text-stone-600">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span className="text-sm">{t.checkingMembership}</span>
              </div>
            ) : membership?.isMember ? (
              <div className="flex items-start gap-2 text-green-700">
                <Check className="h-5 w-5 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium">{t.membershipRecognized(membership.subscriptionName)}</p>
                  {membership.isUnlimited ? (
                    <p className="text-sm text-green-600">{t.unlimitedUse}</p>
                  ) : membership.remainingUses !== null && membership.remainingUses !== undefined ? (
                    <p className="text-sm text-green-600">
                      {t.visitsRemaining(membership.remainingUses, membership.totalLimit)}
                    </p>
                  ) : (
                    <p className="text-sm text-green-600">{t.memberPrice}</p>
                  )}
                  <p className="mt-1 text-sm text-green-600">{t.membershipCharged}</p>
                  {membership.expiresAt && (
                    <p className="mt-1 text-sm text-green-600">{formatValidUntil(membership.expiresAt)}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-stone-600">
                <X className="h-5 w-5" aria-hidden="true" />
                <p className="text-sm">{t.noMembership}</p>
              </div>
            )}
          </div>
        )}

        {/* Phone */}
        <div>
          <label htmlFor="step3-phone" className="block text-sm font-medium text-stone-700">
            {t.phone}
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
            <input
              id="step3-phone"
              type="tel"
              value={localInfo.phone}
              onChange={(e) => setLocalInfo({ ...localInfo, phone: e.target.value })}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
              placeholder="+358 40 123 4567"
            />
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-2.5 md:col-span-2">
          <input
            id="step3-marketing-consent"
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => onMarketingConsentChange?.(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-lake focus:ring-lake"
          />
          <span className="text-xs leading-relaxed text-stone-600">{t.marketingConsent}</span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {t.back}
        </button>
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className="inline-flex items-center gap-2 rounded-lg bg-lake px-5 py-2.5 text-sm font-medium text-white hover:bg-lake-deep disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {t.continue}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
