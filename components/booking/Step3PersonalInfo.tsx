'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, ChevronLeft, ChevronRight, Check, X, Loader2 } from 'lucide-react';

interface MembershipInfo {
  isMember: boolean;
  // code is no longer returned by the API — it is entered manually by the
  // user (from their purchase confirmation email) and passed up from here.
  code?: string;
  subscriptionId?: string;
  subscriptionName?: string;
  remainingUses?: number | null;
  totalLimit?: number | null;
  usedCount?: number | null;
  isUnlimited?: boolean;
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
  locale?: 'fi' | 'en';
}

export default function Step3PersonalInfo({
  customerInfo,
  onUpdateInfo,
  onMembershipCheck,
  onNext,
  onBack,
  locale = 'fi',
}: Step3PersonalInfoProps) {
  const isEn = locale === 'en';
  const t = {
    title: isEn ? 'Fill in your contact details' : 'Täytä yhteystiedot',
    firstName: isEn ? 'First name' : 'Etunimi',
    lastName: isEn ? 'Last name' : 'Sukunimi',
    email: isEn ? 'Email' : 'Sähköposti',
    phone: isEn ? 'Phone number' : 'Puhelinnumero',
    firstNamePlaceholder: isEn ? 'John' : 'Matti',
    lastNamePlaceholder: isEn ? 'Doe' : 'Meikäläinen',
    emailPlaceholder: isEn ? 'john@example.com' : 'matti@example.com',
    firstNameRequired: isEn ? 'First name is required' : 'Etunimi on pakollinen',
    lastNameRequired: isEn ? 'Last name is required' : 'Sukunimi on pakollinen',
    emailRequired: isEn ? 'Email is required' : 'Sähköposti on pakollinen',
    emailInvalid: isEn ? 'Check the email address' : 'Tarkista sähköpostiosoite',
    checkingMembership: isEn ? 'Checking membership...' : 'Tarkistetaan kanta-asiakkuutta...',
    membershipRecognized: isEn ? 'recognized!' : 'tunnistettu!',
    membershipFallback: isEn ? 'Membership' : 'Kanta-asiakkuus',
    unlimitedUse: isEn ? 'Unlimited usage' : 'Rajaton käyttöoikeus',
    visitsRemaining: (remaining: number, total?: number | null) =>
      isEn
        ? `${remaining} visits remaining${total ? ` (total ${total})` : ''}`
        : `${remaining} käyntiä jäljellä${total ? ` (yht. ${total})` : ''}`,
    memberPrice: isEn ? 'You get the member price for your booking.' : 'Saat jäsenhinnan varaukseesi.',
    membershipCode: isEn ? 'Membership code' : 'Kanta-asiakkuuskoodi',
    membershipCodePlaceholder: isEn ? 'Enter your membership code' : 'Syötä jäsenkoodisi',
    membershipCodeHelp: isEn
      ? 'You can find the code in your membership purchase confirmation email. Without the code, the booking is charged at the normal price.'
      : 'Löydät koodin kanta-asiakkuuden ostovahvistussähköpostistasi. Ilman koodia varaus veloitetaan normaalihintaan.',
    noMembership: isEn ? 'No active membership' : 'Ei aktiivista kanta-asiakkuutta',
    back: isEn ? 'Back' : 'Takaisin',
    continue: isEn ? 'Continue' : 'Jatka',
  };

  const [localInfo, setLocalInfo] = useState(customerInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [membershipCode, setMembershipCode] = useState('');
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);

  // Check membership when email changes
  useEffect(() => {
    const checkMembership = async () => {
      if (!localInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localInfo.email)) {
        setMembership(null);
        setMembershipCode('');
        onMembershipCheck(null);
        return;
      }

      setIsCheckingMembership(true);
      setMembershipCode('');
      try {
        const res = await fetch('/api/bookla/membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: localInfo.email }),
        });

        if (res.ok) {
          const data = await res.json();
          setMembership(data);
          onMembershipCheck(data);
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

  // Pass the manually entered membership code up with the membership info.
  // The API only tells us a membership exists — the code itself comes from
  // the user's purchase confirmation email and is validated server-side.
  useEffect(() => {
    if (membership?.isMember) {
      onMembershipCheck({ ...membership, code: membershipCode.trim() || undefined });
    }
  }, [membershipCode, membership]);

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
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="step3-first-name"
              type="text"
              value={localInfo.firstName}
              onChange={(e) => setLocalInfo({ ...localInfo, firstName: e.target.value })}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'step3-first-name-error' : undefined}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder={t.firstNamePlaceholder}
            />
          </div>
          {errors.firstName && (
            <p id="step3-first-name-error" className="mt-1 text-xs text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="step3-last-name" className="block text-sm font-medium text-stone-700">
            {t.lastName} <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="step3-last-name"
              type="text"
              value={localInfo.lastName}
              onChange={(e) => setLocalInfo({ ...localInfo, lastName: e.target.value })}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'step3-last-name-error' : undefined}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder={t.lastNamePlaceholder}
            />
          </div>
          {errors.lastName && (
            <p id="step3-last-name-error" className="mt-1 text-xs text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="step3-email" className="block text-sm font-medium text-stone-700">
            {t.email} <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="step3-email"
              type="email"
              value={localInfo.email}
              onChange={(e) => setLocalInfo({ ...localInfo, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'step3-email-error' : undefined}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder={t.emailPlaceholder}
            />
          </div>
          {errors.email && (
            <p id="step3-email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Membership Status */}
        {localInfo.email && isValidEmail(localInfo.email) && (
          <div className="rounded-lg border border-stone-200 p-3">
            {isCheckingMembership ? (
              <div className="flex items-center gap-2 text-stone-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{t.checkingMembership}</span>
              </div>
            ) : membership?.isMember ? (
              <div className="flex items-start gap-2 text-green-700">
                <Check className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{membership.subscriptionName || t.membershipFallback} {t.membershipRecognized}</p>
                  {membership.isUnlimited ? (
                    <p className="text-sm text-green-600">{t.unlimitedUse}</p>
                  ) : membership.remainingUses !== null && membership.remainingUses !== undefined ? (
                    <p className="text-sm text-green-600">
                      {t.visitsRemaining(membership.remainingUses, membership.totalLimit)}
                    </p>
                  ) : (
                    <p className="text-sm text-green-600">{t.memberPrice}</p>
                  )}
                  <div className="mt-2">
                    <label htmlFor="step3-membership-code" className="block text-sm font-medium text-green-800">
                      {t.membershipCode}
                    </label>
                    <input
                      id="step3-membership-code"
                      type="text"
                      value={membershipCode}
                      onChange={(e) => setMembershipCode(e.target.value)}
                      autoComplete="off"
                      className="mt-1 w-full rounded-lg border border-green-300 bg-white py-2 px-3 text-sm text-stone-900 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                      placeholder={t.membershipCodePlaceholder}
                    />
                    <p className="mt-1 text-xs text-green-600">
                      {t.membershipCodeHelp}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-stone-600">
                <X className="h-5 w-5" />
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
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="step3-phone"
              type="tel"
              value={localInfo.phone}
              onChange={(e) => setLocalInfo({ ...localInfo, phone: e.target.value })}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder="+358 40 123 4567"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t.back}
        </button>
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {t.continue}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
