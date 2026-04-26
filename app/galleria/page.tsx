import type { Metadata } from 'next';
import Image from 'next/image';
import { galleryPageHero } from '@/content/pages';
import { galleryImages } from '@/content/gallery';
import HeroSection from '@/components/sections/HeroSection';
import { generateBreadcrumbSchema } from '../schema';

const PAGE_URL = 'https://hyvantuulensauna.fi/galleria';
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Galleria | Saunalautta ja Sauna Kuvia Helsingistä',
  description: 'Kurkista saunaelämyksiimme kuvien välityksellä. Saunalautat Aalto ja Virta, kesän auringonlaskut, talven avantouinnit ja tunnelmalliset saunomishetket.',

  alternates: {
    canonical: '/galleria',
  },
  openGraph: {
    title: 'Galleria | Hyvän Tuulen Sauna',
    description: 'Kuvia saunaelämyksistämme Helsingissä.',
    url: 'https://hyvantuulensauna.fi/galleria',
    images: [
      {
        url: '/images/gallery-raft-sunset.jpg',
        width: 1200,
        height: 630,
        alt: 'Hyvän Tuulen Sauna galleria',
      },
    ],
  },
};

export default function GalleryPage() {
  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Etusivu', url: 'https://hyvantuulensauna.fi' },
    { name: 'Galleria', url: PAGE_URL }
  ]);

  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Hyvän Tuulen Saunan galleria',
    description: 'Kuvia saunaelämyksistä, saunalautoista ja tunnelmallisista hetkistä Helsingissä.',
    url: PAGE_URL,
    image: galleryImages.map(img => ({
      '@type': 'ImageObject',
      contentUrl: `https://hyvantuulensauna.fi${img.src}`,
      name: img.alt,
      description: img.alt
    })),
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    author: {
      '@id': 'https://hyvantuulensauna.fi/#organization'
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

      <HeroSection content={galleryPageHero} variant="page" />

      {/* Visible date */}
      <section className="pt-8 pb-0 bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <p className="text-sm text-stone-500 text-center">
            Päivitetty {new Date(DATE_MODIFIED).toLocaleDateString('fi-FI')}
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
            Haluatko kokea itse?
          </h2>
          <p className="text-stone-600 mb-8">
            Varaa oma saunaelämyksesi ja tule kokemaan nämä tunnelmat livenä!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/saunalauttaristeilyt-helsingissa"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb]"
            >
              Varaa saunalautta
            </a>
            <a 
              href="/julkinen-sauna"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
            >
              Julkinen sauna
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
