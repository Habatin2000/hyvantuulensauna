import { NextRequest, NextResponse } from 'next/server';
import { booklaFetch, getBooklaConfig } from '../../lib/bookla-fetch';

const SUMMER_SERVICE_ID = '3ea1445e-c830-4604-a294-3dbe124446a5';

const TIME_ZONE = 'Europe/Helsinki';

export async function POST(request: NextRequest) {
  const { companyId, apiKey } = getBooklaConfig();
  if (!companyId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { resourceId } = body;

    console.log('[SUMMER-DATES] Fetching dates, resourceId:', resourceId);

    // Season: May-September
    const now = new Date();
    const from = now.toISOString();
    const currentYear = now.getFullYear();
    const seasonEnd = new Date(Date.UTC(currentYear, 8, 30, 23, 59, 59)); // September 30
    if (seasonEnd < now) seasonEnd.setFullYear(currentYear + 1);
    const to = seasonEnd.toISOString();

    // Fetch dates for selected resource
    const data = await fetchDates(
      resourceId ? [resourceId] : [],
      from,
      to
    );

    const allDates = new Set<string>();
    const datesObj = data.dates || {};
    if (resourceId && datesObj[resourceId]) {
      for (const d of datesObj[resourceId]) allDates.add(d);
    } else {
      for (const resId of Object.keys(datesObj)) {
        for (const d of datesObj[resId]) allDates.add(d);
      }
    }

    return NextResponse.json({
      dates: Array.from(allDates).sort(),
      timeZone: data.timeZone || TIME_ZONE,
    });

  } catch (error) {
    console.error('[SUMMER-DATES] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dates', dates: [] },
      { status: 500 }
    );
  }
}

async function fetchDates(resourceIDs: string[], from: string, to: string) {
  const { companyId, apiKey } = getBooklaConfig();
  const response = await booklaFetch(
    `/companies/${companyId}/services/${SUMMER_SERVICE_ID}/dates`,
    {
      method: 'POST',
      body: JSON.stringify({ from, to, resourceIDs }),
    },
    apiKey
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bookla dates API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
