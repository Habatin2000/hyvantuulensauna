import { NextRequest, NextResponse } from 'next/server';
import { booklaFetch, getBooklaConfig } from '../../lib/bookla-fetch';

export const WINTER_SERVICE_ID = '8ecd1d49-ae5b-4c56-a62d-2cffb2314143';

const TIME_ZONE = 'Europe/Helsinki';

// Format date to YYYY-MM-DD in Helsinki timezone
const formatDateInHelsinki = (d: Date): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

// Winter season: November 1 – April 30 (crosses year boundary)
function seasonEnd(from: Date): Date {
  const year = from.getMonth() >= 9 ? from.getFullYear() + 1 : from.getFullYear();
  return new Date(Date.UTC(year, 3, 30, 23, 59, 59)); // April 30
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
    const { resourceId } = body;

    const now = new Date();
    const from = now.toISOString();
    const to = seasonEnd(now).toISOString();

    const response = await booklaFetch(
      `/companies/${companyId}/services/${WINTER_SERVICE_ID}/dates`,
      {
        method: 'POST',
        body: JSON.stringify({
          from,
          to,
          spots: 1,
          ...(resourceId ? { resourceIDs: [resourceId] } : {}),
        }),
      },
      apiKey
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WINTER-DATES] Bookla error:', response.status, errorText.slice(0, 300));
      return NextResponse.json(
        { error: 'Failed to fetch dates', dates: [] },
        { status: 502 }
      );
    }

    const data = await response.json();
    const datesObj = data.dates || {};
    let allDates: string[] = [];
    if (resourceId && datesObj[resourceId]) {
      allDates = datesObj[resourceId];
    } else {
      for (const resId of Object.keys(datesObj)) {
        allDates.push(...datesObj[resId]);
      }
    }
    // Deduplicate and sort; drop today if the remaining window is in the past
    const today = formatDateInHelsinki(now);
    const unique = Array.from(new Set(allDates))
      .filter((d) => d >= today)
      .sort();

    return NextResponse.json({ dates: unique, timeZone: data.timeZone || TIME_ZONE });
  } catch (error) {
    console.error('[WINTER-DATES] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dates', dates: [] },
      { status: 500 }
    );
  }
}
