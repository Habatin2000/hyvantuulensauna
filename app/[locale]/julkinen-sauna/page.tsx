import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/sections/HeroSection';
import PublicBookingWidget from '@/components/booking/PublicBookingWidget';
import SubscriptionPurchase from '@/components/booking/SubscriptionPurchase';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import AnimatedSection from '@/components/AnimatedSection';
import { getPublicPageHero } from '@/content/pages';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema, generateEventSchema, generateHowToSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-ice-swimming.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-11-03';

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
      ? 'Public Sauna in Helsinki'
      : 'Yleinen sauna Helsingissä',
    description: isEn
      ? 'Enjoy a public sauna session by the sea in Puotila. Two wood-fired saunas, winter swimming, an ice hole and a relaxed atmosphere. View sessions and book!'
      : 'Nauti yleisestä saunavuorosta meren äärellä Puotilassa. Kaksi puusaunaa, talviuintia, avanto ja rento tunnelma. Katso saunavuorot ja varaa!',
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
        : 'Yleinen Sauna Helsingissä | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Come to a public sauna session by the sea in Puotila! Wood-fired saunas and winter swimming.'
        : 'Tule yleiselle saunavuorolle meren äärelle Puotilaan! Puusaunat ja talviuintia.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-ice-swimming.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Public sauna in Helsinki - Hyvän Tuulen Sauna'
            : 'Yleinen sauna Helsingissä - Hyvän Tuulen Sauna',
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
    isEn ? 'Public sauna in Helsinki' : 'Yleinen sauna Helsingissä',
    isEn
      ? 'Open public sauna sessions in Puotila. Wood-fired saunas, winter swimming and an ice hole by the sea.'
      : 'Avoimet yleiset saunavuorot Puotilassa. Puulämmitteiset saunat, talviuinti ja avanto meren äärellä.',
    pageUrl,
    PAGE_IMAGE
  );

  const articleSchema = generateArticleSchema(
    isEn ? 'Public Sauna in Helsinki | Sauna Session by the Sea' : 'Yleinen Sauna Helsingissä | Saunavuoro Merellä',
    isEn
      ? 'Come to a public sauna session by the sea in Puotila! Wood-fired saunas, winter swimming and a relaxed atmosphere.'
      : 'Tule yleiselle saunavuorolle meren äärelle Puotilaan! Puulämmitteiset saunat, talviuinti ja rento tunnelma.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const eventSchema = generateEventSchema(
    isEn ? 'Public winter swimming and sauna session' : 'Yleinen talviuinti- ja saunavuoro',
    isEn
      ? 'Open public sauna session in Puotila. Two wood-fired saunas, a large ice hole and guidance for winter swimming.'
      : 'Avoin yleinen saunavuoro Puotilassa. Kaksi puusaunaa, iso avanto ja ohjaus talviuintiin.',
    pageUrl,
    PAGE_IMAGE,
    '2026-11-01T09:00:00+02:00',
    '2027-04-30T21:00:00+03:00',
    isEn ? 'Meripellontie pier, Puotila' : 'Meripellontien laituri, Puotila',
    '15',
    '2026-11-01'
  );

  const howToSchema = generateHowToSchema(
    isEn ? 'Preparing for a public winter swimming session' : 'Valmistautuminen yleiselle talviuintivuorolle',
    isEn
      ? 'What to bring and what the sauna session includes at Hyvän Tuulen Sauna in winter.'
      : 'Mitä tarvitset mukaan ja mitä saunavuoro sisältää Hyvän Tuulen Saunalla talvella.',
    isEn ? [
      { name: 'Own towel', text: 'Bring your own towel — you will want it after the ice dip.' },
      { name: 'Swimwear', text: 'Pack swimwear for the sauna and the ice hole.' },
      { name: 'Warm clothes', text: 'Bring warm clothes for cooling off on the terrace.' },
      { name: 'Water bottle', text: 'Own water bottle is handy — we also sell cold drinks on site.' }
    ] : [
      { name: 'Oma pyyhe', text: 'Ota oma pyyhe mukaan — sitä tarvitset pulahduksen jälkeen.' },
      { name: 'Uimapuvut', text: 'Pakkaa uimapuvut saunaan ja avantoon.' },
      { name: 'Lämpimät vaatteet', text: 'Ota mukaan lämpimät vaatteet terassilla vilvoitteluun.' },
      { name: 'Juomapullo', text: 'Oma juomapullo on kätevä – myymme myös kylmiä juomia paikan päällä.' }
    ]
  );

  const faqSchema = generateFAQSchema(
    faqItems.map(item => ({ question: item.question, answer: item.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Public Sauna' : 'Yleinen sauna', url: pageUrl }
  ]);

  const bringItems = isEn ? [
    'Weather-appropriate clothing',
    'Towel',
    'Swimwear',
    'Water bottle',
  ] : [
    'Säänmukainen varustus',
    'Pyyhe',
    'Uikkarit',
    'Juomapullo',
  ];

  const includedItems = isEn ? [
    'Two wood-fired saunas',
    'A large ice hole',
    'Changing rooms',
    'Toilet facilities',
    'Terrace',
    'Guidance for winter swimming',
  ] : [
    'Kaksi puulämmitteistä saunaa',
    'Iso avanto',
    'Pukuhuoneet',
    'WC-tilat',
    'Terassi',
    'Ohjaus talviuintiin',
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

      {/* Section 1: Ohjattu talviuinti ja sauna meren äärellä Puotilassa */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Public sauna and sauna sessions by the sea' : 'Yleinen sauna ja saunavuorot meren äärellä'}
            </p>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Guided winter swimming and sauna by the sea in Puotila' : 'Ohjattu talviuinti ja sauna meren äärellä Puotilassa'}
            </h2>
            <div className="space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
              <p>
                {isEn
                  ? 'It is easy to come to Hyvän Tuulen Sauna to practice winter swimming and enjoy the sauna in Helsinki. You do not need your own group or a private booking — just book a spot for a public session and join in.'
                  : 'Hyvän Tuulen Saunalle on helppo tulla harjoittamaan talviuintia ja nauttimaan saunasta Helsingissä. Et tarvitse omaa porukkaa tai yksityistä varausta, vaan voit varata paikan yleiselle vuorolle ja tulla mukaan.'}
              </p>
              <p>
                {isEn
                  ? 'During the winter swimming season our staff guides you and helps you get started with the hobby. After your dip you can enjoy the hot löyly.'
                  : 'Talviuintikaudella henkilökuntamme ohjeistaa sinua ja auttaa alkuun harrastuksen parissa. Pulahduksen jälkeen voit mennä nauttimaan kuumista löylyistä.'}
              </p>
              <p>
                {isEn
                  ? 'The session lasts two hours. We are easy to reach by car or by public transport. During the winter season we are at the Puotila pier!'
                  : 'Vuoro kestää kaksi tuntia. Meille on helppo saapua autolla tai julkisilla. Olemme talvikauden Puotilan laiturissa!'}
              </p>
              <p>
                {isEn
                  ? 'On the boat you have access to two saunas, changing rooms, toilet facilities and a terrace. In the winter season we have a large ice hole.'
                  : 'Lautalla käytössäsi on kaksi saunaa, pukuhuoneet, WC-tilat ja terassi. Talvikaudella meillä on iso avanto.'}
              </p>
              <p className="font-semibold text-stone-800">
                {isEn
                  ? 'Our public sauna session is for you if you want to get to the sauna easily in Helsinki without booking your own sauna space.'
                  : 'Meidän yleinen saunavuoro on tarkoitettu sinulle, joka haluat helposti saunaan Helsingissä ilman oman saunatilan varaamista.'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 2: Booking calendar (raised one position) */}
      <section id={isEn ? 'booking' : 'varaus'} className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Book your spot' : 'Varaa paikkasi'}
            </p>
            <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
              {isEn ? 'Book your spot for upcoming sauna sessions' : 'Varaa paikkasi tuleville saunavuoroille'}
            </h2>

            <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
              {isEn
                ? 'Book your spot, arrive at Meripellontie and enjoy a public sauna session by the sea.'
                : 'Varaa paikkasi, saavu Meripellontielle ja nauti yleisestä saunavuorosta meren äärellä.'}
            </p>
          </div>

          {/* Grill notice */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
              <p className="text-amber-900 font-semibold">
                {isEn
                  ? 'NOTE: Own food for grilling is not allowed on public sauna sessions – the grill is operated by our sauna masters.'
                  : 'HUOM: Omat grillattavat eivät ole sallittuja julkisella saunavuorolla – grilliä pyörittävät saunamajurimme.'}
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
                  ? 'Kids coming along? Children get student pricing <3! (under 15)'
                  : 'Lapset mukaan? Lapset opiskelijahinnalla <3! (alle 15v)'}
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
            {isEn ? '1. Choose a session · 2. Book your spot · 3. Arrive at Meripellontie on time' : '1. Valitse vuoro · 2. Varaa paikkasi · 3. Saavu Meripellontielle ajoissa'}
          </p>

          <PublicBookingWidget locale={safeLocale} />

          {/* 10 x sauna card */}
          <div className="mt-12 max-w-md mx-auto">
            <SubscriptionPurchase locale={safeLocale} />
          </div>

          {/* Private winter sauna CTA (replaces mini cruise) */}
          <div className="mt-12 max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:p-10">
                <div className="text-center md:text-left">
                  <h3 className="font-corben text-xl font-bold text-stone-900 md:text-2xl">
                    {isEn ? 'Want privacy? Book a sauna boat for your own use!' : 'Yksityisyyttä vailla? Varaa saunalautta omaan käyttöösi!'}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600 md:text-base">
                    {isEn
                      ? 'Aalto and Virta serve as private winter saunas in Puotila. Rent one sauna or both — the ice hole is included.'
                      : 'Aalto ja Virta toimivat yksityisinä talvisaunoina Puotilassa. Vuokraa jompikumpi tai molemmat — avanto kuuluu mukaan.'}
                  </p>
                </div>
                <Link
                  href="/avanto"
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#3b82f6] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-xl"
                >
                  {isEn ? 'Explore winter saunas' : 'Tutustu talvisaunoihin'}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 3: Miksi tulla Hyvän Tuulen Saunan yleiselle vuorolle? */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="font-corben mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Why come to a Hyvän Tuulen Sauna public session?' : 'Miksi tulla Hyvän Tuulen Saunan yleiselle vuorolle?'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: isEn ? 'Two authentic wood-fired saunas with sea views' : 'Kaksi aitoa puusaunaa merimaisemilla',
                  text: isEn
                    ? 'During the public session you have access to two wood-fired saunas. The terrace opens to a sea view over the Eastern Helsinki archipelago.'
                    : 'Yleisillä vuorolla käytössä on kaksi aitoa puusaunaa. Terassilta avautuu merimaisema Itä-Helsingin saaristoon.',
                },
                {
                  title: isEn ? 'Guided winter swimming' : 'Talviuintia ohjatusti',
                  text: isEn
                    ? 'Our staff guides you with winter swimming. You can also buy gear for winter swimming from us!'
                    : 'Henkilökuntamme opastaa sinua talviuinnin kanssa. Meiltä saat myös ostettua tarvikkeita talviuintia varten!',
                },
                {
                  title: isEn ? 'Affordable and easy hobby without a group booking' : 'Edullinen ja helppo tapa harrastaa ilman ryhmävarausta',
                  text: isEn
                    ? 'You can come alone, as a couple or with a group of friends — just book your spot and arrive at Meripellontie. The most affordable way to experience Hyvän Tuulen Sauna.'
                    : 'Voit tulla yksin, kaksin tai kaveriporukalla — varaa vain oma paikkasi ja saavu Meripellontielle. Edullisin tapa päästä kokemaan Hyvän Tuulen Sauna.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-[#faf9f7] p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600 md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 4: Avanto ja saunavuorot Helsingissä */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Sessions' : 'Vuorot'}
            </p>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Ice hole and sauna sessions in Helsinki' : 'Avanto ja saunavuorot Helsingissä'}
            </h2>
            <p className="mb-8 text-center text-stone-600 md:text-lg">
              {isEn
                ? 'Public sauna sessions are organized in winter from Monday to Thursday and on Saturdays and Sundays. You can see free spots and availability in the booking calendar.'
                : 'Yleisiä saunavuoroja järjestetään talvella ma-to ja la-su. Vapaat paikat ja varaustilanteen näet varauskalenterista.'}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="rounded-3xl bg-white p-8 md:p-12">
              <h3 className="font-corben mb-4 text-xl font-bold text-stone-900 md:text-2xl">
                {isEn ? 'A large ice hole right next to the sauna' : 'Iso avanto aivan saunan vieressä'}
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-stone-600 md:text-lg">
                <p>
                  {isEn
                    ? 'In winter the sea dip becomes ice swimming. Our large ice hole is kept open throughout the winter and the steps with handrails make getting in and out safe.'
                    : 'Talvella pulahdus mereen muuttuu avantouinniksi. Iso avantomme pidetään auki koko talven, ja portaat sekä käsijohteet tekevät veteen menosta turvallista.'}
                </p>
                <p className="font-semibold text-stone-800">
                  {isEn ? (
                    <>Read more about ice swimming —{' '}
                      <Link href="/avanto" className="text-[#3b82f6] hover:underline">visit the ice swimming page</Link>.</>
                  ) : (
                    <>Lue lisää avantouinnista —{' '}
                      <Link href="/avanto" className="text-[#3b82f6] hover:underline">siirry avantouintisivulle</Link>.</>
                  )}
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
              <h2 className="font-corben mb-6 text-xl font-bold text-stone-900 md:text-2xl">
                {isEn ? 'Important information for sauna guests (arrival, gear and instructions)' : 'Tärkeää tietoa saunojille (saapuminen, varusteet ja ohjeet)'}
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-stone-600 md:text-lg">
                <div>
                  <h4 className="mb-2 font-bold text-stone-900">{isEn ? 'Arrival' : 'Saapuminen'}</h4>
                  <p>
                    {isEn
                      ? 'Arrive at Meripellontie 11, 00970 Helsinki. You only need to be there a few minutes before the session starts. If you know you will be late for the sauna session, let us know in advance.'
                      : 'Saavu osoitteeseen Meripellontie 11, 00970 Helsinki. Paikalla ei tarvitse olla kuin muutama minuutti ennen vuoron alkamista. Jos tiedät myöhästyväsi saunavuorolta, ilmoita siitä etukäteen.'}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-stone-900">{isEn ? 'What to bring' : 'Mukaan'}</h4>
                  <p>
                    {isEn
                      ? 'Weather-appropriate clothing, towel, swimwear and a water bottle.'
                      : 'Säänmukainen varustus, pyyhe, uikkarit, juomapullo.'}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Yleinen sauna vai oma talvisauna? */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-[#faf9f7] p-8 md:p-12">
              <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl">
                {isEn ? 'Public session or your own winter sauna?' : 'Yleinen vuoro vai oma talvisauna?'}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-6">
                  <h3 className="mb-2 font-bold text-stone-900">{isEn ? 'Public sauna session' : 'Yleinen saunavuoro'}</h3>
                  <p className="text-stone-600">
                    {isEn
                      ? 'Want to get to the sauna easily without booking a group? A public sauna session is the right choice.'
                      : 'Haluatko tulla helposti saunomaan ilman oman ryhmän varaamista? Yleinen saunavuoro on oikea vaihtoehto.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-6">
                  <h3 className="mb-2 font-bold text-stone-900">{isEn ? 'Private winter sauna' : 'Yksityinen talvisauna'}</h3>
                  <p className="text-stone-600">
                    {isEn
                      ? 'Want a whole sauna entirely for your own group? Explore the private winter saunas Aalto and Virta.'
                      : 'Haluatko oman saunan kokonaan oman porukan käyttöön? Tutustu yksityisiin talvisaunoihin Aaltoon ja Virtaan.'}
                  </p>
                  <Link
                    href="/avanto"
                    className="mt-3 inline-block text-sm font-bold text-[#3b82f6] hover:underline"
                  >
                    {isEn ? 'Explore private winter saunas →' : 'Tutustu yksityisiin talvisaunoihin →'}
                  </Link>
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
                {isEn ? 'Winter moments' : 'Talvisia hetkiä'}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { src: '/images/gallery-ice-swimming.webp', alt: isEn ? 'Ice swimming in Helsinki' : 'Avantouinti Helsingissä' },
                { src: '/images/saunaboat-winter-sun.webp', alt: isEn ? 'Winter saunas on the ice' : 'Talvisaunat jäällä' },
                { src: '/images/gallery-avanto-woman.webp', alt: isEn ? 'Cooling off on the ice' : 'Vilvoittelua jäällä' },
                { src: '/images/gallery-winter-dock.webp', alt: isEn ? 'Winter dock in Puotila' : 'Talvinen laituri Puotilassa' },
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
        title={isEn ? 'Frequently asked questions about public sauna' : 'Usein kysyttyä yleisestä saunasta'}
        locale={safeLocale}
      />

      {/* Final CTA */}
      <FinalCTA
        title={isEn ? 'Come enjoy the sauna' : 'Tule nauttimaan saunasta'}
        description={isEn
          ? 'Book your spot for a public sauna session and experience an authentic Finnish sauna by the sea.'
          : 'Varaa paikkasi yleiselle saunavuorolle ja koe aito suomalainen saunaelämys meren äärellä.'}
        primaryCta={{ text: isEn ? 'Book sauna session' : 'Varaa saunavuoro', href: isEn ? '#booking' : '#varaus' }}
        secondaryCta={{ text: isEn ? 'Call us' : 'Soita meille', href: 'tel:+358442313546' }}
        variant="dark"
      />
    </>
  );
}
