import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Enforce HTTPS at the edge: Cloudflare currently serves plain HTTP with
  // 200 instead of redirecting. Redirect here so http:// never serves
  // duplicate content. (Local dev stays on http.)
  const host = request.headers.get('host') || '';
  if (host.endsWith('hyvantuulensauna.fi')) {
    let scheme = request.headers.get('x-forwarded-proto');
    const cfVisitor = request.headers.get('cf-visitor');
    if (cfVisitor) {
      try {
        scheme = (JSON.parse(cfVisitor) as { scheme?: string }).scheme ?? scheme;
      } catch { /* fall back to x-forwarded-proto */ }
    }
    if (scheme === 'http') {
      const url = new URL(request.url);
      url.protocol = 'https:';
      return NextResponse.redirect(url.toString(), 308);
    }
  }

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
