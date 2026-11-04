import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/sections/HeroSection';
import { getLocationPageHero } from '@/content/pages';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { generateBreadcrumbSchema, generateHowToSchema } from '../schema';
import LocationTracker from '@/components/analytics/LocationTracker';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const DATE_MODIFIED = '2026-11-03';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/location' : '/sijainti'}`;

  return {
    title: isEn
      ? 'Sauna in Puotila, Helsinki'
      : 'Sauna Helsingin Puotilassa',
    description: isEn
      ? 'Find Hyvän Tuulen Sauna at Meripellontie 11C in Puotila, Helsinki. See our location and directions, and plan your visit by public transport.'
      : 'Löydä Hyvän Tuulen Sauna Helsingin Puotilasta, Meripellontie 11C. Katso sijainti ja saapumisohjeet sekä suunnittele matkasi meren äärelle.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/sijainti`,
        'en-US': `${SITE_URL}/en/location`,
        'en-GB': `${SITE_URL}/en/location`,
        'x-default': `${SITE_URL}/sijainti`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Location | Hyvän Tuulen Sauna'
        : 'Sijainti | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Come visit us at Meripellontie in Puotila! A sauna by the sea.'
        : 'Tule käymään Meripellontielle Puotilaan! Meren rannalla sijaitseva sauna.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/location-map.png',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Hyvän Tuulen Sauna location in Puotila'
            : 'Hyvän Tuulen Saunan sijainti Puotilassa',
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
  const pageUrl = `${SITE_URL}${isEn ? '/en/location' : '/sijainti'}`;

  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Location' : 'Sijainti', url: pageUrl }
  ]);

  const howToSchema = generateHowToSchema(
    isEn ? 'Getting to Hyvän Tuulen Sauna' : 'Saapuminen Hyvän Tuulen Saunalle',
    isEn
      ? 'Instructions for reaching the Meripellontie pier in Puotila by public transport and by car.'
      : 'Ohjeet julkisilla liikennevälineillä ja autolla Meripellontien laiturille Puotilaan.',
    isEn ? [
      { name: 'Metro', text: 'Go to Rastila metro station. Walk along Meripellontie to the pier in about 15 minutes.' },
      { name: 'Bus', text: 'Several buses stop right by Meripellontie in Puotila. Get off at the Meripellontie stop.' },
      { name: 'Car', text: 'Plenty of 4-hour disc parking along Meripellontie. Arrive a few minutes before your session.' }
    ] : [
      { name: 'Metro', text: 'Mene metroasemalle Rastila. Kävele Meripellontietä pitkin laiturille noin 15 minuuttia.' },
      { name: 'Bussi', text: 'Useat bussit pysähtyvät aivan Meripellontien viereen Puotilassa. Jää pois Meripellontien pysäkillä.' },
      { name: 'Auto', text: 'Meripellontien varrella on paljon 4 tunnin kiekkopaikkoja. Saavu paikalle muutama minuutti ennen vuoroasi.' }
    ]
  );

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#location`,
    name: isEn
      ? 'Hyvän Tuulen Sauna – Meripellontie Pier'
      : 'Hyvän Tuulen Sauna – Meripellontien laituri',
    description: isEn
      ? 'Winter sauna location and ice hole at Meripellontie in Puotila, Helsinki. In summer the sauna boats depart from Kalkkihiekantori in Aurinkolahti.'
      : 'Talvisaunojen ja avannon sijainti Meripellontiellä Puotilassa, Helsingissä. Kesällä saunalautat lähtevät Kalkkihiekantorilta Aurinkolahdesta.',
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Meripellontie 11C',
      addressLocality: 'Helsinki',
      postalCode: '00970',
      addressCountry: 'FI'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 60.2078110,
      longitude: 25.1059710
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
                  <strong className="text-stone-900">In winter, Hyvän Tuulen Sauna is located at Meripellontie 11C in Puotila, Helsinki.</strong>{' '}
                  Arrive by metro to Rastila (15 min walk) or by bus, which stops right by Meripellontie. There is plenty of 4-hour disc parking along the street. This is where the <Link href="/julkinen-sauna" className="text-lake hover:underline">public sauna sessions</Link>, the <Link href="/avanto" className="text-lake hover:underline">ice hole</Link> and the <Link href="/avanto" className="text-lake hover:underline">private winter saunas</Link> are. In summer the sauna boat cruises depart from Kalkkihiekantori in Aurinkolahti.
                </>
              ) : (
                <>
                  <strong className="text-stone-900">Talvella Hyvän Tuulen Sauna sijaitsee osoitteessa Meripellontie 11C Puotilassa, Helsingissä.</strong>{' '}
                  Saavu metrolla Rastilaan (kävely 15 min) tai bussilla, joka pysähtyy aivan Meripellontien viereen. Kadun varrella on paljon 4 tunnin kiekkopaikkoja. Täällä sijaitsevat <Link href="/julkinen-sauna" className="text-lake hover:underline">yleiset saunavuorot</Link>, <Link href="/avanto" className="text-lake hover:underline">avanto</Link> ja <Link href="/avanto" className="text-lake hover:underline">yksityiset talvisaunat</Link>. Kesällä saunalauttaristeilyt lähtevät Kalkkihiekantorilta Aurinkolahdesta.
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
              <MapPin className="h-8 w-8 text-lake mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">{isEn ? 'Address (winter season)' : 'Osoite (talvikausi)'}</h3>
              <p className="text-stone-600">Meripellontie 11C</p>
              <p className="text-stone-600">00970 Helsinki</p>
              <p className="mt-2 text-xs text-stone-500">
                {isEn ? 'Summer: Kalkkihiekantori, 00980 Helsinki' : 'Kesällä: Kalkkihiekantori, 00980 Helsinki'}
              </p>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Phone className="h-8 w-8 text-lake mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">{isEn ? 'Phone' : 'Puhelin'}</h3>
              <a href="tel:+358442313546" className="text-lake hover:underline">
                +358 44 231 3546
              </a>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Mail className="h-8 w-8 text-lake mb-4" />
              <h3 className="font-semibold text-stone-900 mb-2">{isEn ? 'Email' : 'Sähköposti'}</h3>
              <a href="mailto:info@hyvantuulensauna.fi" className="text-lake hover:underline">
                info@hyvantuulensauna.fi
              </a>
            </div>
            <div className="rounded-xl bg-stone-50 p-6">
              <Clock className="h-8 w-8 text-lake mb-4" />
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
              src="https://www.google.com/maps?q=Meripellontie%2011C%2C%2000970%20Helsinki&output=embed"
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
                    <li>• Metro: Rastila, about 15 min walk along Meripellontie</li>
                    <li>• Bus: several buses stop right by Meripellontie in Puotila</li>
                  </>
                ) : (
                  <>
                    <li>• Metro: Rastila, kävely n. 15 min Meripellontietä pitkin</li>
                    <li>• Bussi: useat bussit pysähtyvät aivan Meripellontien viereen Puotilassa</li>
                  </>
                )}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-6">
              <h3 className="text-xl font-bold text-stone-900 mb-4">{isEn ? 'By car' : 'Autolla'}</h3>
              <ul className="space-y-3 text-stone-600">
                {isEn ? (
                  <>
                    <li>• Plenty of 4-hour disc parking along Meripellontie</li>
                    <li>• Please arrive a few minutes before your session starts</li>
                  </>
                ) : (
                  <>
                    <li>• Meripellontien varrella on paljon 4 tunnin kiekkopaikkoja</li>
                    <li>• Saavuthan paikalle muutama minuutti ennen vuorosi alkua</li>
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
