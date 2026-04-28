import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const envVars = {
    BOOKLA_API_KEY: { set: !!process.env.BOOKLA_API_KEY, length: process.env.BOOKLA_API_KEY?.length || 0 },
    BOOKLA_COMPANY_ID: { set: !!process.env.BOOKLA_COMPANY_ID, value: process.env.BOOKLA_COMPANY_ID },
    BOOKLA_PUBLIC_SERVICE_ID: { set: !!process.env.BOOKLA_PUBLIC_SERVICE_ID, value: process.env.BOOKLA_PUBLIC_SERVICE_ID },
    BOOKLA_PUBLIC_RESOURCE_ID: { set: !!process.env.BOOKLA_PUBLIC_RESOURCE_ID, value: process.env.BOOKLA_PUBLIC_RESOURCE_ID },
    BOOKLA_BOOKING_API_KEY: { set: !!process.env.BOOKLA_BOOKING_API_KEY, length: process.env.BOOKLA_BOOKING_API_KEY?.length || 0 },
    BOOKLA_BASE_URL: { set: !!process.env.BOOKLA_BASE_URL, value: process.env.BOOKLA_BASE_URL },
    NODE_ENV: process.env.NODE_ENV,
  };

  const allSet = 
    envVars.BOOKLA_API_KEY.set &&
    envVars.BOOKLA_COMPANY_ID.set;

  return NextResponse.json({
    ok: allSet,
    env: envVars,
    timestamp: new Date().toISOString(),
  });
}
