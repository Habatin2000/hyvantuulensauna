import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Known public slugs (without locale prefix). Used for typo-tolerant redirects.
const KNOWN_SLUGS = [
  'saunalauttaristeilyt-helsingissa',
  'julkinen-sauna',
  'yksityissauna',
  'sijainti',
  'toiminnastamme',
  'usein-kysyttya',
  'galleria',
  'kiitos',
];

const normalizeSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

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

  // Typo-tolerant redirect: if the path doesn't match a known page but matches
  // one after removing hyphens/spaces (e.g. /julkinensauna → /julkinen-sauna),
  // 308 to the correct URL. Preserves the /en prefix.
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '');
  if (pathname && pathname !== '/') {
    const localePrefix = pathname.startsWith('/en/') ? '/en' : '';
    const bare = localePrefix ? pathname.slice(3) : pathname;
    const slug = bare.replace(/^\//, '');
    if (
      slug &&
      !KNOWN_SLUGS.includes(slug) &&
      !KNOWN_SLUGS.includes(slug.toLowerCase())
    ) {
      const match = KNOWN_SLUGS.find(
        (known) => normalizeSlug(known) === normalizeSlug(slug)
      );
      if (match) {
        const url = new URL(`${localePrefix}/${match}/`, request.url);
        url.search = request.nextUrl.search;
        return NextResponse.redirect(url.toString(), 308);
      }
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
