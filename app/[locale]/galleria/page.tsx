import type { Metadata } from 'next';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage } from '@/components/vibe/pages';
import type { Locale } from '@/components/vibe/content';
import { generateBreadcrumbSchema } from '../schema';
import { SITE_URL } from '@/lib/site';

const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/gallery' : '/galleria'}`;

  return {
    title: isEn
      ? 'Sauna & Boat Cruise Gallery'
      : 'Kuvia saunasta ja saunalauttaristeilyistä',
    description: isEn
      ? 'Explore Hyvän Tuulen Sauna in photos: Aalto and Virta sauna boats, summer sunsets and winter ice swimming. Get inspired for your own sauna experience.'
      : 'Tutustu Hyvän Tuulen Saunaan kuvissa: saunalautat Aalto ja Virta, kesäiset auringonlaskut ja talven avantouinnit. Löydä inspiraatiota omaan saunahetkeesi.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/galleria`,
        'en-US': `${SITE_URL}/en/gallery`,
        'en-GB': `${SITE_URL}/en/gallery`,
        'x-default': `${SITE_URL}/galleria`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Gallery | Hyvän Tuulen Sauna'
        : 'Galleria | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Photos from our sauna experiences in Helsinki.'
        : 'Kuvia saunaelämyksistämme Helsingissä.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-raft-sunset.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Hyvän Tuulen Sauna gallery'
            : 'Hyvän Tuulen Sauna galleria',
        },
      ],
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const data = getVibePage('galleria', safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en/gallery' : '/galleria'}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Gallery' : 'Galleria', url: pageUrl }
  ]);

  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: isEn ? 'Hyvän Tuulen Sauna gallery' : 'Hyvän Tuulen Saunan galleria',
    description: isEn
      ? 'Photos of sauna experiences, sauna boats and atmospheric moments in Helsinki.'
      : 'Kuvia saunaelämyksistä, saunalautoista ja tunnelmallisista hetkistä Helsingissä.',
    url: pageUrl,
    image: (data.gallery ?? []).map(img => ({
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}${img.src}`,
      name: img.alt,
      description: img.alt
    })),
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    author: {
      '@id': `${SITE_URL}/#organization`
    }
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
