import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_API_KEY;
const SUMMER_SERVICE_ID = '3ea1445e-c830-4604-a294-3dbe124446a5';

const TIME_ZONE = 'Europe/Helsinki';

const formatDateInTZ = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);

const formatTimeInTZ = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    hour12: false,
  }).format(d);

type PriceRule = {
  id: string;
  createdAt: string;
  priority: number;
  price: { price: number; comparedPrice?: number };
  duration: string;
  minDuration?: string;
  maxDuration?: string;
  limitation?: {
    dates?: { start: string; end: string }[];
    daysOfWeek?: number;
    times?: { start: string; end: string }[];
    resourceIDs?: string[];
  };
};

type BooklaTimesRequest = {
  from: string;
  to: string;
  spots: number;
  duration?: string;
  resourceIDs?: string[];
};

// Slot shape as returned by Bookla's /times endpoint (fields actually accessed).
type RawTimeSlot = {
  startTime: string;
  duration?: string;
  spotsAvailable?: number;
  resourceId?: string;
  price?: unknown;
};

// Normalized slot shape returned by this route.
type SummerSlot = {
  startTime: string;
  duration: string;
  spotsAvailable: number;
  resourceId: string;
  price: unknown;
};

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  return h * 60 + m;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

function getWeekdayBit(date: Date, tz: string): number {
  const name = getWeekdayName(date, tz);
  // Bookla bitmask: Mon=64, Tue=32, Wed=16, Thu=8, Fri=4, Sat=2, Sun=1
  const map: Record<string, number> = {
    Sun: 1,
    Mon: 64,
    Tue: 32,
    Wed: 16,
    Thu: 8,
    Fri: 4,
    Sat: 2,
  };
  return map[name] || 0;
}

function getWeekdayName(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
  }).format(date);
}

function isDateInRange(dateStr: string, ranges?: { start: string; end: string }[]): boolean {
  if (!ranges || ranges.length === 0) return true;
  const t = new Date(dateStr + 'T00:00:00Z').getTime();
  return ranges.some((r) => {
    const start = new Date(r.start).getTime();
    const end = new Date(r.end).getTime();
    return t >= start && t <= end;
  });
}

function isTimeInRanges(minutes: number, ranges?: { start: string; end: string }[]): boolean {
  if (!ranges || ranges.length === 0) return true;
  return ranges.some((r) => {
    const start = timeToMinutes(r.start);
    const end = timeToMinutes(r.end);
    if (end === 0) {
      // Range wraps past midnight, e.g. 16:00-00:00
      return minutes >= start;
    }
    if (start < end) {
      return minutes >= start && minutes < end;
    }
    // Wrap-around range (e.g. 22:00-06:00)
    return minutes >= start || minutes < end;
  });
}

function ruleMatches(
  rule: PriceRule,
  dateStr: string,
  startMinutes: number,
  durationMinutes: number,
  resourceId?: string
): boolean {
  const lim = rule.limitation || {};
  if (!isDateInRange(dateStr, lim.dates)) return false;
  if (typeof lim.daysOfWeek === 'number') {
    const dayBit = getWeekdayBit(new Date(dateStr + 'T00:00:00'), TIME_ZONE);
    if ((lim.daysOfWeek & dayBit) === 0) return false;
  }
  if (lim.times && lim.times.length > 0) {
    if (!isTimeInRanges(startMinutes, lim.times)) return false;
  }
  if (lim.resourceIDs && lim.resourceIDs.length > 0 && resourceId) {
    if (!lim.resourceIDs.includes(resourceId)) return false;
  }
  const min = rule.minDuration ? parseDuration(rule.minDuration) : 0;
  const max = rule.maxDuration ? parseDuration(rule.maxDuration) : Infinity;
  if (durationMinutes < min || durationMinutes > max) return false;
  return true;
}

