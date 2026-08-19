import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import PublicBookingWidget from '@/components/booking/PublicBookingWidget';
import SubscriptionPurchase from '@/components/booking/SubscriptionPurchase';
import MiniCruiseSection from '@/components/sections/MiniCruiseSection';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import { getPublicPageHero } from '@/content/pages';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema, generateEventSchema, generateHowToSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-sauna-group.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-04-14';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/julkinen-sauna`;

  return {
    title: isEn
      ? 'Public Sauna in Helsinki by the Sea'
      : 'Julkinen sauna Helsingissä',
    description: isEn
      ? 'Come to a public sauna session by the sea in Aurinkolahti! Authentic wood-fired sauna, ice swimming and great vibes. Book your spot now – Helsinki\'s most unique sauna experience.'
      : 'Tule julkiselle saunavuorolle meren äärelle Aurinkolahteen! Aito puulämmitteinen sauna, avanto ja hyvä tunnelma. Varaa paikkasi nyt – Helsingin uniikein saunaelämys.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/julkinen-sauna`,
        'en-US': `${SITE_URL}/en/julkinen-sauna`,
        'en-GB': `${SITE_URL}/en/julkinen-sauna`,
        'x-default': `${SITE_URL}/julkinen-sauna`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Public Sauna in Helsinki | Hyvän Tuulen Sauna'
        : 'Julkinen Sauna Helsingissä | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Come to a public sauna session by the sea! Authentic wood-fired sauna and ice swimming.'
        : 'Tule julkiselle saunavuorolle meren äärelle! Aito puulämmitteinen sauna ja avanto.',
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
  const pageUrl = `${SITE_URL}${isEn ? '/en' : ''}/julkinen-sauna`;

  const serviceSchema = generateServiceSchema(
    isEn ? 'Public sauna' : 'Julkinen sauna',
    isEn
      ? 'Open sauna sessions for the public in Aurinkolahti. Wood-fired sauna and ice swimming.'
      : 'Avoimet saunavuorot yleisölle Aurinkolahdessa. Puulämmitteinen sauna ja avanto.',
    pageUrl,
    PAGE_IMAGE
  );

  const articleSchema = generateArticleSchema(
    isEn ? 'Public Sauna in Helsinki | Sauna Session by the Sea' : 'Julkinen Sauna Helsingissä | Saunavuoro Merellä',
    isEn
      ? 'Come to a public sauna session by the sea in Aurinkolahti! Authentic wood-fired sauna, ice swimming and great vibes.'
      : 'Tule julkiselle saunavuorolle meren äärelle Aurinkolahteen! Aito puulämmitteinen sauna, avanto ja hyvä tunnelma.',
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

      {/* Booking Widget */}
      <section id={isEn ? 'booking' : 'varaus'} className="section-padding bg-stone-50">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Book your spot' : 'Varaa paikkasi'}
            </p>
            <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
              {isEn ? 'Summer Public Sauna Sessions' : 'Kesän julkiset saunavuorot'}
            </h2>

            <div className="mt-4 text-stone-600 max-w-2xl mx-auto space-y-4">
              <p>
                {isEn
                  ? 'Sauna sessions at Hyvän Tuulen Sauna are probably the most unique way in Helsinki to enjoy the sea and the warmth of a sauna.'
                  : 'Saunavuorot Hyvän Tuulen Saunalla ovat varmaankin Helsingin uniikein tapa päästä nauttimaan merestä ja saunan lämmöstä.'}
              </p>
              <p>
                {isEn
                  ? "Here's how it works: We will pick you up by boat at the agreed time from Kalkkihiekantori boat pier and transport you to the sauna boat. The boat has two hot saunas and a grill. We also sell cold drinks. The sauna session lasts two hours, SUP boards are available and the atmosphere is guaranteed great. These are the summer's finest low-threshold sauna sessions ❤️"
                  : 'Homma toimii näin: Tulemme hakemaan teidät sovittuun aikaan veneellä Kalkkihiekantorin laivalaiturista, ja kuljetamme teidät saunalautalle. Lautalla on kuumana kaksi saunaa ja grilli. Myymme myös kylmiä juomia. Saunavuoro kestää kaksi tuntia, käytössä on myös sup-lautoja ja tunnelma on taatusti loistava. Nämä ovat kesän hienoimpia matalan kynnyksen saunavuoroja ❤️'}
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

          <PublicBookingWidget locale={safeLocale} />

          {/* 10 x sauna card */}
          <div className="mt-12 max-w-md mx-auto">
            <SubscriptionPurchase locale={safeLocale} />
          </div>

          {/* Mini Cruise */}
          <div className="mt-12 max-w-4xl mx-auto">
            <MiniCruiseSection locale={safeLocale} />
          </div>

          {/* Service info blocks below calendar */}
          <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-white p-8">
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                {isEn ? 'What to bring?' : 'Mitä mukaan?'}
              </h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Water' : 'Vettä'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Swimwear' : 'Uimapuku'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Towel' : 'Pyyhe'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Sandals' : 'Sandaalit'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Weather-appropriate clothing' : 'Sään mukainen vaatetus'}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-8">
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                {isEn ? 'Included in the price' : 'Sisältyy hintaan'}
              </h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Two saunas' : 'Kaksi saunaa'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Changing rooms' : 'Pukkarit'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Toilet facilities' : 'WC-tilat'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3b82f6]">✓</span>
                  <span>{isEn ? 'Terrace' : 'Terrassi'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* General info */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white p-8">
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                INFO
              </h3>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  <strong className="text-stone-900">
                    {isEn
                      ? 'When you arrive for a public session, do the following.'
                      : 'Kun saavut julkiselle vuorolle, toimi näin.'}
                  </strong>
                </p>
                <p>
                  {isEn
                    ? <>Come to <strong>Kalkkihiekantori, 00980 Helsinki</strong>. A motorboat will pick you up from the shore and transport you to the sauna boat.</>
                    : <>Tule osoitteeseen <strong>Kalkkihiekantori, 00980 Helsinki</strong>. Moottorivene tulee hakemaan sinut rannasta ja kuljettaa saunalautalle.</>}
                </p>
                <p>
                  {isEn
                    ? 'So please arrive on time! If you arrive late, please let us know. You can also leave the boat earlier if necessary.'
                    : 'Tule paikalle siis ajoissa! Jos saavut myöhässä ilmoitathan tästä. Lautalta pääsee myös tarpeen tullen poistumaan aikaisemmin.'}
                </p>
              </div>
            </div>
          </div>
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
