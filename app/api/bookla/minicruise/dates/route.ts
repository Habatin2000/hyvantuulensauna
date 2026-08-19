import { NextRequest, NextResponse } from 'next/server';
import { booklaFetch, getBooklaConfig } from '../../lib/bookla-fetch';

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
    const { serviceId, resourceId } = body;

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    console.log('[MINICRUISE-DATES] Fetching dates, serviceId:', serviceId, 'resourceId:', resourceId);

    // Season: May-September
    const now = new Date();
    const currentYear = now.getFullYear();
    const seasonStart = new Date(Date.UTC(currentYear, 4, 1, 0, 0, 0)); // May 1
    const seasonEnd = new Date(Date.UTC(currentYear, 8, 30, 23, 59, 59)); // September 30
    if (seasonEnd < now) {
      seasonStart.setFullYear(currentYear + 1);
      seasonEnd.setFullYear(currentYear + 1);
    }
    const from = seasonStart.toISOString();
    const to = seasonEnd.toISOString();

    // Fetch dates for the service
    const data = await fetchDates(
      serviceId,
      resourceId ? [resourceId] : [],
      from,
      to
    );

    const allDates = new Set<string>();
    const datesObj = data.dates || {};
    
    // Collect all dates from all resources
    for (const resId of Object.keys(datesObj)) {
      if (resourceId && resId !== resourceId) continue;
      for (const d of datesObj[resId]) {
        allDates.add(d);
      }
    }

    return NextResponse.json({
      dates: Array.from(allDates).sort(),
      timeZone: data.timeZone || TIME_ZONE,
    });

  } catch (error) {
    console.error('[MINICRUISE-DATES] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dates', dates: [] },
      { status: 500 }
    );
  }
}

async function fetchDates(serviceId: string, resourceIDs: string[], from: string, to: string) {
  const { companyId, apiKey } = getBooklaConfig();
  const response = await booklaFetch(
    `/companies/${companyId}/services/${serviceId}/dates`,
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
