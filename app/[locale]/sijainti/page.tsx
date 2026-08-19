import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/sections/HeroSection';
import { getLocationPageHero } from '@/content/pages';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { generateBreadcrumbSchema, generateHowToSchema } from '../schema';
import LocationTracker from '@/components/analytics/LocationTracker';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/sijainti`;

  return {
    title: isEn
      ? 'Location in Aurinkolahti, Helsinki'
      : 'Sijainti Aurinkolahdessa, Helsinki',
    description: isEn
      ? 'Come visit us at Kalkkihiekantori in Aurinkolahti! Our sauna is located by the sea and is easily accessible by public transport. See detailed arrival instructions.'
      : 'Tule käymään Kalkkihiekantorille Aurinkolahteen! Saunamme sijaitsee meren rannalla, helposti saavutettavissa julkisilla. Katso tarkat saapumisohjeet.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/sijainti`,
        'en-US': `${SITE_URL}/en/sijainti`,
        'en-GB': `${SITE_URL}/en/sijainti`,
        'x-default': `${SITE_URL}/sijainti`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Location | Hyvän Tuulen Sauna'
        : 'Sijainti | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Come visit us at Kalkkihiekantori in Aurinkolahti! A sauna by the sea.'
        : 'Tule käymään Kalkkihiekantorille Aurinkolahteen! Meren rannalla sijaitseva sauna.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/location-map.png',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Hyvän Tuulen Sauna location in Aurinkolahti'
            : 'Hyvän Tuulen Saunan sijainti Aurinkolahdessa',
        },
      ],
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/sijainti`;

  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Location' : 'Sijainti', url: pageUrl }
  ]);

  const howToSchema = generateHowToSchema(
    isEn ? 'Getting to Hyvän Tuulen Sauna' : 'Saapuminen Hyvän Tuulen Saunalle',
    isEn
      ? 'Instructions for reaching the Kalkkihiekantori boat pier in Aurinkolahti by public transport and by car.'
      : 'Ohjeet julkisilla liikennevälineillä ja autolla Kalkkihiekantorin laivalaiturille Aurinkolahteen.',
    isEn ? [
      { name: 'Metro', text: 'Go to Vuosaari metro station. Walk to the Kalkkihiekantori boat pier in about 10 minutes.' },
      { name: 'Bus', text: 'Take bus 560 or 78 and get off at the Kalkkihiekantori stop. The pier is near the stop.' },
      { name: 'Car', text: 'Free parking at Kalkkihiekantori. Arrive 10 minutes before your booking.' }
    ] : [
      { name: 'Metro', text: 'Mene metroasemalle Vuosaari. Kävele Kalkkihiekantorin laivalaiturille noin 10 minuuttia.' },
      { name: 'Bussi', text: 'Ota bussi 560 tai 78 ja jää pois Kalkkihiekantorin pysäkillä. Laituri on pysäkin lähellä.' },
      { name: 'Auto', text: 'Ilmainen pysäköinti Kalkkihiekantorilla. Saavu 10 min ennen varausta.' }
    ]
  );

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#location`,
    name: isEn
      ? 'Hyvän Tuulen Sauna – Kalkkihiekantori Boat Pier'
      : 'Hyvän Tuulen Sauna – Kalkkihiekantorin Laivalaituri',
    description: isEn
      ? 'Departure point for the sauna boats and location of the public sauna in Aurinkolahti, Helsinki.'
      : 'Saunalauttojen lähtöpaikka ja julkisen saunan sijainti Aurinkolahdessa, Helsingissä.',
    url: pageUrl,
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

      <LocationTracker />
      <HeroSection content={getLocationPageHero(safeLocale)} variant="page" />

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
                  <strong className="text-stone-900">Hyvän Tuulen Sauna is located at the Kalkkihiekantori boat pier in Aurinkolahti, Helsinki.</strong>{' '}
                  Arrive by metro to Vuosaari (10 min walk) or by buses 560 and 78. Free parking at the square. This is where the <Link href="/en/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">sauna boat cruises</Link> and
                  <Link href="/en/julkinen-sauna" className="text-[#3b82f6] hover:underline"> public sauna sessions</Link> depart from.
                </>
              ) : (
                <>
                  <strong className="text-stone-900">Hyvän Tuulen Sauna sijaitsee Kalkkihiekantorin laivalaiturissa Aurinkolahdessa, Helsingissä.</strong>{' '}
                  Saavu metrolla Vuosaareen (kävely 10 min) tai busseilla 560 ja 78. Ilmainen pysäköinti torilla. Täältä lähtevät <Link href="/saunalauttaristeilyt-helsingissa" className="text-[#3b82f6] hover:underline">saunalauttaristeilyt</Link> ja
                  <Link href="/julkinen-sauna" className="text-[#3b82f6] hover:underline"> julkiset saunavuorot</Link>.
                </>
              )}
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
              <h3 className="font-semibold text-stone-900 mb-2">{isEn ? 'Address' : 'Osoite'}</h3>
              <p className="text-stone-600">Kalkkihiekantori</p>
              <p className="text-stone-600">00980 Helsinki</p>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Phone className="h-8 w-8 text-[#3b82f6] mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">{isEn ? 'Phone' : 'Puhelin'}</h3>
              <a href="tel:+358442313546" className="text-[#3b82f6] hover:underline">
                +358 44 231 3546
              </a>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Mail className="h-8 w-8 text-[#3b82f6] mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">{isEn ? 'Email' : 'Sähköposti'}</h3>
              <a href="mailto:info@hyvantuulensauna.fi" className="text-[#3b82f6] hover:underline">
                info@hyvantuulensauna.fi
              </a>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Clock className="h-8 w-8 text-[#3b82f6] mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">{isEn ? 'Opening hours' : 'Aukiolo'}</h3>
              <p className="text-stone-600">{isEn ? 'By appointment' : 'Varauksen mukaan'}</p>
              <p className="text-stone-600">{isEn ? 'See calendar' : 'Katso kalenteri'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id={isEn ? 'map' : 'kartta'} className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-stone-900">{isEn ? 'Getting here' : 'Saapumisohjeet'}</h2>
            <p className="mt-4 text-stone-600">
              {isEn
                ? 'We are easily accessible by public transport and by car'
                : 'Olemme helposti saavutettavissa julkisilla liikennevälineillä ja autolla'}
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
              title={isEn ? 'Hyvän Tuulen Sauna location' : 'Hyvän Tuulen Saunan sijainti'}
            />
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="rounded-xl bg-white p-6">
              <h3 className="text-xl font-bold text-stone-900 mb-4">{isEn ? 'Public transport' : 'Julkisilla'}</h3>
              <ul className="space-y-3 text-stone-600">
                {isEn ? (
                  <>
                    <li>• Metro: Vuosaari, approx. 10 min walk</li>
                    <li>• Bus: 560, 78 – Kalkkihiekantori stop</li>
                    <li>• Tram: 11 (summer season)</li>
                  </>
                ) : (
                  <>
                    <li>• Metro: Vuosaari, kävely n. 10 min</li>
                    <li>• Bussi: 560, 78 - pysäkki Kalkkihiekantori</li>
                    <li>• Raitiovaunu: 11 (kesäkaudella)</li>
                  </>
                )}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-6">
              <h3 className="text-xl font-bold text-stone-900 mb-4">{isEn ? 'By car' : 'Autolla'}</h3>
              <ul className="space-y-3 text-stone-600">
                {isEn ? (
                  <>
                    <li>• Free parking at Kalkkihiekantori</li>
                    <li>• Please arrive 10 minutes before your booking</li>
                  </>
                ) : (
                  <>
                    <li>• Ilmainen pysäköinti Kalkkihiekantorilla</li>
                    <li>• Saavuthan paikalle 10 min ennen varaustasi</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
