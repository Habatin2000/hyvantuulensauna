import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import AnimatedSection from '@/components/AnimatedSection';
import SquareGallery from '@/components/sections/SquareGallery';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateBreadcrumbSchema, generateArticleSchema, generateHowToSchema } from '../schema';
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
      ? 'Ice Swimming & Sauna in Helsinki | Hyvän Tuulen Sauna'
      : 'Avanto ja saunatila Helsingissä | Hyvän Tuulen Sauna',
    description: isEn
      ? 'Ice swimming and a wood-fired sauna by the sea in Aurinkolahti, Helsinki. Join a public session or book a private sauna spot all year round.'
      : 'Avantouinti ja puulämmitteinen sauna meren äärellä Aurinkolahdessa, Helsingissä. Tule julkiselle vuorolle tai varaa yksityinen saunatila ympäri vuoden.',
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
        : 'Avanto ja saunatila Helsingissä | Hyvän Tuulen Sauna',
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

  const faqItems = getFAQsByCategory('general', safeLocale);

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
        title: 'Avanto ja saunatila Helsingissä',
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
    isEn ? 'Ice swimming and sauna in Helsinki' : 'Avanto ja saunatila Helsingissä',
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
    isEn ? 'Ice Swimming & Sauna in Helsinki' : 'Avanto ja saunatila Helsingissä',
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
          __html: JSON.stringify([serviceSchema, breadcrumbSchema, articleSchema, howToSchema]),
        }}
      />

      <HeroSection content={hero} variant="page" />

      {/* Intro */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-3xl">
          <AnimatedSection>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Ice swimming in Helsinki' : 'Avantouinti Helsingissä'}
            </p>
            <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Ice hole and sauna by the sea' : 'Avanto ja sauna meren äärellä'}
            </h2>
            <div className="space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
              <p>
                {isEn
                  ? 'Ice swimming at Hyvän Tuulen Sauna is the most authentic way to experience a Finnish winter. The sauna warms you up, the ice hole wakes you up — and the sea air of Aurinkolahti does the rest.'
                  : 'Avantouinti Hyvän Tuulen Saunalla on aitoin tapa kokea suomalainen talvi. Sauna lämmittää, avanto virkistää — ja Aurinkolahden meri-ilma hoitaa loput.'}
              </p>
              <p>
                {isEn
                  ? 'You can join a public sauna session or book the whole sauna spot for your own group. Ice swimming is included in the public sessions whenever there is ice — and when there is not, the sea is open for a swim anyway.'
                  : 'Voit tulla mukaan julkiselle saunavuorolle tai varata koko saunatilan omalle porukalle. Avanto kuuluu julkisiin vuoroihin aina kun jäätä on — ja kun ei ole, meri on avoinna uimiseen silti.'}
              </p>
              <p className="font-semibold text-stone-800">
                {isEn
                  ? 'First-timer? Do not worry — most of our guests try ice swimming for the first time with us.'
                  : 'Ensikertalainen? Ei hätää — suurin osa vieraistamme kokeilee avantouintia ensimmäistä kertaa meillä.'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why ice swimming */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="font-corben mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'Why come ice swimming with us?' : 'Miksi tulla avantoon meille?'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((item) => (
                <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600 md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-[#faf9f7] p-8 md:p-12">
              <h2 className="font-corben mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl">
                {isEn ? 'How a winter session works' : 'Näin talvivuoro toimii'}
              </h2>
              <ol className="space-y-4 text-base leading-relaxed text-stone-600 md:text-lg">
                {(isEn
                  ? [
                      'Book a public sauna session online or ask about a private booking.',
                      'Arrive at Kalkkihiekantori, 00980 Helsinki — the boat takes you to the sauna spot.',
                      'Heat up in the wood-fired sauna.',
                      'Take a dip in the ice hole at your own pace — as many times as you like.',
                      'Cool off on the terrace and enjoy the winter archipelago.',
                    ]
                  : [
                      'Varaa julkinen saunavuoro verkossa tai kysy yksityisvarausta.',
                      'Saavu osoitteeseen Kalkkihiekantori, 00980 Helsinki — vene vie sinut saunatilalle.',
                      'Lämmittele puulämmitteisessä saunassa.',
                      'Pulahda avantoon omaan tahtiin — niin monta kertaa kuin haluat.',
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
        title={isEn ? 'Frequently asked questions' : 'Usein kysyttyä'}
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
