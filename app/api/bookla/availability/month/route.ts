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

interface TimeSlot {
  startTime: string;
  endTime: string;
  startHour: number;
  endHour: number;
  spotsAvailable: number;
  resourceId: string;
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

      const hour = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: TIME_ZONE,
          hour: 'numeric',
          hour12: false,
        }).format(slotDate),
        10
      );

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
    const daySlotsArray = await Promise.all(dayPromises);

    const dates: Record<string, { hasSlots: boolean; slots: TimeSlot[] }> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const slots = daySlotsArray[day - 1];
      if (slots.length === 0) continue;

      const dateKey = formatDateInHelsinki(new Date(Date.UTC(year, month - 1, day)));
      const hasSlots = slots.some((s) => s.spotsAvailable > 0);
      dates[dateKey] = { hasSlots, slots };
    }

    console.log(`Month ${year}-${month}: found ${Object.keys(dates).length} dates with slots`);

    return NextResponse.json(
      {
        year,
        month,
        dates,
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
