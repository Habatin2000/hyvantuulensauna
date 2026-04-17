import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const RESOURCE_ID = process.env.BOOKLA_PUBLIC_RESOURCE_ID;
const API_KEY = process.env.BOOKLA_API_KEY;

const TIME_ZONE = 'Europe/Helsinki';

// Public ticket ID (adult) for availability checks
const PUBLIC_TICKET_ID = '74ef0b6e-c3d2-4da2-aecc-cd8d0b1a09ee';

// Standard time slots for public sauna
// Mon-Thu: 17-19, 19-21 (new schedule from 2026-03-20), Sat-Sun: 10-12, 12-14, 14-16
const getStandardSlotHours = (dateStr: string): number[] => {
  const date = new Date(dateStr + 'T12:00:00Z');
  const helsinkiStr = date.toLocaleString('en-US', { timeZone: TIME_ZONE });
  const helsinkiDate = new Date(helsinkiStr);
  const dow = helsinkiDate.getDay();
  const isMonThu = dow >= 1 && dow <= 4;
  const isWeekend = dow === 0 || dow === 6;
  
  const NEW_SCHEDULE_CUTOVER = '2026-03-20';
  const useNewSchedule = dateStr >= NEW_SCHEDULE_CUTOVER;
  
  if (isMonThu) {
    return useNewSchedule ? [17, 19] : [16, 18, 20];
  }
  if (isWeekend) {
    return [10, 12, 14];
  }
  return []; // Friday - no public slots
};

// Convert local Helsinki hour to UTC ISO string
const toUtcIsoForLocalDateHour = (dateStr: string, hour: number, tz: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const utcGuessBase = new Date(Date.UTC(y, m - 1, d, hour, 0, 0));
  
  const getTzOffsetMs = (utcDate: Date) => {
    const tzDate = new Date(utcDate.toLocaleString('en-US', { timeZone: tz }));
    return tzDate.getTime() - utcDate.getTime();
  };
  
  let offset = getTzOffsetMs(utcGuessBase);
  let utc = new Date(utcGuessBase.getTime() - offset);
  offset = getTzOffsetMs(utc);
  utc = new Date(utcGuessBase.getTime() - offset);
  
  return utc.toISOString();
};

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
  if (!COMPANY_ID || !SERVICE_ID || !API_KEY) {
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
    const timesUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${SERVICE_ID}/times`;
    const response = await fetch(timesUrl, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromISO,
        to: toISO,
        tickets: { [PUBLIC_TICKET_ID]: 1 },
      }),
    });

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
      const helsinkiStr = slotDate.toLocaleString('en-US', { timeZone: TIME_ZONE });
      const helsinkiDate = new Date(helsinkiStr);
      const hour = helsinkiDate.getHours();
      
      const existing = bestByHour.get(hour);
      if (!existing || s.spotsAvailable > existing.spotsAvailable) {
        bestByHour.set(hour, { 
          spotsAvailable: s.spotsAvailable, 
          resourceId: s.resourceId,
          startTime: s.startTime 
        });
      }
    }

    // Build standard slots
    const standardHours = getStandardSlotHours(date);
    const slots = standardHours.map((hour) => {
      const best = bestByHour.get(hour);
      const startTime = best?.startTime || toUtcIsoForLocalDateHour(date, hour, TIME_ZONE);
      
      // Calculate end time (2 hours later)
      const startDate = new Date(startTime);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      
      return {
        startTime,
        endTime: endDate.toISOString(),
        startHour: hour,
        endHour: hour + 2,
        spotsAvailable: best ? best.spotsAvailable : 0,
        resourceId: best?.resourceId || RESOURCE_ID || '',
      };
    });

    console.log(`Returning ${slots.length} time slots`);

    return NextResponse.json({
      date,
      slots,
      timeZone,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
