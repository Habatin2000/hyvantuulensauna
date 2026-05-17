'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3, Megaphone } from 'lucide-react';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CONSENT_KEY = 'cookie-consent';

function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent('consent-updated', { detail: consent }));
}

export function getConsent(): ConsentState {
  if (typeof window === 'undefined') {
    return { necessary: true, analytics: false, marketing: false, timestamp: 0 };
  }
  const stored = getStoredConsent();
  if (stored) return stored;
  return { necessary: true, analytics: false, marketing: false, timestamp: 0 };
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    } else {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    }
  }, []);

  const acceptAll = () => {
    const consent: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    saveConsent(consent);
    setVisible(false);
  };

  const acceptSelected = () => {
    const consent: ConsentState = {
      necessary: true,
      analytics,
      marketing,
      timestamp: Date.now(),
    };
    saveConsent(consent);
    setVisible(false);
  };

  const declineAll = () => {
    const consent: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    saveConsent(consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10">
            <Cookie className="h-5 w-5 text-[#3b82f6]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-stone-900">
              Evästeiden käyttö
            </h3>
            <p className="mt-1 text-sm text-stone-600 leading-relaxed">
              Käytämme evästeitä sivuston toimintaan, analytiikkaan ja mainontaan.
              Voit hallita evästeasetuksiasi alla. Lue lisää{' '}
              <a href="/tietosuojaseloste" className="text-[#3b82f6] hover:underline">
                tietosuojaselosteestamme
              </a>.
            </p>
          </div>
          <button
            onClick={declineAll}
            className="shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            aria-label="Sulje"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Expanded categories */}
        {expanded && (
          <div className="border-t border-stone-100 px-5 pb-4 sm:px-6">
            <div className="space-y-3 pt-4">
              {/* Necessary */}
              <div className="flex items-center justify-between rounded-lg bg-stone-50 p-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-stone-500" />
                  <div>
                    <p className="text-sm font-medium text-stone-900">Välttämättömät</p>
                    <p className="text-xs text-stone-500">Sivuston toiminnalle pakolliset</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-stone-400">Aina päällä</span>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between rounded-lg border border-stone-100 p-3">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-[#3b82f6]" />
                  <div>
                    <p className="text-sm font-medium text-stone-900">Analytiikka</p>
                    <p className="text-xs text-stone-500">Google Analytics -kävijäseuranta</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-stone-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#3b82f6] peer-checked:after:translate-x-4" />
                </label>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between rounded-lg border border-stone-100 p-3">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-4 w-4 text-[#3b82f6]" />
                  <div>
                    <p className="text-sm font-medium text-stone-900">Mainonta</p>
                    <p className="text-xs text-stone-500">Google Ads ja Meta Pixel -konversioseuranta</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-stone-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#3b82f6] peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 p-4 sm:px-6">
          <button
            onClick={acceptAll}
            className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
          >
            Hyväksy kaikki
          </button>
          <button
            onClick={() => {
              if (!expanded) {
                setExpanded(true);
              } else {
                acceptSelected();
              }
            }}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            {expanded ? 'Tallenna valinnat' : 'Valitse evästeet'}
          </button>
          <button
            onClick={declineAll}
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-700"
          >
            Hylkää valinnaiset
          </button>
        </div>
      </div>
    </div>
  );
}
