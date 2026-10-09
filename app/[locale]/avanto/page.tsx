import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/sections/HeroSection';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import AnimatedSection from '@/components/AnimatedSection';
import SquareGallery from '@/components/sections/SquareGallery';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateBreadcrumbSchema, generateArticleSchema, generateHowToSchema, generateFAQSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import type { HeroContent } from '@/types';
import type { Locale } from '@/content/pages';

const PAGE_IMAGE = `${SITE_URL}/images/gallery-ice-swimming.webp`;
const DATE_PUBLISHED = '2026-10-01';
const DATE_MODIFIED = '2026-10-01';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/ice-swimming-sauna-helsinki' : '/avanto'}`;

  return {
    title: isEn
      ? 'Ice Swimming & Wood-Fired Sauna'
      : 'Avantouinti ja sauna Helsingissä',
    description: isEn
      ? "Try ice swimming and warm up in a wood-fired sauna in Helsinki's Aurinkolahti. Join a public session or book a private sauna for your group."
      : 'Koe avantouinti ja puusaunan lämpö Helsingin Aurinkolahdessa. Tule yleiselle saunavuorolle tai varaa yksityinen sauna omalle porukallesi.',
    alternates: {
      canonical: pageUrl,
      languages: {
        'fi-FI': `${SITE_URL}/avanto`,
        'en-US': `${SITE_URL}/en/ice-swimming-sauna-helsinki`,
        'en-GB': `${SITE_URL}/en/ice-swimming-sauna-helsinki`,
        'x-default': `${SITE_URL}/avanto`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Ice Swimming & Sauna in Helsinki | Hyvän Tuulen Sauna'
        : 'Avantouinti ja puulämmitteinen sauna Helsingissä | Hyvän Tuulen Sauna',
      description: isEn
        ? 'Ice swimming and a wood-fired sauna by the sea in Aurinkolahti.'
        : 'Avantouinti ja puulämmitteinen sauna meren äärellä Aurinkolahdessa.',
      url: pageUrl,
      locale: isEn ? 'en_US' : 'fi_FI',
      images: [
        {
          url: '/images/gallery-ice-swimming.webp',
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Ice swimming in Helsinki - Hyvän Tuulen Sauna'
            : 'Avantouinti Helsingissä - Hyvän Tuulen Sauna',
        },
      ],
    },
  };
}

