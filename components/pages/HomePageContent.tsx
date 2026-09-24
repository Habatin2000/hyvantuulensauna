import HeroSection from "@/components/sections/HeroSection";
import TrustBar from "@/components/sections/TrustBar";
import StorySection from "@/components/sections/StorySection";
import LazyGoogleReviews from "@/components/sections/LazyGoogleReviews";
import FeatureGrid from "@/components/sections/FeatureGrid";
import GalleryPreview from "@/components/sections/GalleryPreview";
import FAQAccordion from "@/components/sections/FAQAccordion";
import FinalCTA from "@/components/sections/FinalCTA";
import AnimatedSection from "@/components/AnimatedSection";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import {
  getHomepageHero,
  getTrustBadges,
  getHomepageFeatures,
  getGalleryPreviewImages,
  getStoryContent,
  getExperienceCards,
  type Locale,
} from "@/content/homepage";
import { getFAQsByCategory } from "@/content/faq";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HomePageContentProps {
  locale: Locale;
  t: (key: string) => string;
}

const DATE_MODIFIED = "2026-09-24";

export default function HomePageContent({ locale }: HomePageContentProps) {
  const faqItems = getFAQsByCategory("general").slice(0, 4);
  const homepageHero = getHomepageHero(locale);
  const trustBadges = getTrustBadges(locale);
  const homepageFeatures = getHomepageFeatures(locale);
  const storyContent = getStoryContent(locale);
  const experienceCards = getExperienceCards(locale);
  const isEn = locale === "en";

  return (
    <>
      <HeroSection content={homepageHero} variant="homepage" />
      <TrustBar badges={trustBadges} />

      {/* Saunominen Helsingissä */}
      <AnimatedSection>
        <section className="section-padding bg-white">
          <div className="container-padding mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {isEn ? 'Sauna in Helsinki' : 'Saunominen Helsingissä'}
            </p>
            <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
              {isEn ? 'Sauna experiences in Helsinki all year round' : 'Saunomista Helsingissä ympäri vuoden'}
            </h2>
            <div className="mt-6 space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
              <p>
                {isEn
                  ? 'Hyvän Tuulen Sauna offers sauna experiences in Helsinki all year round. For us, a sauna is not just a place to throw löyly, but a complete experience that combines a warm wood-fired sauna, maritime scenery, swimming and spending time together.'
                  : 'Hyvän Tuulen Sauna tarjoaa saunomista Helsingissä ympäri vuoden. Meille sauna ei ole vain paikka, jossa käydään löylyissä, vaan kokonaisuus, jossa yhdistyvät lämmin puusauna, merelliset maisemat, uiminen ja yhdessäolo.'}
              </p>
              <p>
                {isEn
                  ? 'In the Eastern Helsinki archipelago you can sauna in the middle of nature, just a stone\'s throw from Helsinki city centre. You can come and enjoy a public sauna session or book a sauna for private use for your own group.'
                  : 'Itä-Helsingin saaristossa pääset saunomaan luonnon keskellä, vain kivenheiton päässä Helsingin keskustasta. Voit tulla nauttimaan julkisesta saunavuorosta tai varata saunan yksityiseen käyttöön omalle porukallesi.'}
              </p>
              <p>
                {isEn
                  ? 'In summer the sauna experience includes the sea and swimming, in winter an ice hole and a peaceful archipelago landscape. Whatever the season, an authentic and atmospheric sauna experience in Helsinki awaits.'
                  : 'Kesällä saunomiseen kuuluu meri ja uiminen, talvella avanto ja rauhallinen saaristomaisema. Vuodenajasta riippumatta luvassa on aito ja tunnelmallinen saunaelämys Helsingissä.'}
              </p>
              <p className="font-semibold text-stone-800">
                {isEn
                  ? 'Explore the sauna options and find the right way for you to enjoy Hyvän Tuulen Sauna.'
                  : 'Tutustu saunomisen vaihtoehtoihin ja löydä itsellesi sopiva tapa nauttia Hyvän Tuulen Saunasta.'}
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Valitse oma elämyksesi */}
      <AnimatedSection delay={100}>
        <section className="section-padding bg-[#faf9f7]">
          <div className="container-padding mx-auto max-w-6xl">
            <div className="mb-10 text-center md:mb-12">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
                {isEn ? 'Choose your experience' : 'Valitse oma elämyksesi'}
              </p>
              <h2 className="font-corben text-2xl font-bold text-stone-900 md:text-3xl">
                {isEn ? 'How do you want to sauna?' : 'Miten haluat saunoa?'}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {experienceCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-3xl bg-stone-900 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
                  <div className="relative z-10 p-6 md:p-8">
                    <h3 className="font-corben text-2xl font-bold text-white md:text-3xl">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-100 md:text-base">
                      {card.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-400">
                      {card.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <StorySection
          title={storyContent.title}
          quote={storyContent.quote}
          paragraphs={storyContent.paragraphs}
          image={storyContent.image}
        />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <LazyGoogleReviews />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <FeatureGrid
          features={homepageFeatures}
          title={isEn ? "Why choose Hyvän Tuulen Sauna?" : "Miksi valita Hyvän Tuulen Sauna?"}
          subtitle={isEn ? "Experiences at sea" : "Kokemuksia merellä"}
          columns={5}
        />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <GalleryPreview
          images={getGalleryPreviewImages(locale)}
          title={isEn ? "Gallery" : "Galleria"}
          subtitle={isEn ? "Moments from our sauna boats" : "Tunnelmia saunalautoiltamme"}
          locale={locale}
        />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <section className="py-6 bg-white">
          <div className="container-padding mx-auto max-w-4xl">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-5 md:p-6 text-left">
              <p className="text-xs text-stone-500 mb-3">
                {isEn ? "Updated" : "Päivitetty"}{" "}
                {new Date(DATE_MODIFIED).toLocaleDateString(isEn ? "en-GB" : "fi-FI")}
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong className="text-stone-900">
                  {isEn
                    ? "Hyvän Tuulen Sauna offers authentic Finnish sauna experiences by the sea in Helsinki."
                    : "Hyvän Tuulen Sauna tarjoaa aitoja suomalaisia saunaelämyksiä merellisessä Helsingissä."}
                </strong>{" "}
                {isEn ? (
                  <>
                    With eight years of experience, we organize{" "}
                    <Link href="/saunalauttaristeilyt-helsingissa" className="text-blue-700 hover:underline">sauna boat cruises in Helsinki</Link>
                    ,{" "}
                    <Link href="/julkinen-sauna" className="text-blue-700 hover:underline">public sauna sessions</Link>
                    {" and "}
                    <Link href="/yksityissauna" className="text-blue-700 hover:underline">private events</Link>
                    {" from Kalkkihiekantori pier in Aurinkolahti."}
                  </>
                ) : (
                  <>
                    Kahdeksan vuoden kokemuksella järjestämme{" "}
                    <Link href="/saunalauttaristeilyt-helsingissa" className="text-blue-700 hover:underline">saunalauttaristeilyjä Helsingissä</Link>
                    ,{" "}
                    <Link href="/julkinen-sauna" className="text-blue-700 hover:underline">julkisia saunavuoroja</Link>
                    {" ja "}
                    <Link href="/yksityissauna" className="text-blue-700 hover:underline">yksityistilaisuuksia</Link>
                    {" Kalkkihiekantorin laivalaiturista Aurinkolahdessa."}
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <FAQAccordion
          items={faqItems}
          title={isEn ? "FAQ" : "Usein kysyttyä"}
          showAllLink
          locale={locale}
        />
      </AnimatedSection>
      <FinalCTA
        title={isEn ? "Book your sauna experience today" : "Varaa saunaelämys tänään"}
        description={isEn
          ? "Welcome to enjoy the most fun moments of the summer at Hyvän Tuulen Sauna <3"
          : "Tervetuloa nauttimaan kesän hauskimmista hetkistä Hyvän Tuulen Saunalle <3"}
        primaryCta={{ text: isEn ? "Book a sauna boat" : "Varaa saunalautta", href: { pathname: "/saunalauttaristeilyt-helsingissa", hash: "boats" } }}
        secondaryCta={{ text: isEn ? "Call us" : "Soita meille", href: "tel:+358442313546" }}
        variant="dark"
      />
      <StickyMobileCTA />
    </>
  );
}
