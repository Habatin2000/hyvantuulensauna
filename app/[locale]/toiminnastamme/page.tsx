import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getStoryContent, getTrustBadges } from '@/content/homepage';
import { generateBreadcrumbSchema, generateArticleSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-crew.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/toiminnastamme`;

  return {
    title: isEn ? 'About Us' : 'Toiminnastamme',
    description: isEn
      ? 'Discover the story of Hyvän Tuulen Sauna. We have offered sauna boat cruises and sauna experiences in Helsinki since 2018. Top sauna experiences with 8 years of experience.'
      : 'Tutustu Hyvän Tuulen Saunan tarinaan. Olemme tarjonneet saunalauttaristeilyjä ja saunaelämyksiä Helsingissä jo vuodesta 2018. 8 vuoden kokemuksella huippusaunaelämyksiä.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/toiminnastamme`,
        'en-US': `${SITE_URL}/en/toiminnastamme`,
        'en-GB': `${SITE_URL}/en/toiminnastamme`,
        'x-default': `${SITE_URL}/toiminnastamme`,
      },
    },
    openGraph: {
      title: isEn
        ? 'About Us | Hyvän Tuulen Sauna'
        : 'Toiminnastamme | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Discover our story. Sauna boat cruises in Helsinki with 8 years of experience.'
        : 'Tutustu tarinaamme. 8 vuoden kokemuksella saunalauttaristeilyjä Helsingissä.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-crew.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Hyvän Tuulen Sauna team'
            : 'Hyvän Tuulen Saunan tiimi',
        },
      ],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/toiminnastamme`;

  const storyContent = getStoryContent(safeLocale);
  const trustBadges = getTrustBadges(safeLocale);

  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'About Us' : 'Toiminnastamme', url: pageUrl }
  ]);

  const articleSchema = generateArticleSchema(
    isEn ? 'About Us | Hyvän Tuulen Sauna Oy' : 'Toiminnastamme | Hyvän Tuulen Sauna Oy',
    isEn
      ? 'Discover the story of Hyvän Tuulen Sauna. We have offered sauna boat cruises and sauna experiences in Helsinki since 2018.'
      : 'Tutustu Hyvän Tuulen Saunan tarinaan. Olemme tarjonneet saunalauttaristeilyjä ja saunaelämyksiä Helsingissä jo vuodesta 2018.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isEn ? 'About Us' : 'Toiminnastamme',
    description: isEn
      ? 'The story, values and team of Hyvän Tuulen Sauna.'
      : 'Hyvän Tuulen Saunan tarina, arvot ja tiimi.',
    url: pageUrl,
    mainEntity: {
      '@id': `${SITE_URL}/#organization`
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
              {isEn ? 'Updated' : 'Päivitetty'} {new Date(DATE_MODIFIED).toLocaleDateString(isEn ? 'en-GB' : 'fi-FI')}
            </p>
            <p className="text-stone-700 leading-relaxed">
              {isEn ? (
                <>
                  <strong className="text-stone-900">Hyvän Tuulen Sauna has offered sauna boat cruises in Helsinki since 2018.</strong>{' '}
                  With eight years of experience, we provide maritime sauna experiences in the Eastern Helsinki archipelago.
                  Our skippers Kalle, Onni, Ile and Tuure make sure every{' '}
                  <Link href="/en/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">sauna boat cruise</Link> is safe and unforgettable.
                  Our work is built on authenticity, closeness to the sea and community.
                </>
              ) : (
                <>
                  <strong className="text-stone-900">Hyvän Tuulen Sauna on tarjonnut saunalauttaristeilyjä Helsingissä jo vuodesta 2018.</strong>{' '}
                  Kahdeksan vuoden kokemuksella tuotamme merellisiä saunaelämyksiä Itä-Helsingin saaristossa.
                  Tiimimme kipparit Kalle, Onni, Ile ja Tuure varmistavat, että jokainen{' '}
                  <Link href="/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">saunalauttaristeily</Link> on turvallinen ja unohtumaton.
                  Toimintamme perustuu aitouteen, meren läheisyyteen ja yhteisöllisyyteen.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Story' : 'Tarina'}
              </p>
              <h2 className="font-corben text-3xl font-bold text-stone-900 mb-8 md:text-4xl">
                {isEn ? 'Our story' : 'Meidän tarinamme'}
              </h2>
              <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
                {storyContent.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/crew2.webp"
                alt={isEn ? 'The story of Hyvän Tuulen Sauna' : 'Hyvän Tuulen Saunan tarina'}
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
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Values' : 'Arvot'}
            </p>
            <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
              {isEn ? 'Our values' : 'Arvomme'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">{isEn ? 'Authenticity' : 'Aitous'}</h3>
              <p className="text-stone-600">
                {isEn
                  ? 'A traditional wood-fired sauna and genuine Finnish sauna culture'
                  : 'Perinteinen puulämmitteinen sauna ja aito suomalainen saunakulttuuri'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌊</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">{isEn ? 'Sea' : 'Meri'}</h3>
              <p className="text-stone-600">
                {isEn
                  ? 'A maritime setting and a connection to the water all year round'
                  : 'Merellinen ympäristö ja yhteys veteen ympäri vuoden'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">{isEn ? 'Community' : 'Yhteisö'}</h3>
              <p className="text-stone-600">
                {isEn
                  ? 'Togetherness, a great atmosphere and a comfortable vibe for everyone'
                  : 'Yhdessäolo, hyvä tunnelma ja kaikille mukava ilmapiiri'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
