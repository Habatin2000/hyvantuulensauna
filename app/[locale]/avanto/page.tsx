import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
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

      {/* Virta & Aalto -kortit (talvi) */}
      <section id="talvisaunat" className="scroll-mt-24">
        <WinterSaunaCards locale={safeLocale} />
      </section>

      {/* Sektio 2: Palvelumme */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="mb-10 text-center md:mb-12">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                {isEn ? 'Services' : 'Palvelut'}
              </p>
              <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
                {isEn ? 'Our services' : 'Palvelumme'}
              </h2>
            </div>
          </AnimatedSection>

          {/* Hinnasto */}
          <AnimatedSection delay={80}>
            <div className="mb-10 flex flex-wrap items-stretch justify-center gap-4">
              <div className="rounded-2xl border border-stone-200 bg-white px-8 py-5 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  {isEn ? 'Sauna boat Virta' : 'Virta-sauna'}
                </p>
                <p className="mt-1 text-3xl font-extrabold text-[#3b82f6]">
                  120 € <span className="text-base font-medium text-stone-500">/ 2 h</span>
                </p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white px-8 py-5 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  {isEn ? 'Sauna boat Aalto' : 'Aalto-sauna'}
                </p>
                <p className="mt-1 text-3xl font-extrabold text-[#3b82f6]">
                  140 € <span className="text-base font-medium text-stone-500">/ 2 h</span>
                </p>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Yksityinen avantosauna */}
            <AnimatedSection delay={150}>
              <div className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl bg-stone-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Image
                  src="/images/saunaboat-winter-sun.webp"
                  alt={isEn ? 'Sauna boat in the winter sun' : 'Saunalautta talvisessa auringossa'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
                <div className="relative z-10 p-6 md:p-8">
                  <h3 className="font-corben text-2xl font-bold text-white md:text-3xl">
                    {isEn ? 'Private sauna rental' : 'Yksityinen avantosauna'}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-100 md:text-base">
                    {isEn
                      ? 'Rent the whole sauna for your own use! Aalto sauna fits ten people, Virta sauna six. You can rent either one or both!'
                      : 'Vuokraa koko sauna omaan käyttöösi! Aalto-saunalle mahtuu mukaan kymmenen henkeä, Virta-saunalle taas kuusi. Voit vuokrata joko jomman kumman tai molemmat käyttöösi!'}
                  </p>
                  <a
                    href="#talvisaunat"
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-xl"
                  >
                    {isEn ? 'Book here' : 'Varaa tästä'}
                  </a>
                </div>
              </div>
            </AnimatedSection>

            {/* Talviuintia ohjatusti */}
            <AnimatedSection delay={250}>
              <Link
                href="/julkinen-sauna"
                className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl bg-stone-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src="/images/gallery-ice-swimming.webp"
                  alt={isEn ? 'Ice swimming in Helsinki' : 'Avantouinti Helsingissä'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
                <div className="relative z-10 p-6 md:p-8">
                  <h3 className="font-corben text-2xl font-bold text-white md:text-3xl">
                    {isEn ? 'Guided winter swimming' : 'Talviuintia ohjatusti'}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-100 md:text-base">
                    {isEn
                      ? 'On our public sessions we go through the basics of winter swimming. The saunas are hot, the ice hole is open and spots are limited. The session lasts two hours.'
                      : 'Julkisilla vuoroillamme käymme läpi talviuinnin perusteet. Saunat ovat kuumana, avanto on auki ja paikkoja on rajoitetusti. Vuoro kestää kaksi tuntia.'}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-400">
                    {isEn ? 'To the public sauna page' : 'Julkisen saunan sivulle'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Sektio 3: Tietoa avantouinnista */}
      <section className="section-padding bg-[#faf9f7]">
        <div className="container-padding mx-auto max-w-5xl">
          <AnimatedSection>
            <h2 className="font-corben mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl lg:text-4xl">
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
                <div key={item.title} className="rounded-2xl bg-[#faf9f7] p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600 md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sektio 4: Saapuminen meille */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="rounded-3xl bg-white p-8 md:p-12">
              <h2 className="font-corben mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl">
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