function calculateFlexiblePrice(
  startTime: string,
  durationISO: string,
  rules: PriceRule[],
  resourceId?: string
): { amount: number; comparedAmount: number; currency: string } | null {
  const startDate = new Date(startTime);
  const dateStr = formatDateInTZ(startDate, TIME_ZONE);
  const startMinutes = parseInt(formatTimeInTZ(startDate, TIME_ZONE), 10) * 60;
  const durationMinutes = parseDuration(durationISO);
  if (durationMinutes <= 0) return null;

  const matching = rules
    .filter((r) => ruleMatches(r, dateStr, startMinutes, durationMinutes, resourceId))
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (matching.length === 0) return null;

  const rule = matching[0];
  const stepMinutes = parseDuration(rule.duration);
  if (stepMinutes <= 0) return null;
  const steps = durationMinutes / stepMinutes;
  if (!Number.isInteger(steps)) return null;

  return {
    amount: steps * rule.price.price,
    comparedAmount: steps * (rule.price.comparedPrice || 0),
    currency: 'EUR',
  };
}

async function fetchPrices(): Promise<PriceRule[]> {
  const url = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${SUMMER_SERVICE_ID}/prices`;
  const res = await fetchBooklaWithBackoff(url, {
    headers: {
      'X-API-Key': API_KEY!,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bookla prices API error: ${res.status} - ${text}`);
  }
  const data = await res.json();
  return data.rules || [];
}

// Fetch with retry logic and exponential backoff, respecting Retry-After header
async function fetchBooklaWithBackoff(url: string, init: RequestInit, attempt = 0): Promise<Response> {
  const res = await fetch(url, init);

  if (res.status === 429 && attempt < 3) {
    const retryAfter = res.headers.get('retry-after');
    const delay = retryAfter ? Number(retryAfter) * 1000 : 500 * 2 ** attempt;
    console.log(`[SUMMER-TIMES] Rate limited, retrying after ${delay}ms (attempt ${attempt + 1})`);
    await new Promise((r) => setTimeout(r, delay));
    return fetchBooklaWithBackoff(url, init, attempt + 1);
  }

  return res;
}

