import type { Metadata } from 'next';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import {
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  getHomeLabel,
  getLanguageAlternates,
  getLocalizedPageUrl,
  getOpenGraphLocale,
  normalizePageLocale,
} from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_PATH = '/polttarit-yritystilaisuudet';
const PAGE_IMAGE = `${SITE_URL}/images/saunaboat-winter-sun.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-11-04';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('tapahtumat', safeLocale);
  const pageUrl = getLocalizedPageUrl(PAGE_PATH, safeLocale);

  return {
    title: { absolute: data.title },
    description: data.description,
    alternates: {
      canonical: pageUrl,
      languages: getLanguageAlternates(PAGE_PATH),
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: pageUrl,
      locale: getOpenGraphLocale(safeLocale),
      images: [
        {
          url: PAGE_IMAGE,
          width: 1920,
          height: 1248,
          alt: data.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [{ url: PAGE_IMAGE, alt: data.imageAlt }],
    },
  };
}

export default async function OccasionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('tapahtumat', safeLocale);
  const pageUrl = getLocalizedPageUrl(PAGE_PATH, safeLocale);
  const pageName = data.title.split(' | ')[0];

  const serviceSchema = generateServiceSchema(data.title, data.description, pageUrl, PAGE_IMAGE);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: getHomeLabel(safeLocale), url: getLocalizedPageUrl('/', safeLocale) },
    { name: pageName, url: pageUrl },
  ]);

  const articleSchema = generateArticleSchema(
    data.title,
    data.description,
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbSchema, articleSchema]),
        }}
      />
      <VibeInnerPage data={data} locale={safeLocale} slug="tapahtumat" />
    </>
  );
}
