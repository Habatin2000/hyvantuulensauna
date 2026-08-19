import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getGalleryPageHero } from '@/content/pages';
import { getGalleryImages } from '@/content/gallery';
import HeroSection from '@/components/sections/HeroSection';
import { generateBreadcrumbSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/galleria`;

  return {
    title: isEn
      ? 'Gallery – Sauna Photos from Helsinki'
      : 'Galleria – saunakuvia Helsingistä',
    description: isEn
      ? 'Take a peek at our sauna experiences through pictures. Sauna boats Aalto and Virta, summer sunsets, winter ice swimming and atmospheric sauna moments.'
      : 'Kurkista saunaelämyksiimme kuvien välityksellä. Saunalautat Aalto ja Virta, kesän auringonlaskut, talven avantouinnit ja tunnelmalliset saunomishetket.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/galleria`,
        'en-US': `${SITE_URL}/en/galleria`,
        'en-GB': `${SITE_URL}/en/galleria`,
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
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/galleria`;
  const galleryImages = getGalleryImages(safeLocale);

  // Schemas
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
    image: galleryImages.map(img => ({
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
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, imageGallerySchema]),
        }}
      />

      <HeroSection content={getGalleryPageHero(safeLocale)} variant="page" />

      {/* Visible date */}
      <section className="pt-8 pb-0 bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <p className="text-sm text-stone-500 text-center">
            {isEn ? 'Updated' : 'Päivitetty'} {new Date(DATE_MODIFIED).toLocaleDateString(isEn ? 'en-GB' : 'fi-FI')}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            {isEn ? 'Want to experience it yourself?' : 'Haluatko kokea itse?'}
          </h2>
          <p className="text-stone-600 mb-8">
            {isEn
              ? 'Book your own sauna experience and come feel these moments live!'
              : 'Varaa oma saunaelämyksesi ja tule kokemaan nämä tunnelmat livenä!'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/saunalauttaristeilyt-helsingissa#boats"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb]"
            >
              {isEn ? 'Book a sauna boat' : 'Varaa saunalautta'}
            </Link>
            <Link
              href="/julkinen-sauna"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
            >
              {isEn ? 'Public sauna' : 'Julkinen sauna'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
