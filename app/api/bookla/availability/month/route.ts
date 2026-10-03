import { NextRequest, NextResponse } from 'next/server';
import { booklaFetch, getBooklaConfig } from '../../lib/bookla-fetch';

const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const RESOURCE_ID = process.env.BOOKLA_PUBLIC_RESOURCE_ID;

const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=30, s-maxage=60' };

const TIME_ZONE = 'Europe/Helsinki';

// Public ticket ID (adult) for availability checks
const PUBLIC_TICKET_ID = '74ef0b6e-c3d2-4da2-aecc-cd8d0b1a09ee';

// Format date to YYYY-MM-DD in Helsinki timezone
const formatDateInHelsinki = (d: Date): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

const hourInHelsinki = (d: Date): number =>
  parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      hour: 'numeric',
      hour12: false,
    }).format(d),
    10
  );

interface TimeSlot {
  startTime: string;
  endTime: string;
  startHour: number;
  endHour: number;
  spotsAvailable: number;
  resourceId: string;
}

interface ScheduledSlot {
  id: string;
  resourceID: string;
  startTime: string;
  duration?: string;
  rrule?: string;
}

// Bookla's /times endpoint returns only AVAILABLE slots — sold-out sessions
// are omitted entirely. The /slots endpoint returns the full schedule. The
// difference between the two is the sold-out set, which the calendar uses to
// show urgency ("Loppuunmyyty") styling on days/slots that can't be booked.

async function fetchScheduledSlots(): Promise<ScheduledSlot[]> {
  const { companyId, apiKey } = getBooklaConfig({ preferBookingKey: true });
  if (!companyId || !SERVICE_ID || !apiKey) return [];
  try {
    const response = await booklaFetch(
      `/companies/${companyId}/services/${SERVICE_ID}/slots`,
      {},
      apiKey
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.slots || [];
  } catch (e) {
    console.warn('Failed to fetch scheduled slots:', e);
    return [];
  }
}

const parseRruleDate = (raw: string): number | null => {
  const m = raw.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/);
  if (!m) return null;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
};

// Expand a scheduled slot into occurrence instants within [fromMs, toMs].
// One-off slots return at most themselves. Recurring slots are expanded with a
// minimal WEEKLY parser (single BYDAY, UNTIL, EXDATE) — covers the public
// sauna's Sunday schedule. Multi-BYDAY rules are not expanded.
function expandSlotOccurrences(slot: ScheduledSlot, fromMs: number, toMs: number): Date[] {
  const first = new Date(slot.startTime);
  if (!slot.rrule) {
    return first.getTime() >= fromMs && first.getTime() <= toMs ? [first] : [];
  }

  const untilRaw = slot.rrule.match(/UNTIL=(\d{8}T\d{6}Z)/);
  const untilMs = untilRaw ? parseRruleDate(untilRaw[1]) : null;
  const exdates = new Set(
    Array.from(slot.rrule.matchAll(/EXDATE:(\S+)/g))
      .flatMap((m) => m[1].split(','))
      .map((d) => parseRruleDate(d))
      .filter((t): t is number => t !== null)
  );

  const occurrences: Date[] = [];
  const current = new Date(first);
  const hardEnd = Math.min(untilMs ?? first.getTime(), toMs);
  while (current.getTime() <= hardEnd) {
    if (current.getTime() >= fromMs && !exdates.has(current.getTime())) {
      occurrences.push(new Date(current));
    }
    current.setUTCDate(current.getUTCDate() + 7);
  }
  return occurrences;
}

