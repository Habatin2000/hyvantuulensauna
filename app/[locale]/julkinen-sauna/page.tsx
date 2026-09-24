import type { Metadata } from 'next';
import Image from 'next/image';
import HeroSection from '@/components/sections/HeroSection';
import PublicBookingWidget from '@/components/booking/PublicBookingWidget';
import SubscriptionPurchase from '@/components/booking/SubscriptionPurchase';
import MiniCruiseSection from '@/components/sections/MiniCruiseSection';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import AnimatedSection from '@/components/AnimatedSection';
import { getPublicPageHero } from '@/content/pages';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema, generateEventSchema, generateHowToSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-sauna-group.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-09-24';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/public-sauna-helsinki' : '/julkinen-sauna'}`;

  return {
    title: isEn
      ? 'Public Sauna in Helsinki by the Sea | Hyvän Tuulen Sauna'
      : 'Julkinen sauna Helsingissä meren äärellä | Hyvän Tuulen Sauna',
    description: isEn
      ? 'Come to a public sauna session by the sea in Aurinkolahti! Authentic wood-fired sauna, swimming and great vibes. Book your spot now – Helsinki\'s most unique public sauna experience.'
      : 'Tule julkiselle saunavuorolle meren äärelle Aurinkolahteen! Aito puulämmitteinen sauna, uinti ja hyvä tunnelma. Varaa paikkasi nyt – Helsingin uniikein julkinen saunaelämys.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/julkinen-sauna`,
        'en-US': `${SITE_URL}/en/public-sauna-helsinki`,
        'en-GB': `${SITE_URL}/en/public-sauna-helsinki`,
        'x-default': `${SITE_URL}/julkinen-sauna`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Public Sauna in Helsinki | Hyvän Tuulen Sauna'
        : 'Julkinen Sauna Helsingissä | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Come to a public sauna session by the sea! Authentic wood-fired sauna and swimming.'
        : 'Tule julkiselle saunavuorolle meren äärelle! Aito puulämmitteinen sauna ja uinti.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-sauna-group.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Public sauna in Helsinki - Hyvän Tuulen Sauna'
            : 'Julkinen sauna Helsingissä - Hyvän Tuulen Sauna',
        },
      ],
    },
  };
}

