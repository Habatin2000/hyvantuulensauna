import { NextRequest, NextResponse } from 'next/server';
import { booklaFetch, getBooklaConfig } from '../../lib/bookla-fetch';
import { WINTER_SERVICE_ID } from '../dates/route';

const TIME_ZONE = 'Europe/Helsinki';

const formatDateInTZ = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);

const formatHourInTZ = (d: Date, tz: string) =>
  parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false,
    }).format(d),
    10
  );

// Normalized slot returned by this route.
export interface WinterSlot {
  startTime: string;
  duration: string;
  spotsAvailable: number;
  resourceId: string;
  price: { amount: number; comparedAmount: number; currency: string } | null;
}

export async function POST(request: NextRequest) {
  const { companyId, apiKey } = getBooklaConfig({ preferBookingKey: true });
  if (!companyId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { date, resourceId } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'date is required' },
        { status: 400 }
      );
    }

    // Window: previous day 20:00 UTC -> next day 04:00 UTC captures all Helsinki slots.
    const dateObj = new Date(date + 'T00:00:00Z');
    const fromDate = new Date(dateObj);
    fromDate.setUTCDate(fromDate.getUTCDate() - 1);
    fromDate.setUTCHours(20, 0, 0, 0);
    const toDate = new Date(dateObj);
    toDate.setUTCDate(toDate.getUTCDate() + 1);
    toDate.setUTCHours(4, 0, 0, 0);

    const response = await booklaFetch(
      `/companies/${companyId}/services/${WINTER_SERVICE_ID}/times`,
      {
        method: 'POST',
        body: JSON.stringify({
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
          spots: 1,
          ...(resourceId ? { resourceIDs: [resourceId] } : {}),
        }),
      },
      apiKey
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WINTER-TIMES] Bookla error:', response.status, errorText.slice(0, 300));
      return NextResponse.json({ error: 'Failed to fetch times', slots: [] }, { status: 502 });
    }

    const data = await response.json();
    const times = data.times || {};

    const slots: WinterSlot[] = [];
    for (const resId of Object.keys(times)) {
      if (resourceId && resId !== resourceId) continue;
      for (const slot of times[resId] || []) {
        const slotDate = new Date(slot.startTime);
        if (formatDateInTZ(slotDate, TIME_ZONE) !== date) continue;
        const startHour = formatHourInTZ(slotDate, TIME_ZONE);
        if (startHour < 8 || startHour > 22) continue;
        slots.push({
          startTime: slot.startTime,
          duration: slot.duration || 'PT2H',
          spotsAvailable: slot.spotsAvailable ?? 1,
          resourceId: resId,
          price: slot.price
            ? {
                amount: slot.price.amount ?? 0,
                comparedAmount: slot.price.comparedAmount ?? 0,
                currency: slot.price.currency || 'EUR',
              }
            : null,
        });
      }
    }

    slots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return NextResponse.json({ slots, date, timeZone: TIME_ZONE });
  } catch (error) {
    console.error('[WINTER-TIMES] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch times', slots: [] }, { status: 500 });
  }
}
