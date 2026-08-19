import { NextResponse } from 'next/server';
import { booklaFetch, getBooklaConfig } from '../lib/bookla-fetch';

const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;

const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=30, s-maxage=60' };

type PriceRule = {
  ticketID: string;
  price: { price: number } | number;
  createdAt?: string;
  priority?: number;
  limitation?: {
    dates?: { start: string; end: string }[];
    daysOfWeek?: number;
    times?: { start: string; end: string }[];
  };
};

function getPriceValue(rule?: PriceRule): number {
  if (!rule) return 0;
  const priceValue = rule.price;
  if (typeof priceValue === 'object' && priceValue !== null) {
    return (priceValue as { price: number }).price;
  }
  if (typeof priceValue === 'number') {
    return priceValue;
  }
  return 0;
}

function isRuleActive(rule: PriceRule, ref = new Date()): boolean {
  const dates = rule.limitation?.dates;
  if (dates && dates.length > 0) {
    const t = ref.getTime();
    return dates.some(
      (d) => new Date(d.start).getTime() <= t && t <= new Date(d.end).getTime()
    );
  }
  return true;
}

function selectPriceRule(rules: PriceRule[]): PriceRule | undefined {
  if (rules.length === 0) return undefined;
  const active = rules.filter((r) => isRuleActive(r));
  const pool = active.length > 0 ? active : rules;
  return pool.sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )[0];
}

export async function GET() {
  const { companyId, apiKey } = getBooklaConfig({ preferBookingKey: true });
  if (!companyId || !SERVICE_ID || !apiKey) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    // Fetch service info
    const serviceRes = await booklaFetch(
      `/companies/${companyId}/services/${SERVICE_ID}`,
      {},
      apiKey
    );

    if (!serviceRes.ok) {
      throw new Error(`Service fetch failed: ${serviceRes.status}`);
    }

    const service = await serviceRes.json();

    // Fetch tickets
    const ticketsRes = await booklaFetch(
      `/companies/${companyId}/services/${SERVICE_ID}/tickets`,
      {},
      apiKey
    );

    let tickets = [];
    if (ticketsRes.ok) {
      tickets = await ticketsRes.json();
    }

    // Fetch prices
    const pricesRes = await booklaFetch(
      `/companies/${companyId}/services/${SERVICE_ID}/prices`,
      {},
      apiKey
    );

    let prices: { rules?: PriceRule[] } = {};
    if (pricesRes.ok) {
      prices = await pricesRes.json();
    }

    // Combine ticket info with prices
    // Note: Bookla returns price as an object with {id, price, comparedPrice}
    const ticketsWithPrices = tickets.map((ticket: { id: string; name: string; enabled: boolean }) => {
      const ticketRules = (prices.rules || []).filter((r) => r.ticketID === ticket.id);
      const priceRule = selectPriceRule(ticketRules);
      const numericPrice = getPriceValue(priceRule) / 100;
      return {
        id: ticket.id,
        name: ticket.name,
        enabled: ticket.enabled,
        price: numericPrice,
      };
    });

    return NextResponse.json(
      {
        service,
        tickets: ticketsWithPrices,
      },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error fetching service info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service info' },
      { status: 500 }
    );
  }
}
