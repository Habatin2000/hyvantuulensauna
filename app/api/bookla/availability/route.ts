import { NextRequest, NextResponse } from 'next/server';
import { booklaFetch, getBooklaConfig } from '../lib/bookla-fetch';

const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const RESOURCE_ID = process.env.BOOKLA_PUBLIC_RESOURCE_ID;

const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=30, s-maxage=60' };

const TIME_ZONE = 'Europe/Helsinki';

// Public ticket ID (adult) for availability checks
const PUBLIC_TICKET_ID = '74ef0b6e-c3d2-4da2-aecc-cd8d0b1a09ee';

// No hardcoded slot hours — Bookla is the source of truth
// We return all PT2H slots that Bookla returns for the requested date

// Format date for display
const formatDateInTimeZone = (d: Date, tz: string): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

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
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter required' },
        { status: 400 }
      );
    }

    // Build date range: previous day 22:00 UTC to selected day 22:00 UTC
    const dateObj = new Date(date + 'T00:00:00Z');
    const prevDay = new Date(dateObj);
    prevDay.setDate(prevDay.getDate() - 1);
    prevDay.setUTCHours(22, 0, 0, 0);
    
    const currentDay = new Date(dateObj);
    currentDay.setUTCHours(22, 0, 0, 0);
    
    const fromISO = prevDay.toISOString();
    const toISO = currentDay.toISOString();

    console.log('Fetching times:', { date, fromISO, toISO });

    // Fetch available times from Bookla
    const response = await booklaFetch(
      `/companies/${companyId}/services/${SERVICE_ID}/times`,
      {
        method: 'POST',
        body: JSON.stringify({
          from: fromISO,
          to: toISO,
          tickets: { [PUBLIC_TICKET_ID]: 1 },
        }),
      },
      apiKey
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bookla times API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Bookla API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Bookla times response:', JSON.stringify(data).slice(0, 1000));

    // Process times - filter PT2H slots for the requested date
    const times = data.times || {};
    const timeZone = data.timeZone || TIME_ZONE;

    // Collect Bookla slots (2h only)
    const booklaSlots: Array<{
      startTime: string;
      spotsAvailable: number;
      resourceId: string;
    }> = [];

    for (const resId of Object.keys(times)) {
      if (RESOURCE_ID && resId !== RESOURCE_ID) continue;

      const resourceTimes = times[resId] || [];
      for (const slot of resourceTimes) {
        if (slot.duration === 'PT2H') {
          booklaSlots.push({
            startTime: slot.startTime,
            spotsAvailable: slot.spotsAvailable ?? 17,
            resourceId: resId,
          });
        }
      }
    }

    // Filter slots for the requested Helsinki date
    const booklaSlotsForDate = booklaSlots.filter(
      (s) => formatDateInTimeZone(new Date(s.startTime), TIME_ZONE) === date
    );

    // Best availability per start hour
    const bestByHour = new Map<number, { spotsAvailable: number; resourceId: string; startTime: string }>();
    for (const s of booklaSlotsForDate) {
      const slotDate = new Date(s.startTime);
      // Use Intl.DateTimeFormat directly for reliable timezone conversion on Cloudflare Workers
      const hour = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: TIME_ZONE,
          hour: 'numeric',
          hour12: false,
        }).format(slotDate),
        10
      );
      
      const existing = bestByHour.get(hour);
      if (!existing || s.spotsAvailable > existing.spotsAvailable) {
        bestByHour.set(hour, { 
          spotsAvailable: s.spotsAvailable, 
          resourceId: s.resourceId,
          startTime: s.startTime 
        });
      }
    }

    // Build slots from all unique hours Bookla returned
    const sortedHours = Array.from(bestByHour.keys()).sort((a, b) => a - b);
    const slots = sortedHours.map((hour) => {
      const best = bestByHour.get(hour)!;
      const startDate = new Date(best.startTime);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      
      return {
        startTime: best.startTime,
        endTime: endDate.toISOString(),
        startHour: hour,
        endHour: hour + 2,
        spotsAvailable: best.spotsAvailable,
        resourceId: best.resourceId,
      };
    });

    console.log(`Returning ${slots.length} time slots`);

    return NextResponse.json(
      {
        date,
        slots,
        timeZone,
      },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
