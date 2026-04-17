import { NextResponse } from 'next/server';

const BOOKLA_BASE_URL = process.env.BOOKLA_BASE_URL || 'https://eu.bookla.com/api/v1';
const COMPANY_ID = process.env.BOOKLA_COMPANY_ID;
const SERVICE_ID = process.env.BOOKLA_PUBLIC_SERVICE_ID;
const API_KEY = process.env.BOOKLA_API_KEY;

export async function GET() {
  if (!COMPANY_ID || !SERVICE_ID || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing Bookla configuration' },
      { status: 500 }
    );
  }

  try {
    // Fetch service info
    const serviceUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${SERVICE_ID}`;
    const serviceRes = await fetch(serviceUrl, {
      headers: { 'x-api-key': API_KEY },
    });

    if (!serviceRes.ok) {
      throw new Error(`Service fetch failed: ${serviceRes.status}`);
    }

    const service = await serviceRes.json();

    // Fetch tickets
    const ticketsUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${SERVICE_ID}/tickets`;
    const ticketsRes = await fetch(ticketsUrl, {
      headers: { 'x-api-key': API_KEY },
    });

    let tickets = [];
    if (ticketsRes.ok) {
      tickets = await ticketsRes.json();
    }

    // Fetch prices
    const pricesUrl = `${BOOKLA_BASE_URL}/companies/${COMPANY_ID}/services/${SERVICE_ID}/prices`;
    const pricesRes = await fetch(pricesUrl, {
      headers: { 'x-api-key': API_KEY },
    });

    let prices: { rules?: { ticketID: string; price: { price: number } | number }[] } = {};
    if (pricesRes.ok) {
      prices = await pricesRes.json();
    }

    // Combine ticket info with prices
    // Note: Bookla returns price as an object with {id, price, comparedPrice}
    const ticketsWithPrices = tickets.map((ticket: { id: string; name: string; enabled: boolean }) => {
      const priceRule = prices.rules?.find((r: { ticketID: string; price?: { price: number } | number }) => r.ticketID === ticket.id);
      // Handle both object price {price: number} and direct number
      // Note: Bookla returns prices in cents, convert to euros
      const priceValue = priceRule?.price;
      const priceInCents = typeof priceValue === 'object' && priceValue !== null 
        ? (priceValue as { price: number }).price 
        : typeof priceValue === 'number' 
          ? priceValue 
          : 0;
      const numericPrice = priceInCents / 100;
      return {
        id: ticket.id,
        name: ticket.name,
        enabled: ticket.enabled,
        price: numericPrice,
      };
    });

    return NextResponse.json({
      service,
      tickets: ticketsWithPrices,
    });
  } catch (error) {
    console.error('Error fetching service info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service info' },
      { status: 500 }
    );
  }
}
