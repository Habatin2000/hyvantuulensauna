import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getVibeRoute } from './components/vibe/routes';

const intlMiddleware = createMiddleware(routing);

// Known public slugs (without locale prefix). Used for typo-tolerant redirects.
const KNOWN_SLUGS = Object.entries(routing.pathnames)
  .flatMap(([internalPath, path]) => [
    internalPath,
    ...(typeof path === 'string' ? [path] : Object.values(path)),
  ])
  .map((path) => path.replace(/^\/+|\/+$/g, ''))
  .filter(Boolean);

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
  // 308 to the correct URL. Preserves any non-default locale prefix.
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '');
  if (pathname && pathname !== '/') {
    const locale = routing.locales.find((option) =>
      option !== routing.defaultLocale &&
      (pathname === `/${option}` || pathname.startsWith(`/${option}/`))
    );
    const localePrefix = locale ? `/${locale}` : '';
    const bare = localePrefix ? pathname.slice(localePrefix.length) : pathname;
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

  // Legacy blog URLs (?post=...) rendered the homepage on the old site.
  // next.config query-`has` redirects are unreliable for catch-alls in this
  // setup (a key-only condition matched requests without the param too),
  // so the catch-all lives here where the check is explicit. Specific posts
  // keep their targeted destinations from next.config.ts.
  if (request.nextUrl.searchParams.has('post')) {
    const p = pathname;
    const locale = p === '' || p === '/'
      ? routing.defaultLocale
      : routing.locales.find((option) => p === `/${option}`);
    if (locale) {
      return NextResponse.redirect(
        new URL(getVibeRoute('saunalauttaristeilyt', locale), request.url),
        308
      );
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
  // - /vibe (standalone design preview, deliberately outside the live i18n shell)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: ['/((?!api|_next|_vercel|vibe(?:/.*)?|.*\\..*).*)'],
};