export default async function AvantoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const pageUrl = `${SITE_URL}${isEn ? '/en/ice-swimming-sauna-helsinki' : '/avanto'}`;

  const faqItems = getFAQsByCategory('avanto', safeLocale);

  const hero: HeroContent = isEn
    ? {
        title: 'Ice swimming & sauna in Helsinki',
        subtitle: 'Winter at Hyvän Tuulen Sauna',
        description:
          'A hole in the ice and a wood-fired sauna by the sea in Aurinkolahti. Join a public session or book the sauna spot for your own group — open all year round.',
        ctaText: 'Book a sauna session',
        ctaHref: '/julkinen-sauna',
        image: '/images/gallery-ice-swimming.webp',
        images: [
          '/images/gallery-ice-swimming.webp',
          '/images/gallery-winter-sunset.webp',
          '/images/saunaboat-winter-sun.webp',
        ],
      }
    : {
        title: 'Avantouinti ja puulämmitteinen sauna Helsingissä',
        subtitle: 'Talvi Hyvän Tuulen Saunalla',
        description:
          'Avanto ja puulämmitteinen sauna meren äärellä Aurinkolahdessa. Tule julkiselle vuorolle tai varaa saunatila omalle porukalle — toimintaa ympäri vuoden.',
        ctaText: 'Varaa saunavuoro',
        ctaHref: '/julkinen-sauna',
        image: '/images/gallery-ice-swimming.webp',
        images: [
          '/images/gallery-ice-swimming.webp',
          '/images/gallery-winter-sunset.webp',
          '/images/saunaboat-winter-sun.webp',
        ],
      };

  const serviceSchema = generateServiceSchema(
    isEn ? 'Ice swimming and sauna in Helsinki' : 'Avantouinti ja sauna Helsingissä',
    isEn
      ? 'Ice swimming and wood-fired sauna in a maritime setting in Aurinkolahti, Helsinki. Public sessions and private bookings all year round.'
      : 'Avantouinti ja puulämmitteinen sauna merellisessä ympäristössä Aurinkolahdessa. Julkiset vuorot ja yksityisvaraukset ympäri vuoden.',
    pageUrl,
    PAGE_IMAGE
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isEn ? 'Home' : 'Etusivu', url: `${SITE_URL}${isEn ? '/en' : ''}` },
    { name: isEn ? 'Ice swimming & sauna' : 'Avanto ja saunatila', url: pageUrl },
  ]);

  const articleSchema = generateArticleSchema(
    isEn ? 'Ice Swimming & Sauna in Helsinki' : 'Avantouinti ja puulämmitteinen sauna Helsingissä',
    isEn
      ? 'Ice swimming and a wood-fired sauna by the sea in Aurinkolahti, Helsinki.'
      : 'Avantouinti ja puulämmitteinen sauna meren äärellä Aurinkolahdessa, Helsingissä.',
    pageUrl,
    PAGE_IMAGE,
    DATE_PUBLISHED,
    DATE_MODIFIED
  );

  const howToSchema = generateHowToSchema(
    isEn ? 'Your first ice swimming session' : 'Ensimmäinen avantokäynti',
    isEn
      ? 'How to prepare for ice swimming at Hyvän Tuulen Sauna.'
      : 'Näin valmistaudut avantouintiin Hyvän Tuulen Saunalla.',
    isEn
      ? [
          { name: 'Book a session', text: 'Book a public sauna session online — ice swimming is included.' },
          { name: 'Bring the essentials', text: 'Towel, swimwear and warm clothes for after the dip.' },
          { name: 'Warm up first', text: 'Heat up in the wood-fired sauna before heading to the ice hole.' },
          { name: 'Take the dip', text: 'Enter the ice hole calmly, breathe steadily, and return to the sauna.' },
        ]
      : [
          { name: 'Varaa vuoro', text: 'Varaa julkinen saunavuoro verkossa — avanto kuuluu hintaan.' },
          { name: 'Pakkaa mukaan', text: 'Pyyhe, uima-asu ja lämpimät vaatteet vilvoitteluun.' },
          { name: 'Lämmittele ensin', text: 'Kuumene puulämmitteisessä saunassa ennen avantoon menoa.' },
          { name: 'Pulahda', text: 'Mene avantoon rauhallisesti, hengitä tasaisesti ja palaa saunaan.' },
        ]
  );

  const benefits = isEn
    ? [
        {
          title: 'Genuine ice hole',
          text: 'A real hole in the sea ice — no pool, no shortcuts. The Baltic right there.',
        },
        {
          title: 'Wood-fired sauna',
          text: 'A hot Harvia heater keeps you warm before and after the dip.',
        },
        {
          title: 'Sea view terrace',
          text: 'Cool off on the terrace with open views over the winter archipelago.',
        },
        {
          title: 'All year round',
          text: 'Ice swimming in winter, sea swimming in summer — the sauna never closes.',
        },
        {
          title: 'Private bookings',
          text: 'Book the sauna spot for your own group — birthdays, team days or just friends.',
        },
      ]
    : [
        {
          title: 'Aito avanto',
          text: 'Oikea avanto meressä — ei allasta, ei oikoteitä. Itämeri ihan vieressä.',
        },
        {
          title: 'Puulämmitteinen sauna',
          text: 'Kuuma Harvia-kiuas pitää lämmön yllä ennen avantoa ja sen jälkeen.',
        },
        {
          title: 'Terassi merinäköalalla',
          text: 'Vilvoittele terassilla talvisen saaristomaiseman äärellä.',
        },
        {
          title: 'Ympäri vuoden',
          text: 'Talvella avantouintia, kesällä meriuintia — sauna ei sulje koskaan.',
        },
        {
          title: 'Yksityisvaraukset',
          text: 'Varaa saunatila omalle porukalle — synttärit, tyky-päivät tai kaveritapaamiset.',
        },
      ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            serviceSchema,
            breadcrumbSchema,
            articleSchema,
            howToSchema,
            generateFAQSchema(faqItems.map(item => ({ question: item.question, answer: item.answer }))),
          ]),
        }}
      />

      <HeroSection content={hero} variant="page" />

      {/* Opening notice */}
      <AnimatedSection>
        <section className="bg-amber-50 border-b border-amber-200">
          <div className="container-padding mx-auto max-w-3xl py-5 text-center">
            <p className="text-base font-bold uppercase tracking-wide text-amber-900 md:text-lg">
              {isEn
                ? 'The sauna and ice hole open in November in Puotila'
                : 'Sauna ja avanto aukeaa marraskuussa Puotilassa'}
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Avantouinti meillä */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-3xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Ice swimming in Helsinki' : 'Avantouinti Helsingissä'}
            </p>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Ice swimming with us' : 'Avantouinti meillä'}
            </h2>
            <div className="space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
              <p>
                {isEn
                  ? 'Ice swimming at Hyvän Tuulen Sauna is the most authentic way to experience a Finnish winter. The sauna warms you up, the ice hole refreshes. Great company and scenery crown the experience.'
                  : 'Avantouinti Hyvän Tuulen Saunalla on aidoin tapa kokea suomalainen talvi. Sauna lämmittää, avanto virkistää. Mukava seura ja maisemat kruunaavat kokemuksen.'}
              </p>
              <p>
                {isEn
                  ? 'You can join a public session or book the whole spot for your own group. Ice swimming is included in the public sessions whenever there is ice — and when there is not, the sea is open for a swim anyway.'
                  : 'Voit tulla mukaan julkiselle vuorolle, tai varata koko tilan omalle porukalle. Avanto kuuluu julkisiin vuoroihin aina kun jäätä on — ja kun ei ole, meri on avoinna uimiseen silti.'}
              </p>
              <p className="font-semibold text-stone-800">
                {isEn
                  ? 'First-timer? No worries! Many of our guests try ice swimming for the first time with us, and we will guide you through it.'
                  : 'Ensikertalainen? Ei hätää! Suuri osa vieraistamme kokeilee avantouintia ensimmäistä kertaa meillä, ja ohjeistamme alkuun.'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Big CTA between sections */}
      <AnimatedSection>
        <section className="section-padding bg-[#faf9f7]">
          <div className="container-padding mx-auto max-w-3xl text-center">
            <h2 className="font-corben mb-3 text-2xl font-bold text-stone-900 md:text-3xl">
              {isEn ? 'Ready for a dip?' : 'Valmiina pulahdukseen?'}
            </h2>
            <p className="mb-8 text-stone-600 md:text-lg">
              {isEn
                ? 'Choose a public session or book the whole sauna spot for your group.'
                : 'Valitse julkinen vuoro tai varaa koko saunatila omalle porukalle.'}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/julkinen-sauna"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#3b82f6] px-10 py-4 text-base font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-2xl sm:w-auto"
              >
                {isEn ? 'Book a public sauna session' : 'Varaa julkinen saunavuoro'}
              </Link>
              <Link
                href="/saunalauttaristeilyt-helsingissa"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#3b82f6] bg-white px-10 py-4 text-base font-bold text-[#3b82f6] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#3b82f6] hover:text-white hover:shadow-lg sm:w-auto"
              >
                {isEn ? 'Book a private sauna spot' : 'Varaa yksityinen saunatila'}
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Miten mennä avantoon */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-[#faf9f7] p-8 md:p-12">
              <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl">
                {isEn ? 'How to join us for ice swimming' : 'Miten tulla meille avantoon'}
              </h2>
              <ol className="space-y-4 text-base leading-relaxed text-stone-600 md:text-lg">
                {(isEn
                  ? [
                      'Book a public sauna session or a private sauna session online.',
                      'Arrive at Meripellontie 11, 00970 Helsinki.',
                      'Warm up in the wood-fired sauna or start straight with the ice hole.',
                      'Take a dip in the ice hole at your own pace, as many times as you like.',
                      'Cool off on the terrace and enjoy the winter archipelago.',
                    ]
                  : [
                      'Varaa julkinen saunavuoro tai yksityinen saunavuoro verkossa.',
                      'Saavu osoitteeseen Meripellontie 11, 00970 Helsinki.',
                      'Lämmittele puulämmitteisessä saunassa tai aloita avannolla.',
                      'Pulahda avantoon omaan tahtiin, niin monta kertaa kuin haluat.',
                      'Vilvoittele terassilla ja nauti talvisesta saaristosta.',
                    ]
                ).map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Avannot Helsingissä */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-3xl">
          <AnimatedSection>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Ice holes in Helsinki' : 'Avannot Helsingissä'}
            </h2>
            <div className="space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
              <p>
                {isEn
                  ? 'Helsinki has several winter swimming spots, but few offer a real sea ice hole and a hot wood-fired sauna side by side. In Puotila you get both!'
                  : 'Helsingissä on useita talviuintipaikkoja, mutta harvassa on tarjolla oikean meriavanto ja kuumaa puulämmitteinen sauna vierekkäin. Puotilassa saat molemmat!'}
              </p>
              <p>
                {isEn
                  ? 'Our ice hole is kept open all winter by the sauna boats off Puotila harbour. The ice hole is opened daily when the sea freezes, and steps and handrails make getting in and out safe.'
                  : 'Avantomme pidetään auki koko talven Puotilan sataman edustalla saunalauttojen luona. Avantoa avataan päivittäin meren jäätyessä, ja portaat sekä käsijohteet tekevät veteen menosta ja sieltä pois tulosta turvallista.'}
              </p>
              <p>
                {isEn
                  ? 'If you are comparing ice swimming spots in Helsinki, ask yourself: does the spot have a sauna right next to the ice hole? With us, the answer is always yes — and the löyly is hot.'
                  : 'Jos vertaat avantouintipaikkoja Helsingissä, kysy itseltäsi: onko paikassa saunaa aivan avannon vieressä? Meillä vastaus on aina kyllä, ja löylyt ovat kuumat.'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Avantoon meneminen */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-3xl">
          <AnimatedSection>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Getting into the ice hole' : 'Avantoon meneminen'}
            </h2>
            <ol className="space-y-4 text-base leading-relaxed text-stone-600 md:text-lg">
              {(isEn
                ? [
                    'Be healthy — it is not smart to go into the ice hole with a flu.',
                    'Warm up or don\'t warm up. The hardcore ones don\'t need a sauna before the ice hole!',
                    'Cool down. Don\'t go straight from the löyly into the ice hole. Give your body a moment to cool before stepping in.',
                    'Breathe. Try to even out your breathing. You\'ll catch the enjoyment of the ice hole when you breathe and listen to your body.',
                    'Calm down. When rising from the ice hole, try to stay calm. That\'s how you enjoy winter and the change in temperature.',
                  ]
                : [
                    'Ole terve — avantoon ei ole fiksua mennä flunssassa.',
                    'Lämmittele tai ole lämmittelemättä. Kovanahkaiset eivät tarvitse saunaa ennen avantoa!',
                    'Jäähdyttele. Älä mene suoraan löylystä avantoon. Anna kropalle hetki aikaa jäähtyä ennen avantoon astumista.',
                    'Hengitä. Pyri tasaamaan hengityksesi. Avannon nautintoon saa kiinni, kun hengität ja kuuntelet kroppaasi.',
                    'Rauhoitu. Noustessasi avannosta, pyri pysymään rauhallisena. Näin nautit talvesta ja lämpötilan muutoksesta.',
                  ]
              ).map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </AnimatedSection>
        </div>
      </section>

      {/* Why ice swimming */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="font-corben mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Why come winter swimming with us?' : 'Miksi tulla talviuintiin ja avantoon meille?'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((item) => (
                <div key={item.title} className="rounded-2xl bg-[#faf9f7] p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600 md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery */}
      <AnimatedSection>
        <SquareGallery
          images={[
            { id: '1', src: '/images/gallery-ice-swimming.webp', alt: isEn ? 'Ice swimming in Helsinki' : 'Avantouinti Helsingissä' },
            { id: '2', src: '/images/gallery-winter-sunset.webp', alt: isEn ? 'Winter evening at the sauna' : 'Talvi-ilta saunalla' },
            { id: '3', src: '/images/gallery-winter-swim.webp', alt: isEn ? 'Ice swimming in winter' : 'Avantouinti talvella' },
            { id: '4', src: '/images/saunaboat-winter-sun.webp', alt: isEn ? 'Sauna boat in winter sun' : 'Saunalautta talvisessa auringossa' },
            { id: '5', src: '/images/gallery-avanto-woman.webp', alt: isEn ? 'Ice swimmer at Hyvän Tuulen Sauna' : 'Avantouija Hyvän Tuulen Saunalla' },
            { id: '6', src: '/images/gallery-winter-dock.webp', alt: isEn ? 'Winter dock at Aurinkolahti' : 'Talvinen laituri Aurinkolahdessa' },
          ]}
          title={isEn ? 'Winter moments' : 'Talvisia hetkiä'}
        />
      </AnimatedSection>

      {/* FAQ */}
      <FAQAccordion
        items={faqItems}
        title={isEn ? 'Frequently asked questions about ice swimming' : 'Usein kysyttyä avantouinnista'}
        locale={safeLocale}
      />

      {/* Final CTA */}
      <FinalCTA
        title={isEn ? 'Ready for the ice hole?' : 'Valmiina avantoon?'}
        description={isEn
          ? 'Book a sauna session and try ice swimming in the Helsinki archipelago.'
          : 'Varaa saunavuoro ja kokeile avantouintia Helsingin saaristossa.'}
        primaryCta={{ text: isEn ? 'Book a session' : 'Varaa vuoro', href: '/julkinen-sauna' }}
        secondaryCta={{ text: isEn ? 'Call us' : 'Soita meille', href: 'tel:+358442313546' }}
        variant="dark"
      />
    </>
  );
}
