import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Add CDN caching headers for page routes to reduce Worker CPU usage
  // under traffic spikes. API routes and static assets are skipped by the matcher.
  if (response && request.method === 'GET') {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=60, must-revalidate'
    );
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
