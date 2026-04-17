import { NextRequest, NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const API_KEY = process.env.BOOKLA_API_KEY;
const SUMMER_SERVICE_ID = '3ea1445e-c830-4604-a294-3dbe124446a5';

const TIME_ZONE = 'Europe/Helsinki';

// Resource IDs - Aalto and Virta only
const AALTO_RESOURCE_ID = '3dd71bee-f303-463e-ad78-e05b4faa2234';
const VIRTA_RESOURCE_ID = '3bffeff6-4ef4-4865-a99b-370b956e355e';

export async function POST(request: NextRequest) {
  if (!COMPANY_ID || !API_KEY) {
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
  const datesUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${SUMMER_SERVICE_ID}/dates`;
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
