import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_API_KEY;

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
    const { serviceId, resourceId, date, from, to } = body;

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    const isRangeMode = from && to;
    
    if (!date && !isRangeMode) {
      return NextResponse.json(
        { error: 'date or from/to range is required' },
        { status: 400 }
      );
    }

    let fromDate: Date;
    let toDate: Date;
    let targetDate: string | null = null;

    if (isRangeMode) {
      console.log('[MINICRUISE-TIMES] Fetching times for range:', from, 'to', to, 'service:', serviceId);
      fromDate = new Date(from + 'T00:00:00Z');
      toDate = new Date(to + 'T23:59:59Z');
    } else {
      console.log('[MINICRUISE-TIMES] Fetching times for date:', date, 'service:', serviceId);
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

    const requestBody = { 
      ...baseRequest, 
      ...(resourceId ? { resourceIDs: [resourceId] } : {}) 
    };
    
    const data = await fetchTimes(serviceId, requestBody);
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
        
        if (targetDate && slotDate !== targetDate) continue;
        
        if (!slotsByDate[slotDate]) {
          slotsByDate[slotDate] = [];
        }
        
        slotsByDate[slotDate].push({
          startTime: slot.startTime,
          duration: slot.duration || 'PT1H30M',
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
      return NextResponse.json({
        slotsByDate,
        timeZone: data.timeZone || TIME_ZONE,
        from,
        to,
      });
    } else {
      const slots = targetDate ? (slotsByDate[targetDate] || []) : [];
      return NextResponse.json({
        slots,
        timeZone: data.timeZone || TIME_ZONE,
        date: targetDate,
      });
    }

  } catch (error: any) {
    console.error('[MINICRUISE-TIMES] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch times', slots: [] },
      { status: 500 }
    );
  }
}

async function fetchTimes(serviceId: string, requestBody: any) {
  const timesUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${serviceId}/times`;
  const response = await fetch(timesUrl, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Gracefully handle missing price rules (e.g. dates outside active pricing period)
    if (response.status === 409 && errorText.includes('no_price_rule_found')) {
      return { times: {}, timeZone: TIME_ZONE };
    }
    throw new Error(`Bookla times API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
