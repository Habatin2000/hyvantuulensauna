'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { User, Mail, Phone, ChevronLeft, ChevronRight, Check, X, Loader2, AlertCircle } from 'lucide-react';

interface MembershipInfo {
  isMember: boolean;
  code?: string;
  subscriptionId?: string;
  subscriptionName?: string;
  remainingUses?: number | null;
  totalLimit?: number | null;
  usedCount?: number | null;
  isUnlimited?: boolean;
  canUseSubscription?: boolean;
  expiresAt?: string | null;
}

interface MembershipCacheEntry {
  email: string;
  data: MembershipInfo;
  timestamp: number;
}

const CACHE_TTL_MS = 60_000; // 60 seconds

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
}

export default function Step3PersonalInfo({
  customerInfo,
  onUpdateInfo,
  onMembershipCheck,
  onNext,
  onBack,
}: Step3PersonalInfoProps) {
  const [localInfo, setLocalInfo] = useState(customerInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);
  const [membershipError, setMembershipError] = useState<string | null>(null);

  const cacheRef = useRef<MembershipCacheEntry | null>(null);

  const getCached = useCallback((email: string): MembershipInfo | null => {
    const cached = cacheRef.current;
    if (cached && cached.email === email && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    return null;
  }, []);

  const setCached = useCallback((email: string, data: MembershipInfo) => {
    cacheRef.current = { email, data, timestamp: Date.now() };
  }, []);

  // Check membership when email changes
  useEffect(() => {
    const checkMembership = async () => {
      if (!localInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localInfo.email)) {
        setMembership(null);
        setMembershipError(null);
        onMembershipCheck(null);
        return;
      }

      const normalizedEmail = localInfo.email.trim().toLowerCase();

      // Check cache first
      const cached = getCached(normalizedEmail);
      if (cached) {
        setMembership(cached);
        setMembershipError(null);
        onMembershipCheck(cached);
        return;
      }

      setIsCheckingMembership(true);
      setMembershipError(null);
      try {
        const res = await fetch('/api/bookla/membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const message = errorData.error || 'Kanta-asiakkuuden tarkistus epäonnistui';
          setMembershipError(message);
          setMembership(null);
          onMembershipCheck(null);
          return;
        }

        const data: MembershipInfo = await res.json();
        setMembership(data);
        setMembershipError(null);
        onMembershipCheck(data);
        setCached(normalizedEmail, data);
      } catch (e) {
        console.error('Membership check failed:', e);
        setMembershipError('Yhteysvirhe kanta-asiakkuuden tarkistuksessa. Yritä uudelleen.');
        setMembership(null);
        onMembershipCheck(null);
      } finally {
        setIsCheckingMembership(false);
      }
    };

    const timeout = setTimeout(checkMembership, 500);
    return () => clearTimeout(timeout);
  }, [localInfo.email, onMembershipCheck, getCached, setCached]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!localInfo.firstName.trim()) {
      newErrors.firstName = 'Etunimi on pakollinen';
    }
    if (!localInfo.lastName.trim()) {
      newErrors.lastName = 'Sukunimi on pakollinen';
    }
    if (!localInfo.email.trim()) {
      newErrors.email = 'Sähköposti on pakollinen';
    } else if (!isValidEmail(localInfo.email)) {
      newErrors.email = 'Tarkista sähköpostiosoite';
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-stone-900">Täytä yhteystiedot</h3>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Etunimi <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={localInfo.firstName}
              onChange={(e) => setLocalInfo({ ...localInfo, firstName: e.target.value })}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder="Matti"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Sukunimi <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={localInfo.lastName}
              onChange={(e) => setLocalInfo({ ...localInfo, lastName: e.target.value })}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder="Meikäläinen"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Sähköposti <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="email"
              value={localInfo.email}
              onChange={(e) => setLocalInfo({ ...localInfo, email: e.target.value })}
              className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-4 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              placeholder="matti@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Membership Status */}
        {localInfo.email && isValidEmail(localInfo.email) && (
          <div className="rounded-lg border border-stone-200 p-3">
            {isCheckingMembership ? (
              <div className="flex items-center gap-2 text-stone-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Tarkistetaan kanta-asiakkuutta...</span>
              </div>
            ) : membershipError ? (
              <div className="flex items-start gap-2 text-red-700">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Tarkistus epäonnistui</p>
                  <p className="text-sm text-red-600">{membershipError}</p>
                </div>
              </div>
            ) : membership?.isMember ? (
              <div className="flex items-start gap-2 text-green-700">
                <Check className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">{membership.subscriptionName || 'Kanta-asiakkuus'} tunnistettu!</p>
                  {membership.isUnlimited ? (
                    <p className="text-sm text-green-600">Rajaton käyttöoikeus</p>
                  ) : membership.remainingUses !== null && membership.remainingUses !== undefined ? (
                    <p className="text-sm text-green-600">
                      {membership.remainingUses} käyntiä jäljellä
                      {membership.totalLimit ? ` (yht. ${membership.totalLimit})` : ''}
                    </p>
                  ) : (
                    <p className="text-sm text-green-600">Saat jäsenhinnan varaukseesi.</p>
                  )}
                  {membership.canUseSubscription === false && (
                    <p className="text-sm text-amber-600 mt-1">
                      Huom: jäsenyys ei ole tällä hetkellä käytettävissä.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-stone-600">
                <X className="h-5 w-5" />
                <p className="text-sm">Ei aktiivista kanta-asiakkuutta</p>
              </div>
            )}
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Puhelinnumero
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
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
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Takaisin
        </button>
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          Jatka
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