export default async function PublicSaunaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';

  const faqItems = getFAQsByCategory('public', safeLocale);
  const publicPageHero = getPublicPageHero(safeLocale);
  const pageUrl = `${SITE_URL}${isEn ? '/en/public-sauna-helsinki' : '/julkinen-sauna'}`;

  const serviceSchema = generateServiceSchema(
    isEn ? 'Public sauna in Helsinki' : 'Julkinen sauna Helsingissä',
    isEn
      ? 'Open sauna sessions for the public in Aurinkolahti. Wood-fired sauna and swimming by the sea.'
      : 'Avoimet saunavuorot yleisölle Aurinkolahdessa. Puulämmitteinen sauna ja uinti meren äärellä.',
    pageUrl,
    PAGE_IMAGE
  );

  const articleSchema = generateArticleSchema(
    isEn ? 'Public Sauna in Helsinki | Sauna Session by the Sea' : 'Julkinen Sauna Helsingissä | Saunavuoro Merellä',
    isEn
      ? 'Come to a public sauna session by the sea in Aurinkolahti! Authentic wood-fired sauna, swimming and great vibes.'
      : 'Tule julkiselle saunavuorolle meren äärelle Aurinkolahteen! Aito puulämmitteinen sauna, uinti ja hyvä tunnelma.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const eventSchema = generateEventSchema(
    isEn ? 'Public sauna session at Hyvän Tuulen Sauna' : 'Julkinen saunavuoro Hyvän Tuulen Saunalla',
    isEn
      ? 'Open sauna session in a maritime environment in Aurinkolahti. Two saunas, grill, SUP boards and great vibes.'
      : 'Avoin saunavuoro merellisessä ympäristössä Aurinkolahdessa. Kaksi saunaa, grilli, sup-laudat ja loistava tunnelma.',
    pageUrl,
    PAGE_IMAGE,
    '2026-05-10T10:00:00+03:00',
    '2026-09-30T20:00:00+03:00',
    isEn ? 'Kalkkihiekantori boat pier' : 'Kalkkihiekantorin laivalaituri',
    '15',
    '2026-05-10'
  );

  const howToSchema = generateHowToSchema(
    isEn ? 'Preparing for a public sauna session' : 'Valmistautuminen julkiselle saunavuorolle',
    isEn
      ? 'What to bring and what the sauna session includes at Hyvän Tuulen Sauna.'
      : 'Mitä tarvitset mukaan ja mitä saunavuoro sisältää Hyvän Tuulen Saunalla.',
    isEn ? [
      { name: 'Own towel', text: 'Bring your own towel or rent one from us on site.' },
      { name: 'Swimwear', text: 'Pack swimwear or shorts for the maritime sauna experience.' },
      { name: 'Sandals', text: 'Sandals or indoor shoes make it easier to move around the dock and boat.' },
      { name: 'Water bottle', text: 'Own water bottle is handy – we also sell cold drinks on site.' }
    ] : [
      { name: 'Oma pyyhe', text: 'Ota oma pyyhe mukaan tai vuokraa meiltä paikan päällä.' },
      { name: 'Uimapuvut', text: 'Pakkaa uimapuvut tai shortsit merellistä saunakokemusta varten.' },
      { name: 'Sandaalit', text: 'Sandaalit tai sisäkengät helpottavat liikkumista laiturilla ja lautalla.' },
      { name: 'Juomapullo', text: 'Oma juomapullo on kätevä – myymme myös kylmiä juomia paikan päällä.' }
    ]
  );

  const faqSchema = generateFAQSchema(
    faqItems.map(item => ({ question: item.question, answer: item.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Public Sauna' : 'Julkinen sauna', url: pageUrl }
  ]);

  const bringItems = isEn ? [
    'Towel',
    'Swimwear',
    'Sandals',
    'Water bottle or water',
    'Weather-appropriate clothing',
  ] : [
    'Pyyhe',
    'Uimapuku',
    'Sandaalit',
    'Juomapullo tai vettä',
    'Sään mukainen vaatetus',
  ];

  const includedItems = isEn ? [
    'Boat transfer from Kalkkihiekantori to the sauna boat',
    'Two saunas',
    'Changing rooms',
    'Toilet facilities',
    'Terrace',
    'Swimming opportunity',
    'SUP boards in summer season',
  ] : [
    'Venekuljetus Kalkkihiekantorilta saunalautalle',
    'Kaksi saunaa',
    'Pukuhuoneet',
    'WC-tilat',
    'Terassi',
    'Uimamahdollisuus',
    'SUP-lautoja kesäkaudella',
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, articleSchema, eventSchema, howToSchema, faqSchema, breadcrumbSchema]),
        }}
      />

      <HeroSection
        content={publicPageHero}
        variant="page"
      />

      {/* Julkinen sauna Helsingissä – näin saunavuoro toimii */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'How it works' : 'Näin toimii'}
            </p>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Public sauna in Helsinki – how the sauna session works' : 'Julkinen sauna Helsingissä – näin saunavuoro toimii'}
            </h2>
            <div className="space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
              <p>
                {isEn
                  ? 'The public sauna session at Hyvän Tuulen Sauna is a low-threshold way to enjoy the sauna in Helsinki. You do not need your own group or a private booking – you can book a spot for a single sauna session and join in.'
                  : 'Hyvän Tuulen Saunan julkinen saunavuoro on matalan kynnyksen tapa nauttia saunasta Helsingissä. Et tarvitse omaa porukkaa tai yksityistä varausta, vaan voit varata paikan yksittäiselle saunavuorolle ja tulla mukaan.'}
              </p>
              <p>
                {isEn
                  ? 'The sauna session lasts two hours. You travel to the sauna by boat from Kalkkihiekantori pier, so the sauna experience also includes a small maritime transfer.'
                  : 'Saunavuoro kestää kaksi tuntia. Saunalle kuljetaan Kalkkihiekantorin laiturilta veneellä, joten itse saunomiseen kuuluu myös pieni merellinen siirtymä.'}
              </p>
              <p>
                {isEn
                  ? 'On board you have access to two saunas, changing rooms, toilet facilities and a terrace. In summer you can take a dip and SUP boards are also available during the sauna session.'
                  : 'Lautalla käytössäsi on kaksi saunaa, pukuhuoneet, WC-tilat ja terassi. Kesäkaudella voit pulahtaa uimaan ja SUP-laudoille pääsee myös saunavuoron aikana.'}
              </p>
              <p className="font-semibold text-stone-800">
                {isEn
                  ? 'The public sauna is for you if you want to get to the sauna easily in Helsinki without booking your own sauna space.'
                  : 'Julkinen sauna on tarkoitettu sinulle, joka haluat helposti saunaan Helsingissä ilman oman saunatilan varaamista.'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Miksi tulla julkiselle saunavuorolle? */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="font-corben mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Why come to a public sauna session?' : 'Miksi tulla julkiselle saunavuorolle?'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: isEn ? 'Sauna by the sea' : 'Sauna merellä',
                  text: isEn
                    ? 'Instead of an ordinary sauna session, here you sauna in the Helsinki archipelago. The terrace opens to a sea view, and between löyly sessions you can take a dip.'
                    : 'Tavallisen saunavuoron sijaan täällä saunotaan Helsingin saaristossa. Saunan terassilta avautuu merimaisema, ja löylyjen välissä voi pulahtaa uimaan.',
                },
                {
                  title: isEn ? 'Easy to join' : 'Helppo tulla',
                  text: isEn
                    ? 'You can come alone, as a couple or with a group of friends. Just book your spot for a suitable sauna session and arrive at Kalkkihiekantori.'
                    : 'Voit tulla yksin, kaksin tai kaveriporukalla. Varaa vain oma paikkasi sopivalta saunavuorolta ja saavu Kalkkihiekantorille.',
                },
                {
                  title: isEn ? 'Two saunas' : 'Kaksi saunaa',
                  text: isEn
                    ? 'During the public session you have access to two saunas, so there is plenty of room for sauna and variety.'
                    : 'Julkisella vuorolla käytössä on kaksi saunaa, joten tilaa löytyy saunomiseen ja vaihteluun.',
                },
                {
                  title: isEn ? 'Sauna and sea in one experience' : 'Sauna ja meri samassa kokemuksessa',
                  text: isEn
                    ? 'In summer swimming and SUP boards are part of the experience. Here sauna is as much about being at sea as enjoying the löyly.'
                    : 'Kesällä uinti ja SUP-laudat kuuluvat elämykseen. Saunominen on täällä yhtä paljon merellä olemista kuin löylyistä nauttimista.',
                },
                {
                  title: isEn ? 'Reasonable price' : 'Kohtuullinen hinta',
                  text: isEn
                    ? 'A public sauna session is an affordable way to experience Hyvän Tuulen Sauna without booking a private sauna boat.'
                    : 'Julkinen saunavuoro on edullinen tapa päästä kokemaan Hyvän Tuulen Sauna ilman yksityisen saunalautan varaamista.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600 md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking Widget */}
      <section id={isEn ? 'booking' : 'varaus'} className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Book your spot' : 'Varaa paikkasi'}
            </p>
            <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
              {isEn ? 'Summer public sauna sessions' : 'Kesän julkiset saunavuorot'}
            </h2>

            <div className="mt-4 text-stone-600 max-w-2xl mx-auto space-y-4">
              <p>
                {isEn
                  ? 'Public sauna sessions at Hyvän Tuulen Sauna are probably the most unique way in Helsinki to enjoy the sea and the warmth of a sauna.'
                  : 'Saunavuorot Hyvän Tuulen Saunalla ovat varmaankin Helsingin uniikein tapa päästä nauttimaan merestä ja saunan lämmöstä.'}
              </p>
              <p>
                {isEn
                  ? "Here's how it works: we will pick you up by boat at the agreed time from Kalkkihiekantori boat pier and transport you to the sauna boat. The boat has two hot saunas and a grill. We also sell cold drinks. The sauna session lasts two hours, SUP boards are available and the atmosphere is guaranteed great. These are the summer's finest low-threshold sauna sessions ❤️"
                  : 'Homma toimii näin: tulemme hakemaan teidät sovittuun aikaan veneellä Kalkkihiekantorin laivalaiturista, ja kuljetamme teidät saunalautalle. Lautalla on kuumana kaksi saunaa ja grilli. Myymme myös kylmiä juomia. Saunavuoro kestää kaksi tuntia, käytössä on myös sup-lautoja ja tunnelma on taatusti loistava. Nämä ovat kesän hienoimpia matalan kynnyksen saunavuoroja ❤️'}
              </p>
            </div>
          </div>

          {/* Grill notice */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
              <p className="text-amber-900 font-semibold">
                {isEn
                  ? 'NOTE: Own food for grilling is not allowed on public sauna sessions – the grill is operated by our skippers.'
                  : 'HUOM: Omat grillattavat eivät ole sallittuja julkisella saunavuorolla – grilliä pyörittävät kipparimme.'}
              </p>
            </div>
          </div>

          {/* Small pricing above calendar */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <div className="rounded-xl bg-white border border-stone-200 px-5 py-3 text-center">
              <span className="text-lg font-bold text-[#3b82f6]">15€</span>
              <span className="text-sm text-stone-500 ml-1">/ 2h</span>
            </div>
            <div className="rounded-xl bg-white border border-stone-200 px-5 py-3 text-center">
              <span className="text-lg font-bold text-[#3b82f6]">12.5€</span>
              <span className="text-sm text-stone-500 ml-1">
                {isEn ? '/ 2h students & seniors' : '/ 2h opiskelijat & eläkeläiset'}
              </span>
            </div>
          </div>

          {/* Kids pricing info */}
          <div className="mb-4 max-w-xl mx-auto">
            <div className="rounded-xl bg-[#3b82f6]/5 border border-[#3b82f6]/20 p-4 text-center">
              <p className="text-sm font-medium text-[#3b82f6]">
                {isEn
                  ? 'Kids on board? Children get student pricing <3! (under 15)'
                  : 'Lapset mukaan lautalle? Lapset opiskelijahinnalla <3! (alle 15v)'}
              </p>
            </div>
          </div>

          {/* E-pass info */}
          <div className="mb-8 max-w-xl mx-auto">
            <a
              href="https://wa.me/358442313546"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-center transition-colors hover:bg-green-100"
            >
              <span className="text-sm font-medium text-green-900">
                {isEn
                  ? 'Paying with e-pass? Send a message on WhatsApp!'
                  : 'Maksu e-passilla? Lähetä viesti WhatsAppiin!'}
              </span>
            </a>
          </div>

          <p className="mb-4 text-center text-sm font-medium text-stone-700">
            {isEn ? '1. Choose a session · 2. Book your spot · 3. Arrive at Kalkkihiekantori on time' : '1. Valitse vuoro · 2. Varaa paikkasi · 3. Saavu Kalkkihiekantorille ajoissa'}
          </p>

          <PublicBookingWidget locale={safeLocale} />

          {/* 10 x sauna card */}
          <div className="mt-12 max-w-md mx-auto">
            <SubscriptionPurchase locale={safeLocale} />
          </div>

          {/* Mini Cruise */}
          <div className="mt-12 max-w-4xl mx-auto">
            <MiniCruiseSection locale={safeLocale} />
          </div>
        </div>
      </section>

      {/* Saunavuorot Helsingissä + Saunominen merellä */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Sessions' : 'Vuorot'}
            </p>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Sauna sessions in Helsinki' : 'Saunavuorot Helsingissä'}
            </h2>
            <p className="mb-8 text-center text-stone-600 md:text-lg">
              {isEn
                ? 'Public sauna sessions are organized several times a week during the season. You can see the up-to-date days and free spots in the booking calendar. Green-marked days are bookable.'
                : 'Julkiset saunavuorot järjestetään kauden aikana useita kertoja viikossa. Ajantasaiset päivät ja vapaat paikat näet varauskalenterista. Vihreällä merkityt päivät ovat varattavissa.'}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="rounded-3xl bg-white p-8 md:p-12">
              <h3 className="font-corben mb-4 text-xl font-bold text-stone-900 md:text-2xl">
                {isEn ? 'Sauna by the sea' : 'Saunominen merellä'}
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-stone-600 md:text-lg">
                <p>
                  {isEn
                    ? 'On a public sauna session, the sauna itself is only half of the experience. When the boat takes you from Kalkkihiekantori to the sauna boat, the city is left behind for a moment and the Eastern Helsinki archipelago opens around you.'
                    : 'Julkisella saunavuorolla itse saunominen on vasta puolet kokemuksesta. Kun vene vie sinut Kalkkihiekantorilta saunalautalle, kaupunki jää hetkeksi taakse ja ympärillä avautuu Itä-Helsingin saaristo.'}
                </p>
                <p>
                  {isEn
                    ? 'Between löyly sessions you can swim, sit on the terrace, enjoy the scenery or relax with other sauna-goers.'
                    : 'Löylyjen välissä voit käydä uimassa, istua terassilla, nauttia maisemista tai ottaa rennosti muiden saunojien kanssa.'}
                </p>
                <p className="font-semibold text-stone-800">
                  {isEn
                    ? 'This is a public sauna in Helsinki, but not a typical one.'
                    : 'Tämä on julkinen sauna Helsingissä, mutta ei aivan tavallinen sellainen.'}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What to bring / Included */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl bg-[#faf9f7] p-8">
                <h3 className="text-xl font-bold text-stone-900 mb-4">
                  {isEn ? 'What to bring?' : 'Mitä mukaan?'}
                </h3>
                <ul className="space-y-3 text-stone-600">
                  {bringItems.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#3b82f6]">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-[#faf9f7] p-8">
                <h3 className="text-xl font-bold text-stone-900 mb-4">
                  {isEn ? 'Included in the price' : 'Sisältyy hintaan'}
                </h3>
                <ul className="space-y-3 text-stone-600">
                  {includedItems.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#3b82f6]">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Practical instructions */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-white p-8 md:p-12">
              <h3 className="font-corben mb-6 text-xl font-bold text-stone-900 md:text-2xl">
                {isEn ? 'Practical instructions for the sauna session' : 'Saunavuoron käytännön ohjeet'}
              </h3>
              <div className="space-y-6 text-base leading-relaxed text-stone-600 md:text-lg">
                <div>
                  <h4 className="mb-2 font-bold text-stone-900">{isEn ? 'Arrival' : 'Saapuminen'}</h4>
                  <p>
                    {isEn
                      ? 'Come to Kalkkihiekantori, 00980 Helsinki. A motorboat will pick up the sauna-goers from the shore and transport them to the sauna boat.'
                      : 'Tule osoitteeseen Kalkkihiekantori, 00980 Helsinki. Moottorivene tulee hakemaan saunojat rannasta ja kuljettaa heidät saunalautalle.'}
                  </p>
                  <p className="mt-2">
                    {isEn
                      ? 'Please arrive on time so the boat transfer can leave according to schedule. If you know you will be late, let us know in advance.'
                      : 'Saavu paikalle ajoissa, jotta venekuljetus pääsee lähtemään aikataulussa. Jos tiedät myöhästyväsi, ilmoita siitä etukäteen.'}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-stone-900">{isEn ? 'Drinks and food' : 'Juomat ja ruoka'}</h4>
                  <p>
                    {isEn
                      ? 'Cold drinks are available at the sauna. Own food for grilling is not allowed on the public sauna session, as the grill and serving are handled by our skippers.'
                      : 'Kylmiä juomia on saatavilla saunalla. Omat grillattavat eivät kuulu julkiseen saunavuoroon, sillä grillistä ja tarjoilusta vastaavat kipparimme.'}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Julkinen sauna vai oma saunalautta? */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-[#faf9f7] p-8 md:p-12">
              <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl">
                {isEn ? 'Public sauna or own sauna boat?' : 'Julkinen sauna vai oma saunalautta?'}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-6">
                  <h3 className="mb-2 font-bold text-stone-900">{isEn ? 'Public sauna session' : 'Julkinen saunavuoro'}</h3>
                  <p className="text-stone-600">
                    {isEn
                      ? 'Want to get to the sauna easily without booking a group? A public sauna session is the right choice.'
                      : 'Haluatko tulla helposti saunomaan ilman oman ryhmän varaamista? Julkinen saunavuoro on oikea vaihtoehto.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-6">
                  <h3 className="mb-2 font-bold text-stone-900">{isEn ? 'Private sauna boat' : 'Yksityinen saunalautta'}</h3>
                  <p className="text-stone-600">
                    {isEn
                      ? 'Want a whole sauna entirely for your own group? Explore private sauna boats.'
                      : 'Haluatko oman saunan kokonaan oman porukan käyttöön? Tutustu yksityisiin saunalautoihin.'}
                  </p>
                  <a
                    href={isEn ? '/en/sauna-boat-cruises-helsinki' : '/saunalauttaristeilyt-helsingissa'}
                    className="mt-3 inline-block text-sm font-bold text-[#3b82f6] hover:underline"
                  >
                    {isEn ? 'Explore private sauna boats →' : 'Tutustu yksityisiin saunalautoihin →'}
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Gallery' : 'Galleria'}
              </p>
              <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
                {isEn ? 'Moments from public sauna sessions' : 'Tunnelmia julkisilta saunavuoroilta'}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { src: '/images/gallery-sauna-group.webp', alt: isEn ? 'Public sauna in Helsinki on a sauna boat' : 'Julkinen sauna Helsingissä saunalautalla' },
                { src: '/images/gallery-deck-view.webp', alt: isEn ? 'Sauna session in the Helsinki archipelago' : 'Saunavuoro Helsingin saaristossa' },
                { src: '/images/gallery-sauna-woman.webp', alt: isEn ? 'Sauna-goers on the sauna boat terrace' : 'Saunojia saunalautan terassilla' },
                { src: '/images/gallery-ice-swimming.webp', alt: isEn ? 'Sauna in a sea view in Helsinki' : 'Saunomista merimaisemassa Helsingissä' },
              ].map((img) => (
                <div key={img.src} className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion
        items={faqItems}
        title={isEn ? 'Frequently asked questions about public sauna' : 'Usein kysyttyä julkisesta saunasta'}
        locale={safeLocale}
      />

      {/* Final CTA */}
      <FinalCTA
        title={isEn ? 'Come enjoy the sauna' : 'Tule nauttimaan saunasta'}
        description={isEn
          ? 'Book your spot for a public sauna session and experience an authentic Finnish sauna by the sea.'
          : 'Varaa paikkasi julkiselle saunavuorolle ja koe aito suomalainen saunaelämys meren äärellä.'}
        primaryCta={{ text: isEn ? 'Book sauna session' : 'Varaa saunavuoro', href: isEn ? '#booking' : '#varaus' }}
        secondaryCta={{ text: isEn ? 'Call us' : 'Soita meille', href: 'tel:+358442313546' }}
        variant="dark"
      />
    </>
  );
}
