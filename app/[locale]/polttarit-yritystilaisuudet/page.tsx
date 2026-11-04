import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/sections/HeroSection';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import AnimatedSection from '@/components/AnimatedSection';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateBreadcrumbSchema, generateArticleSchema, generateFAQSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { HeroContent } from '@/types';
import type { Locale } from '@/content/pages';

const PAGE_IMAGE = `${SITE_URL}/images/saunaboat-winter-sun.webp`;
const DATE_PUBLISHED = '2024-01-15';
const DATE_MODIFIED = '2026-11-04';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/bachelor-parties-corporate-events-helsinki' : '/polttarit-yritystilaisuudet'}`;

  return {
    title: isEn
      ? 'Bachelor Parties & Corporate Events on a Sauna Boat | Hyvän Tuulen Sauna'
      : 'Polttarit ja yritystilaisuudet saunalautalla | Hyvän Tuulen Sauna',
    description: isEn
      ? 'Host your bachelor party, birthday or corporate event on a sauna boat in Helsinki. Private winter saunas in Puotila in winter, sauna boat cruises in summer. Book now!'
      : 'Järjestä polttarit, synttärit tai yritystilaisuus saunalautalla Helsingissä. Talvella yksityiset talvisaunat Puotilassa, kesällä saunalauttaristeilyt. Varaa nyt!',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/polttarit-yritystilaisuudet`,
        'en-US': `${SITE_URL}/en/bachelor-parties-corporate-events-helsinki`,
        'en-GB': `${SITE_URL}/en/bachelor-parties-corporate-events-helsinki`,
        'x-default': `${SITE_URL}/polttarit-yritystilaisuudet`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Bachelor Parties & Corporate Events | Hyvän Tuulen Sauna'
        : 'Polttarit ja yritystilaisuudet | Hyvän Tuulen Sauna',
      description: isEn
        ? 'A private sauna boat for your party — winter saunas in Puotila, summer cruises in the archipelago.'
        : 'Saunalautta yksityiseen juhlaan — talvikaudella talvisaunat Puotilassa, kesällä risteilyt saaristossa.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/saunaboat-winter-sun.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Sauna boats Aalto and Virta - Hyvän Tuulen Sauna'
            : 'Saunalautat Aalto ja Virta - Hyvän Tuulen Sauna',
        },
      ],
    },
  };
}

export default async function OccasionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/bachelor-parties-corporate-events-helsinki' : '/polttarit-yritystilaisuudet'}`;

  const faqItems = getFAQsByCategory('occasions', safeLocale);

  const hero: HeroContent = isEn
    ? {
        title: 'Bachelor parties and corporate events on a sauna boat in Helsinki',
        subtitle: 'Parties and corporate events',
        description:
          'A private sauna boat for your own group — bachelor parties, birthdays, team days and corporate events. Wood-fired sauna, ice hole in winter, sea views all year round.',
        ctaText: 'Book a private session',
        ctaHref: '/en/ice-swimming-sauna-helsinki',
        image: '/images/saunaboat-winter-sun.webp',
        images: [
          '/images/saunaboat-winter-sun.webp',
          '/images/gallery-ice-swimming.webp',
          '/images/gallery-winter-sunset.webp',
        ],
      }
    : {
        title: 'Polttarit ja yritystilaisuudet saunalautalla Helsingissä',
        subtitle: 'Juhlat ja yritystilaisuudet',
        description:
          'Yksityinen saunalautta omalle porukalle — polttarit, synttärit, tyky-päivät ja yritystilaisuudet. Puulämmitteinen sauna, talvella avanto, merimaisemat ympäri vuoden.',
        ctaText: 'Varaa yksityinen vuoro',
        ctaHref: '/avanto',
        image: '/images/saunaboat-winter-sun.webp',
        images: [
          '/images/saunaboat-winter-sun.webp',
          '/images/gallery-ice-swimming.webp',
          '/images/gallery-winter-sunset.webp',
        ],
      };

  const serviceSchema = generateServiceSchema(
    isEn ? 'Bachelor parties and corporate events on a sauna boat' : 'Polttarit ja yritystilaisuudet saunalautalla',
    isEn
      ? 'Private sauna boat for parties and corporate events in Helsinki. Winter saunas in Puotila in winter, sauna boat cruises in summer.'
      : 'Yksityinen saunalautta juhliin ja yritystilaisuuksiin Helsingissä. Talvikaudella talvisaunat Puotilassa, kesällä saunalauttaristeilyt.',
    pageUrl,
    PAGE_IMAGE
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Bachelor parties & corporate events' : 'Polttarit ja yritystilaisuudet', url: pageUrl },
  ]);

  const articleSchema = generateArticleSchema(
    isEn ? 'Bachelor Parties & Corporate Events on a Sauna Boat in Helsinki' : 'Polttarit ja yritystilaisuudet saunalautalla Helsingissä',
    isEn
      ? 'A private sauna boat for your party or corporate event in Helsinki. Winter saunas in Puotila, summer cruises in the archipelago.'
      : 'Yksityinen saunalautta juhlaan tai yritystilaisuuteen Helsingissä. Talvikaudella talvisaunat Puotilassa, kesällä risteilyt saaristossa.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const faqSchema = generateFAQSchema(
    faqItems.map(item => ({ question: item.question, answer: item.answer }))
  );

  const whyCards = isEn
    ? [
        {
          title: 'The whole sauna is yours',
          text: 'By booking the whole boat you make sure the place is all yours — no strangers, your own schedule, your own music.',
        },
        {
          title: 'Food and drinks sorted',
          text: 'Bring your own or order catering — Restaurant Vilamo burgers cooked on board. In Puotila a pizzeria next door delivers affordable pizzas to the sauna.',
        },
        {
          title: 'Activities on the side',
          text: 'Ice swimming in winter, SUP boards and swimming in summer. Add a jet ski ride or a boat trip to make it unforgettable.',
        },
        {
          title: 'Honest pricing',
          text: 'Private sauna from 120 €/2 h in winter, sauna boat cruises from 175 €/2 h in summer. No hidden fees — see all prices before you book.',
        },
      ]
    : [
        {
          title: 'Koko sauna on teidän',
          text: 'Varaamalla koko lautan varmistat, että paikalla on vain teidän oma porukka — ei ventovieraita, oma aikataulu, oma musiikki.',
        },
        {
          title: 'Ruoka ja juomat kuntoon',
          text: 'Omat eväät ovat tervetulleita tai tilaa catering — Ravintola Vilamon lautalla paistettuja burgereita. Puotilassa pizzeria naapurista toimittaa edulliset pizzat saunalle.',
        },
        {
          title: 'Aktiviteetteja lomassa',
          text: 'Talvella avantouinti, kesällä SUP-laudat ja uinti. Lisää unohtumattomuutta vesijettiajelulla tai venekierroksella.',
        },
        {
          title: 'Reilut hinnat',
          text: 'Yksityinen sauna talvella alk. 120 €/2 h, saunalauttaristeilyt kesällä alk. 175 €/2 h. Ei piilokuluja — näet hinnat ennen varausta.',
        },
      ];

  const includedItems = isEn
    ? ['Wood-fired sauna', 'Ice hole in winter', 'Captain / host', 'Terrace', 'Changing room', 'Toilet']
    : ['Puulämmitteinen sauna', 'Avanto talvella', 'Kapteeni / saunamajuri', 'Terassi', 'Pukuhuone', 'WC'];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbSchema, articleSchema, faqSchema]),
        }}
      />

      <HeroSection content={hero} variant="page" />

      {/* Winter season */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Winter season' : 'Talvikausi'}
            </p>
            <h2 className="font-display mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Private winter saunas in Puotila' : 'Yksityiset talvisaunat Puotilassa'}
            </h2>
            <div className="space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
              <p>
                {isEn
                  ? 'In winter our sauna boats Aalto and Virta serve as private winter saunas at the Meripellontie pier in Puotila. Aalto fits 10 people, Virta 6. You can rent either sauna or both — the large ice hole is included.'
                  : 'Talvella saunalauttamme Aalto ja Virta toimivat yksityisinä talvisaunoina Meripellontien laiturilla Puotilassa. Aaltoon mahtuu 10 henkeä, Virtaan 6. Voit vuokrata jommankumman tai molemmat — iso avanto kuuluu aina mukaan.'}
              </p>
              <p>
                {isEn
                  ? 'Christmas parties, birthdays or team recreation days? We have hosted plenty! There is a pizzeria next to the pier with good and affordable pizzas for the sauna.'
                  : 'Pikkujoulut, synttärit tai virkkarit? Näitä meillä on ollut paljon! Laiturin naapurissa on pizzeria, josta saa hyvät ja edulliset pizzat suoraan saunalle.'}
              </p>
              <p className="font-semibold text-stone-800">
                {isEn ? (
                  <>Big group? Book both saunas or call{' '}
                    <a href="tel:+358442313546" className="text-lake hover:underline">044 231 3546</a> and we will tailor a package.</>
                ) : (
                  <>Iso porukka? Varaa molemmat saunat tai soita{' '}
                    <a href="tel:+358442313546" className="text-lake hover:underline">044 231 3546</a> — räätälöidään sopiva paketti.</>
                )}
              </p>
              <div className="pt-2">
                <Link
                  href="/avanto"
                  className="inline-flex items-center justify-center rounded-full bg-lake px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-lake-deep hover:shadow-xl"
                >
                  {isEn ? 'Book a private winter sauna' : 'Varaa yksityinen talvisauna'}
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Summer season */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Summer season' : 'Kesäkausi'}
            </p>
            <h2 className="font-display mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Sauna boat cruises in the archipelago' : 'Saunalauttaristeilyt saaristossa'}
            </h2>
            <div className="space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
              <p>
                {isEn
                  ? 'In summer the party moves to the water. A private sauna boat cruise takes your group to the Eastern Helsinki archipelago — swim, grill, enjoy the sea views. Both boats together fit up to 25 people.'
                  : 'Kesällä juhlat siirtyvät vesille. Yksityinen saunalauttaristeily vie porukkanne Itä-Helsingin saaristoon — uidaan, grillataan ja nautitaan merimaisemista. Molemmat lauta yhdessä sopivat jopa 25 hengelle.'}
              </p>
              <p>
                {isEn
                  ? 'A sauna boat cruise starts from 175 € / 2 h. The price includes the captain, wood-fired sauna, Weber grill, ice for drinks and a sound system.'
                  : 'Saunalauttaristeily maksaa alk. 175 € / 2 h. Hintaan kuuluu kapteeni, puulämmitteinen sauna, Weber-grilli, jäät juomille ja musiikkijärjestelmä.'}
              </p>
              <div className="pt-2">
                <Link
                  href="/saunalauttaristeilyt-helsingissa"
                  className="inline-flex items-center justify-center rounded-full border-2 border-lake bg-white px-8 py-3.5 text-base font-bold text-lake shadow-md transition-all hover:-translate-y-0.5 hover:bg-lake hover:text-white hover:shadow-lg"
                >
                  {isEn ? 'Explore sauna boat cruises' : 'Tutustu saunalauttaristeilyihin'}
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why us */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="font-display mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Why celebrate with us?' : 'Miksi juhlia meillä?'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {whyCards.map((item) => (
                <div key={item.title} className="rounded-2xl bg-background p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600 md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Included */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-white p-8 md:p-12">
              <h2 className="font-display mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl">
                {isEn ? 'What is included?' : 'Mitä hintaan kuuluu?'}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {includedItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-stone-700 md:text-lg">
                    <span className="text-lake">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-sm text-stone-600">
                {isEn
                  ? 'Catering, jet ski and other extras available — ask when booking.'
                  : 'Catering, vesijetti ja muut lisäpalvelut saatavilla — kysy varauksen yhteydessä.'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { src: '/images/saunaboat-winter-sun.webp', alt: isEn ? 'Winter saunas on the ice' : 'Talvisaunat jäällä' },
                { src: '/images/gallery-ice-swimming.webp', alt: isEn ? 'Ice swimming' : 'Avantouinti' },
                { src: '/images/gallery-winter-dock.webp', alt: isEn ? 'Winter dock in Puotila' : 'Talvinen laituri Puotilassa' },
                { src: '/images/gallery-winter-sunset.webp', alt: isEn ? 'Winter sunset at the sauna' : 'Talviauringonlasku saunalla' },
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
        title={isEn ? 'Frequently asked questions about parties and corporate events' : 'Usein kysyttyä juhlista ja yritystilaisuuksista'}
        locale={safeLocale}
      />

      {/* Final CTA */}
      <FinalCTA
        title={isEn ? 'Ready to party?' : 'Valmiina juhliin?'}
        description={isEn
          ? 'Book a private sauna for your group — winter saunas in Puotila or summer cruises in the archipelago.'
          : 'Varaa yksityinen sauna porukallesi — talvikaudella talvisaunat Puotilassa, kesällä risteilyt saaristossa.'}
        primaryCta={{ text: isEn ? 'Book a private session' : 'Varaa yksityinen vuoro', href: isEn ? '/en/ice-swimming-sauna-helsinki' : '/avanto' }}
        secondaryCta={{ text: isEn ? 'Call us' : 'Soita meille', href: 'tel:+358442313546' }}
        variant="dark"
      />
    </>
  );
}
