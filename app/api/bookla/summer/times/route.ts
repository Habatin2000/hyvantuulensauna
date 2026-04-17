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

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { date, from, to, duration, resourceId } = body;

    // Support both single date (legacy) and date range mode
    const isRangeMode = from && to;
    
    if (!date && !isRangeMode) {
      return NextResponse.json(
        { error: 'date or from/to range is required' },
        { status: 400 }
      );
    }

    const durationISO = duration || 'PT3H';
    
    let fromDate: Date;
    let toDate: Date;
    let targetDate: string | null = null;

    if (isRangeMode) {
      // Range mode: fetch for entire month
      console.log('[SUMMER-TIMES] Fetching times for range:', from, 'to', to, 'duration:', durationISO, 'resource:', resourceId);
      fromDate = new Date(from + 'T00:00:00Z');
      toDate = new Date(to + 'T23:59:59Z');
    } else {
      // Single date mode (legacy)
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
      duration: durationISO,
      spots: 1,
    };

    // Normal resource: single fetch
    const requestBody = { ...baseRequest, ...(resourceId ? { resourceIDs: [resourceId] } : {}) };
    const data = await fetchTimes(requestBody);

    const times = data.times || {};
    
    // Group slots by date for range mode
    const slotsByDate: Record<string, Array<{
      startTime: string;
      duration: string;
      spotsAvailable: number;
      resourceId: string;
      price: { amount: number; currency: string; comparedAmount?: number } | null;
    }>> = {};

    for (const resId of Object.keys(times)) {
      if (resourceId && resId !== resourceId) continue;
      const resourceTimes = times[resId] || [];
      for (const slot of resourceTimes) {
        const slotDate = formatDateInTZ(new Date(slot.startTime), TIME_ZONE);
        
        // In single date mode, only include slots for the target date
        if (targetDate && slotDate !== targetDate) continue;
        
        if (!slotsByDate[slotDate]) {
          slotsByDate[slotDate] = [];
        }
        
        slotsByDate[slotDate].push({
          startTime: slot.startTime,
          duration: slot.duration || durationISO,
          spotsAvailable: slot.spotsAvailable ?? 1,
          resourceId: resId,
          price: slot.price || null,
        });
      }
    }

    // Sort slots within each date
    for (const dateKey of Object.keys(slotsByDate)) {
      slotsByDate[dateKey].sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    }

    if (isRangeMode) {
      console.log(`[SUMMER-TIMES] Returning slots for ${Object.keys(slotsByDate).length} dates`);
      return NextResponse.json({
        slotsByDate,
        timeZone: data.timeZone || TIME_ZONE,
        from,
        to,
        duration: durationISO,
      });
    } else {
      // Legacy single date response
      const slots = targetDate ? (slotsByDate[targetDate] || []) : [];
      console.log(`[SUMMER-TIMES] Returning ${slots.length} slots for date ${targetDate}`);
      return NextResponse.json({
        slots,
        timeZone: data.timeZone || TIME_ZONE,
        date: targetDate,
        duration: durationISO,
      });
    }

  } catch (error: any) {
    console.error('[SUMMER-TIMES] Error:', error);
    
    // Handle rate limiting specifically
    if (error.message === 'rate_limited') {
      return NextResponse.json(
        { error: 'rate_limited', message: 'Too many requests to booking backend, try again in a moment.', slots: [] },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch times', slots: [] },
      { status: 500 }
    );
  }
}

// Fetch with retry logic and exponential backoff, respecting Retry-After header
async function fetchBooklaWithBackoff(url: string, init: RequestInit, attempt = 0): Promise<Response> {
  const res = await fetch(url, init);
  
  if (res.status === 429 && attempt < 3) {
    // Check for Retry-After header first, fallback to exponential backoff
    const retryAfter = res.headers.get('retry-after');
    const delay = retryAfter 
      ? Number(retryAfter) * 1000 
      : 500 * 2 ** attempt; // 500ms, 1000ms, 2000ms
    
    console.log(`[SUMMER-TIMES] Rate limited, retrying after ${delay}ms (attempt ${attempt + 1})`);
    await new Promise(r => setTimeout(r, delay));
    return fetchBooklaWithBackoff(url, init, attempt + 1);
  }
  
  return res;
}

async function fetchTimes(requestBody: any) {
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
    // Return a specific error for rate limiting
    throw new Error('rate_limited');
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bookla times API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
