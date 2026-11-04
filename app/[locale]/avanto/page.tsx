import type { Metadata } from 'next';
import Image from 'next/image';
import HeroSection from '@/components/sections/HeroSection';
import FAQAccordion from '@/components/sections/FAQAccordion';
import FinalCTA from '@/components/sections/FinalCTA';
import AnimatedSection from '@/components/AnimatedSection';
import SquareGallery from '@/components/sections/SquareGallery';
import { getFAQsByCategory } from '@/content/faq';
import { generateServiceSchema, generateBreadcrumbSchema, generateArticleSchema, generateHowToSchema, generateFAQSchema } from '../schema';
import { SITE_URL } from '@/lib/site';
import WinterSaunaCards from '@/components/sections/WinterSaunaCards';
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
      ? "Try ice swimming and warm up in a wood-fired sauna by the sea in Puotila, Helsinki. Join a public session or book a private sauna for your group."
      : 'Koe avantouinti ja puusaunan lämpö meren äärellä Puotilassa, Helsingissä. Tule yleiselle saunavuorolle tai varaa yksityinen sauna omalle porukallesi.',
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
        ? 'Ice swimming and a wood-fired sauna by the sea in Puotila.'
        : 'Avantouinti ja puulämmitteinen sauna meren äärellä Puotilassa.',
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
          'A hole in the ice and a wood-fired sauna by the sea in Puotila. Join a public session or book the sauna spot for your own group — open all year round.',
        ctaText: 'Book a public session',
        ctaHref: '/julkinen-sauna',
        secondaryCta: {
          text: 'Book a private session',
          href: '#talvisaunat',
        },
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
          'Avanto ja puulämmitteinen sauna meren äärellä Puotilassa. Tule julkiselle vuorolle tai varaa saunatila omalle porukalle — toimintaa ympäri vuoden.',
        ctaText: 'Varaa julkinen vuoro',
        ctaHref: '/julkinen-sauna',
        secondaryCta: {
          text: 'Varaa yksityinen vuoro',
          href: '#talvisaunat',
        },
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
      ? 'Ice swimming and wood-fired sauna in a maritime setting in Puotila, Helsinki. Public sessions and private bookings all year round.'
      : 'Avantouinti ja puulämmitteinen sauna merellisessä ympäristössä Puotilassa. Julkiset vuorot ja yksityisvaraukset ympäri vuoden.',
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
      ? 'Ice swimming and a wood-fired sauna by the sea in Puotila, Helsinki.'
      : 'Avantouinti ja puulämmitteinen sauna meren äärellä Puotilassa, Helsingissä.',
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

      <HeroSection content={hero} variant="page" banner={isEn ? 'Early bird offers — valid until Nov 15' : 'Early bird -tarjoukset — voimassa 15.11. asti'} />

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
            <h2 className="font-display mb-6 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
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
                  ? 'By booking the whole sauna boat you make sure the place is all yours. Christmas parties, birthdays or team recreation days? We have hosted plenty! There is a pizzeria next door with good and affordable pizzas for the sauna. Big group? Book both saunas! In that case, call us.'
                  : 'Varaamalla koko lautan itsellesi varmistat sen, että paikalle on vaan sun oma porukka. Pikkujoulut, synttärit tai virkkarit? Näitä meillä on ollut paljon! Naapurissa on pizzeria, josta saa hyvät ja edulliset pizzat saunalle. Iso porukka? Varaa molemmat saunat! Soita tällöin'}{' '}
                <a href="tel:+358442313546" className="font-semibold text-lake hover:underline">
                  044 231 3546
                </a>
                .
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Virta & Aalto -kortit (talvi) */}
      <section id="talvisaunat" className="scroll-mt-24">
        <WinterSaunaCards locale={safeLocale} />
      </section>


      {/* Tietoa avantouinnista */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-5xl">
          <AnimatedSection>
            <h2 className="font-display mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
              {isEn ? 'About ice swimming' : 'Tietoa avantouinnista'}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: isEn ? 'Gear' : 'Tarvikkeet',
                  text: isEn
                    ? "You don't need to bring anything other than a swimsuit. Socks and gloves are optional — you'll know whether you want to use them by trying!"
                    : 'Et tarvitse mukaan muuta kuin uima-asun. Sukat ja hanskat ovat vapaaehtoisia. Tiedät haluatko käyttää niitä kokeilemalla!',
                },
                {
                  title: isEn ? 'Breathing' : 'Hengitys',
                  text: isEn
                    ? 'When entering the ice hole it is important to keep your breathing steady, your mind calm and your attitude brave. That is how you enjoy it in the best possible way.'
                    : 'Avantoon mennessä on tärkeää pitää hengitys tasaisena, mieli rauhallisena ja asenne rohkeana. Näin saat nautittua siitä parhaalla mahdollisella tavalla.',
                },
                {
                  title: isEn ? 'Swimming' : 'Uinti',
                  text: isEn
                    ? 'Swimming in cold water is challenging. This is something that gets easier with practice.'
                    : 'Uiminen kylmässä vedessä on haastavaa. Tämä on asia, joka helpottuu harjoittamalla.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-background p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600 md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Saapuminen meille */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-white p-8 md:p-12">
              <h2 className="font-display mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl">
                {isEn ? 'Getting to us' : 'Saapuminen meille'}
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-stone-600 md:text-lg">
                <div>
                  <h3 className="mb-2 font-bold text-stone-900">{isEn ? 'Arrive on site' : 'Tule paikalle'}</h3>
                  <p>
                    {isEn
                      ? 'Arrive 5 minutes before your session starts. There is no need to come much earlier.'
                      : 'Tule paikalle 5 min ennen vuorosi alkua. Ei ole tarvetta tulla juurikaan aikaisemmin.'}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-stone-900">{isEn ? 'Parking' : 'Parkkeeraa'}</h3>
                  <p>
                    {isEn
                      ? 'You can leave your car along Meripellontie. There are plenty of 4-hour disc parking spaces on Meripellontie.'
                      : 'Auton voi jättää Meripellontien varteen. Meripellontiellä on paljon 4h kiekkopaikkoja.'}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-stone-900">{isEn ? 'By public transport' : 'Julkisilla'}</h3>
                  <p>
                    {isEn
                      ? 'A bus comes right next to Meripellontie, and from Rastila metro station it is not a long walk either (15 min on foot).'
                      : 'Meripellontielle tulee bussi aivan viereen, metrolta Rastilasta ei ole myöskään pitkä matka (15 min kävellen).'}
                  </p>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl shadow-lg aspect-video bg-stone-200">
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
            { id: '3', src: '/images/gallery-winter-sunset.webp', alt: isEn ? 'Winter evening at the sauna' : 'Talvi-ilta saunalla' },
            { id: '4', src: '/images/saunaboat-winter-sun.webp', alt: isEn ? 'Sauna boat in winter sun' : 'Saunalautta talvisessa auringossa' },
            { id: '5', src: '/images/gallery-avanto-woman.webp', alt: isEn ? 'Ice swimmer at Hyvän Tuulen Sauna' : 'Avantouija Hyvän Tuulen Saunalla' },
            { id: '6', src: '/images/gallery-winter-dock.webp', alt: isEn ? 'Winter dock in Puotila' : 'Talvinen laituri Puotilassa' },
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
