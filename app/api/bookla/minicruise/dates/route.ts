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

    // Don't query past dates: useless for booking, and a single date without
    // a price rule fails the ENTIRE range query in Bookla (409
    // no_price_rule_found) — fewer dates, fewer failure modes.
    const effectiveStart = now > seasonStart ? now : seasonStart;

    if (effectiveStart > seasonEnd) {
      return NextResponse.json({ dates: [], timeZone: TIME_ZONE });
    }

    // Chunk by month so one bad date range can't fail the whole season
    // (same lesson as the summer routes — see JOURNAL.md).
    const chunks: Array<{ from: string; to: string }> = [];
    let cursor = new Date(effectiveStart);
    while (cursor <= seasonEnd) {
      const nextMonth = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
      const chunkEnd = nextMonth < seasonEnd ? nextMonth : seasonEnd;
      chunks.push({ from: cursor.toISOString(), to: chunkEnd.toISOString() });
      cursor = nextMonth;
    }

    const results = await Promise.allSettled(
      chunks.map((c) => fetchDates(serviceId, resourceId ? [resourceId] : [], c.from, c.to))
    );

    const allDates = new Set<string>();
    let timeZone = TIME_ZONE;
    let failedChunks = 0;
    for (const result of results) {
      if (result.status === 'rejected') {
        failedChunks++;
        console.warn('[MINICRUISE-DATES] Chunk failed, skipping:', result.reason instanceof Error ? result.reason.message : result.reason);
        continue;
      }
      const data = result.value;
      timeZone = data.timeZone || timeZone;
      const datesObj = data.dates || {};
      for (const resId of Object.keys(datesObj)) {
        if (resourceId && resId !== resourceId) continue;
        for (const d of datesObj[resId]) {
          allDates.add(d);
        }
      }
    }

    if (failedChunks === chunks.length && chunks.length > 0) {
      throw new Error('All Bookla date chunks failed');
    }

    return NextResponse.json({
      dates: Array.from(allDates).sort(),
      timeZone,
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
