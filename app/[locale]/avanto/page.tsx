import type { Metadata } from 'next';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import {
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateHowToSchema,
  getHomeLabel,
  getLanguageAlternates,
  getLocalizedPageUrl,
  getOpenGraphLocale,
  normalizePageLocale,
} from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_PATH = '/avanto';
const PAGE_IMAGE = `${SITE_URL}/images/gallery-ice-swimming.webp`;
const DATE_PUBLISHED = '2026-10-01';
const DATE_MODIFIED = '2026-10-01';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('avanto', safeLocale);
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
          width: 1200,
          height: 630,
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

export default async function AvantoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('avanto', safeLocale);
  const pageUrl = getLocalizedPageUrl(PAGE_PATH, safeLocale);
  const pageName = data.title.split(' | ')[0];

  const serviceSchema = {
    ...generateServiceSchema(data.title, data.description, pageUrl, PAGE_IMAGE),
    offers: [
      {
        '@type': 'Offer',
        name: data.prices?.[0] ? `${data.prices[0].label} — ${data.prices[0].note}` : data.title,
        price: '140',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      },
      {
        '@type': 'Offer',
        name: data.prices?.[1] ? `${data.prices[1].label} — ${data.prices[1].note}` : data.title,
        price: '120',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      },
    ],
  };

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

  const howToSchema = generateHowToSchema(
    data.timelineTitle ?? data.detailTitle,
    data.detailText,
    data.timeline?.map(step => ({ name: step.title, text: step.text })) ?? []
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbSchema, articleSchema, howToSchema]),
        }}
      />
      <VibeInnerPage data={data} locale={safeLocale} slug="avanto" />
    </>
  );
}
