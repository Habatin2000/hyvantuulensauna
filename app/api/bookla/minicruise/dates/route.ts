import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_API_KEY;

const TIME_ZONE = 'Europe/Helsinki';

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !API_KEY) {
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
    let seasonStart = new Date(Date.UTC(currentYear, 4, 1, 0, 0, 0)); // May 1
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
  const datesUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${serviceId}/dates`;
  const response = await fetch(datesUrl, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, resourceIDs }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bookla dates API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
