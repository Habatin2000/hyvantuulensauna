import type { Metadata } from 'next';
import Image from 'next/image';
import { storyContent } from '@/content/homepage';
import { trustBadges } from '@/content/homepage';
import { generateBreadcrumbSchema, generateArticleSchema } from '../schema';

const PAGE_URL = 'https://hyvantuulensauna.fi/toiminnastamme';
const PAGE_IMAGE = 'https://hyvantuulensauna.fi/images/gallery-crew.jpeg';
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Toiminnastamme | Hyvän Tuulen Sauna Oy',
  description: 'Tutustu Hyvän Tuulen Saunan tarinaan. Olemme tarjonneet saunalauttaristeilyjä ja saunaelämyksiä Helsingissä jo vuodesta 2018. 8 vuoden kokemuksella huippusaunaelämyksiä.',

  alternates: {
    canonical: '/toiminnastamme',
  },
  openGraph: {
    title: 'Toiminnastamme | Hyvän Tuulen Sauna',
    description: 'Tutustu tarinaamme. 8 vuoden kokemuksella saunalauttaristeilyjä Helsingissä.',
    url: 'https://hyvantuulensauna.fi/toiminnastamme',
    images: [
      {
        url: '/images/gallery-crew.jpeg',
        width: 1200,
        height: 630,
        alt: 'Hyvän Tuulen Saunan tiimi',
      },
    ],
  },
};

export default function AboutPage() {
  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Etusivu', url: 'https://hyvantuulensauna.fi' },
    { name: 'Toiminnastamme', url: PAGE_URL }
  ]);

  const articleSchema = generateArticleSchema(
    'Toiminnastamme | Hyvän Tuulen Sauna Oy',
    'Tutustu Hyvän Tuulen Saunan tarinaan. Olemme tarjonneet saunalauttaristeilyjä ja saunaelämyksiä Helsingissä jo vuodesta 2018.',
    PAGE_URL,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Toiminnastamme',
    description: 'Hyvän Tuulen Saunan tarina, arvot ja tiimi.',
    url: PAGE_URL,
    mainEntity: {
      '@id': 'https://hyvantuulensauna.fi/#organization'
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, articleSchema, aboutPageSchema]),
        }}
      />

      {/* Hero */}
      <section className="section-padding bg-[#3b82f6]">
        <div className="container-padding mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {storyContent.title}
          </h1>
          <p className="text-xl text-white/90 italic max-w-3xl mx-auto">
            &ldquo;{storyContent.quote}&rdquo;
          </p>
        </div>
      </section>

      {/* AI-optimized answer block */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="rounded-xl bg-white border border-stone-200 p-6 md:p-8 text-left">
            <p className="text-sm text-stone-500 mb-4">
              Päivitetty {new Date(DATE_MODIFIED).toLocaleDateString('fi-FI')}
            </p>
            <p className="text-stone-700 leading-relaxed">
              <strong className="text-stone-900">Hyvän Tuulen Sauna on tarjonnut saunalauttaristeilyjä Helsingissä jo vuodesta 2018.</strong>{' '}
              Kahdeksan vuoden kokemuksella tuotamme merellisiä saunaelämyksiä Itä-Helsingin saaristossa. 
              Tiimimme kipparit Kalle, Onni, Ile ja Tuure varmistavat, että jokainen 
              <a href="/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">saunalauttaristeily</a> on turvallinen ja unohtumaton.
              Toimintamme perustuu aitouteen, meren läheisyyteen ja yhteisöllisyyteen.
            </p>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-8">
                Meidän tarinamme
              </h2>
              <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
                {storyContent.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/crew2.png"
                alt="Hyvän Tuulen Saunan tarina"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.id} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#3b82f6] mb-2">
                  {badge.value}
                </div>
                <div className="text-stone-600">{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-12">
            Arvomme
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Aitous</h3>
              <p className="text-stone-600">
                Perinteinen puulämmitteinen sauna ja aito suomalainen saunakulttuuri
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌊</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Meri</h3>
              <p className="text-stone-600">
                Merellinen ympäristö ja yhteys veteen ympäri vuoden
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Yhteisö</h3>
              <p className="text-stone-600">
                Yhdessäolo, hyvä tunnelma ja kaikille mukava ilmapiiri
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