async function fetchTimes(requestBody: BooklaTimesRequest) {
  const timesUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${SUMMER_SERVICE_ID}/times`;
  const response = await fetchBooklaWithBackoff(timesUrl, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (response.status === 429) {
    throw new Error('rate_limited');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bookla times API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !API_KEY) {
    return NextResponse.json({ error: 'Missing Bookla configuration' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { date, from, to, duration, resourceId } = body;
    const isRangeMode = from && to;

    if (!date && !isRangeMode) {
      return NextResponse.json({ error: 'date or from/to range is required' }, { status: 400 });
    }

    const durationISO = duration || 'PT2H';
    let fromDate: Date;
    let toDate: Date;
    let targetDate: string | null = null;

    if (isRangeMode) {
      console.log('[SUMMER-TIMES] Fetching times for range:', from, 'to', to, 'duration:', durationISO, 'resource:', resourceId);
      fromDate = new Date(from + 'T00:00:00Z');
      toDate = new Date(to + 'T23:59:59Z');
    } else {
      console.log('[SUMMER-TIMES] Fetching times for date:', date, 'duration:', durationISO, 'resource:', resourceId);
      targetDate = date;
      const dateObj = new Date(date + 'T00:00:00Z');
      fromDate = new Date(dateObj);
      fromDate.setDate(fromDate.getDate() - 1);
      fromDate.setUTCHours(20, 0, 0, 0);
      toDate = new Date(dateObj);
      toDate.setDate(toDate.getDate() + 1);
      toDate.setUTCHours(4, 0, 0, 0);
    }

    const baseRequest = {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      spots: 1,
    };

    let rawTimes: Record<string, RawTimeSlot[]> = {};
    let useFallback = false;

    try {
      const requestBody = { ...baseRequest, duration: durationISO, ...(resourceId ? { resourceIDs: [resourceId] } : {}) };
      const data = await fetchTimes(requestBody);
      rawTimes = data.times || {};
      const hasTimes = Object.values(rawTimes).some((arr) => arr.length > 0);
      if (!hasTimes) {
        console.log('[SUMMER-TIMES] No priced slots returned; falling back to flexible start times');
        useFallback = true;
      }
    } catch (err) {
      console.log('[SUMMER-TIMES] Priced times request failed:', err instanceof Error ? err.message : err);
      useFallback = true;
    }

    if (useFallback) {
      const requestBody = { ...baseRequest, ...(resourceId ? { resourceIDs: [resourceId] } : {}) };
      const data = await fetchTimes(requestBody);
      rawTimes = data.times || {};
      const rules = await fetchPrices();
      const durationMinutes = parseDuration(durationISO);
      const defaultHourlyCents = 17500;

      const pricedTimes: Record<string, SummerSlot[]> = {};
      for (const resId of Object.keys(rawTimes)) {
        if (resourceId && resId !== resourceId) continue;
        pricedTimes[resId] = [];
        for (const slot of rawTimes[resId]) {
          let price = calculateFlexiblePrice(slot.startTime, durationISO, rules, resId);
          if (!price) {
            // Bookla price rules may be temporarily incomplete; use fallback pricing.
            // Weekday (Mon-Thu) bookings are 100 €/h, weekends (Fri-Sun) 175 €/h.
            const hours = durationMinutes / 60;
            const dayName = getWeekdayName(new Date(slot.startTime), TIME_ZONE);
            const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu'].includes(dayName);
            if (Number.isInteger(hours)) {
              price = {
                amount: hours * (isWeekday ? 10000 : defaultHourlyCents),
                comparedAmount: 0,
                currency: 'EUR',
              };
            }
          }
          if (!price) continue;
          pricedTimes[resId].push({
            startTime: slot.startTime,
            duration: durationISO,
            spotsAvailable: slot.spotsAvailable ?? 1,
            resourceId: resId,
            price,
          });
        }
      }
      rawTimes = pricedTimes;
    }

    const slotsByDate: Record<string, SummerSlot[]> = {};
    for (const resId of Object.keys(rawTimes)) {
      if (resourceId && resId !== resourceId) continue;
      const resourceTimes = rawTimes[resId] || [];
      for (const slot of resourceTimes) {
        const slotDate = formatDateInTZ(new Date(slot.startTime), TIME_ZONE);
        if (targetDate && slotDate !== targetDate) continue;

        // Keep slots within sensible daily hours (08:00–21:00 Helsinki) to avoid
        // midnight carry-over slots from the multi-day request window.
        const startHour = parseInt(formatTimeInTZ(new Date(slot.startTime), TIME_ZONE), 10);
        if (startHour < 8 || startHour > 21) continue;

        // Hard-coded pricing tiers while Bookla rules are being aligned:
        // Mon–Thu daytime (08–16) = 100 €/h, Mon–Thu evening (16–21) = 125 €/h,
        // Fri–Sat = 175 €/h, Sun is left untouched (Bookla's own price).
        const startDayName = getWeekdayName(new Date(slot.startTime), TIME_ZONE);
        const slotDurationHours = parseDuration(slot.duration || durationISO) / 60;
        let displayPrice = slot.price || null;
        if (['Mon', 'Tue', 'Wed', 'Thu'].includes(startDayName)) {
          const hourlyCents = startHour < 16 ? 10000 : 12500;
          displayPrice = { amount: Math.round(slotDurationHours * hourlyCents), comparedAmount: 0, currency: 'EUR' };
        } else if (['Fri', 'Sat'].includes(startDayName)) {
          displayPrice = { amount: Math.round(slotDurationHours * 17500), comparedAmount: 0, currency: 'EUR' };
        }

        if (!slotsByDate[slotDate]) slotsByDate[slotDate] = [];
        slotsByDate[slotDate].push({
          startTime: slot.startTime,
          duration: slot.duration || durationISO,
          spotsAvailable: slot.spotsAvailable ?? 1,
          resourceId: resId,
          price: displayPrice,
        });
      }
    }

    for (const dateKey of Object.keys(slotsByDate)) {
      slotsByDate[dateKey].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }

    if (isRangeMode) {
      console.log(`[SUMMER-TIMES] Returning slots for ${Object.keys(slotsByDate).length} dates`);
      return NextResponse.json({
        slotsByDate,
        timeZone: TIME_ZONE,
        from,
        to,
        duration: durationISO,
      });
    } else {
      const slots = targetDate ? slotsByDate[targetDate] || [] : [];
      console.log(`[SUMMER-TIMES] Returning ${slots.length} slots for date ${targetDate}`);
      return NextResponse.json({
        slots,
        timeZone: TIME_ZONE,
        date: targetDate,
        duration: durationISO,
      });
    }
  } catch (error) {
    console.error('[SUMMER-TIMES] Error:', error);

    if (error instanceof Error && error.message === 'rate_limited') {
      return NextResponse.json(
        { error: 'rate_limited', message: 'Too many requests to booking backend, try again in a moment.', slots: [] },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: 'Failed to fetch times', slots: [] }, { status: 500 });
  }
}
