'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { CalendarDays } from 'lucide-react';

const AALTO_RESOURCE_ID = '3dd71bee-f303-463e-ad78-e05b4faa2234';
const VIRTA_RESOURCE_ID = '3bffeff6-4ef4-4865-a99b-370b956e355e';

const TIME_ZONE = 'Europe/Helsinki';

function formatHelsinki(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return formatHelsinki(d);
}

// Monday-first weekday labels
const WEEKDAYS_FI = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const WEEKS = 6;

export default function PrivateSaunaSneakPeek() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const weekdays = isEn ? WEEKDAYS_EN : WEEKDAYS_FI;

  const today = useMemo(() => formatHelsinki(new Date()), []);

  const [aaltoDates, setAaltoDates] = useState<string[]>([]);
  const [virtaDates, setVirtaDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchDates(resourceId: string): Promise<string[]> {
      const res = await fetch('/api/bookla/winter/dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId }),
      });
      if (!res.ok) throw new Error(`winter/dates ${res.status}`);
      const data = await res.json();
      return Array.isArray(data.dates) ? data.dates : [];
    }

    Promise.all([fetchDates(AALTO_RESOURCE_ID), fetchDates(VIRTA_RESOURCE_ID)])
      .then(([a, v]) => {
        if (cancelled) return;
        setAaltoDates(a);
        setVirtaDates(v);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const aaltoSet = useMemo(() => new Set(aaltoDates), [aaltoDates]);
  const virtaSet = useMemo(() => new Set(virtaDates), [virtaDates]);

  // 6-week grid starting from the Monday of the current week
  const days = useMemo(() => {
    const mondayOffset = (new Date(`${today}T12:00:00`).getDay() + 6) % 7;
    const monday = addDaysIso(today, -mondayOffset);
    return Array.from({ length: WEEKS * 7 }, (_, i) => addDaysIso(monday, i));
  }, [today]);

  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const rangeLabel = `${Number(firstDay.slice(8, 10))}.${Number(firstDay.slice(5, 7))}.–${Number(lastDay.slice(8, 10))}.${Number(lastDay.slice(5, 7))}.`;

  if (failed) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
        {isEn
          ? 'Availability preview is temporarily unavailable — please use the booking calendar.'
          : 'Saatavuuden esikatselu ei tilapäisesti toimi — käytä varauskalenteria.'}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-lake" aria-hidden="true" />
          <div>
            <h3 className="font-display text-xl font-bold text-stone-900 md:text-2xl">
              {isEn ? 'Next available weeks' : 'Seuraavat vapaat viikot'}
            </h3>
            <p className="text-sm text-stone-500">
              {isEn
                ? `Private sauna availability ${rangeLabel}`
                : `Yksityissaunojen saatavuus ${rangeLabel}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-stone-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-lake" aria-hidden="true" />
            Aalto
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ember" aria-hidden="true" />
            Virta
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
          {days.map((iso) => (
            <div key={iso} className="h-11 animate-pulse rounded-lg bg-stone-100 md:h-12" />
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-1.5 grid grid-cols-7 gap-1.5">
            {weekdays.map((d) => (
              <div key={d} className="py-1 text-center text-xs font-semibold uppercase tracking-wide text-stone-400">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((iso) => {
              const isPast = iso < today;
              const aaltoFree = aaltoSet.has(iso);
              const virtaFree = virtaSet.has(iso);
              const free = aaltoFree || virtaFree;
              const isToday = iso === today;

              const title = isPast
                ? undefined
                : aaltoFree && virtaFree
                  ? isEn
                    ? 'Aalto and Virta available'
                    : 'Aalto ja Virta vapaana'
                  : aaltoFree
                    ? isEn
                      ? 'Aalto available'
                      : 'Aalto vapaa'
                    : virtaFree
                      ? isEn
                        ? 'Virta available'
                        : 'Virta vapaa'
                      : undefined;

              return (
                <div
                  key={iso}
                  title={title}
                  className={`flex h-11 flex-col items-center justify-center rounded-lg text-xs md:h-12 ${
                    isPast
                      ? 'text-stone-300'
                      : free
                        ? 'bg-stone-100 font-semibold text-stone-900'
                        : 'text-stone-400'
                  } ${isToday ? 'ring-2 ring-lake' : ''}`}
                >
                  <span>{Number(iso.slice(8, 10))}</span>
                  {!isPast && (
                    <span className="mt-0.5 flex h-1.5 items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${aaltoFree ? 'bg-lake' : 'bg-transparent'}`} />
                      <span className={`h-1.5 w-1.5 rounded-full ${virtaFree ? 'bg-ember' : 'bg-transparent'}`} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-stone-400">
        {isEn
          ? 'The calendar shows days with at least one free two-hour slot. Book via the buttons on the sauna cards above.'
          : 'Kalenteri näyttää päivät, jolloin on vapaana vähintään yksi kahden tunnin vuoro. Varaa ylempänä olevien saunakorttien painikkeista.'}
      </p>
    </div>
  );
}
