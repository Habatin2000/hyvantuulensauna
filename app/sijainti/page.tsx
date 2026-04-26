import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import { locationPageHero } from '@/content/pages';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { generateBreadcrumbSchema, generateHowToSchema } from '../schema';

const PAGE_URL = 'https://hyvantuulensauna.fi/sijainti';
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Sijainti | Hyvän Tuulen Sauna Aurinkolahdessa',
  description: 'Tule käymään Kalkkihiekantorille Aurinkolahteen! Saunamme sijaitsee meren rannalla, helposti saavutettavissa julkisilla. Katso tarkat saapumisohjeet.',

  alternates: {
    canonical: '/sijainti',
  },
  openGraph: {
    title: 'Sijainti | Hyvän Tuulen Sauna',
    description: 'Tule käymään Kalkkihiekantorille Aurinkolahteen! Meren rannalla sijaitseva sauna.',
    url: 'https://hyvantuulensauna.fi/sijainti',
    images: [
      {
        url: '/images/location-map.png',
        width: 1200,
        height: 630,
        alt: 'Hyvän Tuulen Saunan sijainti Aurinkolahdessa',
      },
    ],
  },
};

export default function LocationPage() {
  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Etusivu', url: 'https://hyvantuulensauna.fi' },
    { name: 'Sijainti', url: PAGE_URL }
  ]);

  const howToSchema = generateHowToSchema(
    'Saapuminen Hyvän Tuulen Saunalle',
    'Ohjeet julkisilla liikennevälineillä ja autolla Kalkkihiekantorin laivalaiturille Aurinkolahteen.',
    [
      { name: 'Metro', text: 'Mene metroasemalle Vuosaari. Kävele Kalkkihiekantorin laivalaiturille noin 10 minuuttia.' },
      { name: 'Bussi', text: 'Ota bussi 560 tai 78 ja jää pois Kalkkihiekantorin pysäkillä. Laituri on pysäkin lähellä.' },
      { name: 'Auto', text: 'Aja moottoritieltä 4 Vuosaaren liittymästä. Ilmainen pysäköinti Kalkkihiekantorilla. Saavu 10 min ennen varausta.' }
    ]
  );

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://hyvantuulensauna.fi/#location',
    name: 'Hyvän Tuulen Sauna – Kalkkihiekantorin Laivalaituri',
    description: 'Saunalauttojen lähtöpaikka ja julkisen saunan sijainti Aurinkolahdessa, Helsingissä.',
    url: PAGE_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kalkkihiekantori',
      addressLocality: 'Helsinki',
      postalCode: '00980',
      addressCountry: 'FI'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 60.198930,
      longitude: 25.141096
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, howToSchema, localBusinessSchema]),
        }}
      />

      <HeroSection content={locationPageHero} variant="page" />

      {/* AI-optimized answer block */}
      <section className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="rounded-xl bg-white border border-stone-200 p-6 md:p-8 text-left">
            <p className="text-sm text-stone-500 mb-4">
              Päivitetty {new Date(DATE_MODIFIED).toLocaleDateString('fi-FI')}
            </p>
            <p className="text-stone-700 leading-relaxed">
              <strong className="text-stone-900">Hyvän Tuulen Sauna sijaitsee Kalkkihiekantorin laivalaiturissa Aurinkolahdessa, Helsingissä.</strong>{' '}
              Saavu metrolla Vuosaareen (kävely 10 min) tai busseilla 560 ja 78. Autolla aja moottoritieltä 4 Vuosaaren liittymästä – 
              ilmainen pysäköinti torilla. Täältä lähtevät <a href="/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">saunalauttaristeilyt</a> ja 
              <a href="/julkinen-sauna" className="text-[#3b82f6] hover:underline"> julkiset saunavuorot</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl bg-stone-50 p-6">
              <MapPin className="h-8 w-8 text-[#3b82f6] mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">Osoite</h3>
              <p className="text-stone-600">Kalkkihiekantori</p>
              <p className="text-stone-600">00980 Helsinki</p>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Phone className="h-8 w-8 text-[#3b82f6] mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">Puhelin</h3>
              <a href="tel:+358442313546" className="text-[#3b82f6] hover:underline">
                +358 44 231 3546
              </a>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Mail className="h-8 w-8 text-[#3b82f6] mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">Sähköposti</h3>
              <a href="mailto:info@hyvantuulensauna.fi" className="text-[#3b82f6] hover:underline">
                info@hyvantuulensauna.fi
              </a>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Clock className="h-8 w-8 text-[#3b82f6] mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">Aukiolo</h3>
              <p className="text-stone-600">Varauksen mukaan</p>
              <p className="text-stone-600">Katso kalenteri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="kartta" className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-stone-900">Saapumisohjeet</h2>
            <p className="mt-4 text-stone-600">
              Olemme helposti saavutettavissa julkisilla liikennevälineillä ja autolla
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-video bg-stone-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.0!2d25.1411!3d60.1989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKalkkihiekantorin%20Laivalaituri!5e0!3m2!1sfi!2sfi!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hyvän Tuulen Saunan sijainti"
            />
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="rounded-xl bg-white p-6">
              <h3 className="text-xl font-bold text-stone-900 mb-4">Julkisilla</h3>
              <ul className="space-y-3 text-stone-600">
                <li>• Metro: Vuosaari, kävely n. 10 min</li>
                <li>• Bussi: 560, 78 - pysäkki Kalkkihiekantori</li>
                <li>• Raitiovaunu: 11 (kesäkaudella)</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white p-6">
              <h3 className="text-xl font-bold text-stone-900 mb-4">Autolla</h3>
              <ul className="space-y-3 text-stone-600">
                <li>• Moottoritieltä 4 Vuosaaren liittymä</li>
                <li>• Ilmainen pysäköinti Kalkkihiekantorilla</li>
                <li>• Saavuthan paikalle 10 min ennen varaustasi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