// Fetch Bookla slots for a single Helsinki date.
// Bookla's /times endpoint returns 409 for dates outside the service's
// booking window, so we fetch one day at a time and swallow errors per day.
async function fetchDaySlots(year: number, month: number, day: number): Promise<TimeSlot[]> {
  const { companyId, apiKey } = getBooklaConfig({ preferBookingKey: true });
  if (!companyId || !SERVICE_ID || !apiKey) return [];

  // Window: previous day 22:00 UTC -> requested day 22:00 UTC captures all
  // Helsinki slots for the requested date.
  const from = new Date(Date.UTC(year, month - 1, day - 1, 22, 0, 0));
  const to = new Date(Date.UTC(year, month - 1, day, 22, 0, 0));
  const targetDate = formatDateInHelsinki(new Date(Date.UTC(year, month - 1, day)));

  try {
    const response = await booklaFetch(
      `/companies/${companyId}/services/${SERVICE_ID}/times`,
      {
        method: 'POST',
        body: JSON.stringify({
          from: from.toISOString(),
          to: to.toISOString(),
          tickets: { [PUBLIC_TICKET_ID]: 1 },
        }),
      },
      apiKey
    );

    if (!response.ok) {
      // Dates outside the booking window may return 409; treat as no slots.
      console.warn(`Bookla day ${targetDate} returned ${response.status}`);
      return [];
    }

    const data = await response.json();
    const times = data.times || {};

    const rawSlots: Array<{
      startTime: string;
      spotsAvailable: number;
      resourceId: string;
    }> = [];

    for (const resId of Object.keys(times)) {
      if (RESOURCE_ID && resId !== RESOURCE_ID) continue;

      const resourceTimes = times[resId] || [];
      for (const slot of resourceTimes) {
        if (slot.duration === 'PT2H') {
          rawSlots.push({
            startTime: slot.startTime,
            spotsAvailable: slot.spotsAvailable ?? 17,
            resourceId: resId,
          });
        }
      }
    }

    // Keep only slots that actually belong to the requested Helsinki date
    // and pick the best availability per start hour.
    const bestByHour = new Map<number, TimeSlot>();
    for (const slot of rawSlots) {
      const slotDate = new Date(slot.startTime);
      const slotLocalDate = formatDateInHelsinki(slotDate);
      if (slotLocalDate !== targetDate) continue;

      const hour = hourInHelsinki(slotDate);

      const existing = bestByHour.get(hour);
      if (!existing || slot.spotsAvailable > existing.spotsAvailable) {
        const endDate = new Date(slotDate.getTime() + 2 * 60 * 60 * 1000);
        bestByHour.set(hour, {
          startTime: slot.startTime,
          endTime: endDate.toISOString(),
          startHour: hour,
          endHour: hour + 2,
          spotsAvailable: slot.spotsAvailable,
          resourceId: slot.resourceId,
        });
      }
    }

    return Array.from(bestByHour.values()).sort((a, b) => a.startHour - b.startHour);
  } catch (error) {
    console.warn(`Error fetching Bookla day ${targetDate}:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { companyId, apiKey } = getBooklaConfig({ preferBookingKey: true });
  if (!companyId || !SERVICE_ID || !apiKey) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || '');
    const month = parseInt(searchParams.get('month') || '');

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Year and month parameters required' },
        { status: 400 }
      );
    }

    const daysInMonth = new Date(year, month, 0).getDate();

    console.log(`Fetching month ${year}-${month}: ${daysInMonth} days`);

    // Fetch each day in parallel. Bookla may reject individual dates that are
    // outside the booking window, but the rest will still succeed.
    const dayPromises = Array.from({ length: daysInMonth }, (_, i) =>
      fetchDaySlots(year, month, i + 1)
    );

    // Fetch the full schedule in parallel with availability. Sold-out slots
    // are the difference between schedule and availability.
    const [daySlotsArray, scheduledSlots] = await Promise.all([
      Promise.all(dayPromises),
      fetchScheduledSlots(),
    ]);

    // Group scheduled occurrences per Helsinki date within this month
    const nowMs = Date.now();
    const monthStart = Date.UTC(year, month - 1, 1);
    const monthEnd = Date.UTC(year, month, 0, 23, 59, 59);
    // Normalize to seconds: Bookla returns startTime without milliseconds,
    // Date#toISOString always includes them — string comparison would miss.
    const toSecondsISO = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');
    const scheduledByDate = new Map<string, Array<{ startTime: string; hour: number }>>();
    for (const slot of scheduledSlots) {
      if (RESOURCE_ID && slot.resourceID !== RESOURCE_ID) continue;
      for (const occ of expandSlotOccurrences(slot, monthStart, monthEnd)) {
        if (occ.getTime() < nowMs) continue; // past slots are not "sold out"
        const dateKey = formatDateInHelsinki(occ);
        if (!scheduledByDate.has(dateKey)) scheduledByDate.set(dateKey, []);
        scheduledByDate.get(dateKey)!.push({
          startTime: toSecondsISO(occ),
          hour: hourInHelsinki(occ),
        });
      }
    }

    const dates: Record<string, { hasSlots: boolean; slots: TimeSlot[] }> = {};
    const soldOutDates: string[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const availableSlots = daySlotsArray[day - 1];
      const dateKey = formatDateInHelsinki(new Date(Date.UTC(year, month - 1, day)));
      const scheduled = scheduledByDate.get(dateKey) || [];

      // Merge: available slots + scheduled slots with no availability left
      const availableStartTimes = new Set(availableSlots.map((s) => s.startTime));
      const mergedSlots: TimeSlot[] = [...availableSlots];
      for (const sched of scheduled) {
        if (availableStartTimes.has(sched.startTime)) continue;
        mergedSlots.push({
          startTime: sched.startTime,
          endTime: new Date(new Date(sched.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString(),
          startHour: sched.hour,
          endHour: sched.hour + 2,
          spotsAvailable: 0,
          resourceId: RESOURCE_ID || '',
        });
      }

      if (mergedSlots.length === 0) continue;
      mergedSlots.sort((a, b) => a.startHour - b.startHour);

      const hasSlots = mergedSlots.some((s) => s.spotsAvailable > 0);
      dates[dateKey] = { hasSlots, slots: mergedSlots };
      if (!hasSlots) soldOutDates.push(dateKey);
    }

    console.log(`Month ${year}-${month}: ${Object.keys(dates).length} dates with slots, ${soldOutDates.length} sold out`);

    return NextResponse.json(
      {
        year,
        month,
        dates,
        soldOutDates,
      },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error fetching month availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch month availability' },
      { status: 500 }
    );
  }
}
