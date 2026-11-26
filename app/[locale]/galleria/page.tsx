import type { Metadata } from 'next';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import {
  generateBreadcrumbSchema,
  getHomeLabel,
  getLanguageAlternates,
  getLocalizedPageUrl,
  getOpenGraphLocale,
  normalizePageLocale,
} from '../schema';
import { SITE_URL } from '@/lib/site';

const PAGE_PATH = '/galleria';
const PAGE_IMAGE = `${SITE_URL}/images/gallery-raft-sunset.webp`;
const SOCIAL_IMAGE_ALT: Record<Locale, string> = {
  fi: 'Auringonlasku saunalautan peräaallon yllä',
  en: 'Sunset over the wake of a sauna boat',
  es: 'Puesta de sol sobre la estela de una sauna flotante',
  fr: 'Coucher de soleil sur le sillage d’un sauna flottant',
  de: 'Sonnenuntergang über dem Kielwasser eines Saunaflosses',
};
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('galleria', safeLocale);
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
          height: 2559,
          alt: SOCIAL_IMAGE_ALT[safeLocale],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [{ url: PAGE_IMAGE, alt: SOCIAL_IMAGE_ALT[safeLocale] }],
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const data = getVibePage('galleria', safeLocale);
  const pageUrl = getLocalizedPageUrl(PAGE_PATH, safeLocale);
  const pageName = data.title.split(' | ')[0];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: getHomeLabel(safeLocale), url: getLocalizedPageUrl('/', safeLocale) },
    { name: pageName, url: pageUrl },
  ]);

  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: data.title,
    description: data.description,
    url: pageUrl,
    image: (data.gallery ?? []).map(img => ({
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}${img.src}`,
      name: img.alt,
      description: img.alt,
    })),
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    author: {
      '@id': `${SITE_URL}/#organization`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, imageGallerySchema]),
        }}
      />
      <VibeInnerPage data={data} locale={safeLocale} slug="galleria" />
    </>
  );
}
