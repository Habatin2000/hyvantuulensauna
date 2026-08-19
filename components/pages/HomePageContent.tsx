import HeroSection from "@/components/sections/HeroSection";
import TrustBar from "@/components/sections/TrustBar";
import ServiceTabs from "@/components/sections/ServiceTabs";
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
  type Locale,
} from "@/content/homepage";
import { getFAQsByCategory } from "@/content/faq";
import { Link } from "@/i18n/navigation";

interface HomePageContentProps {
  locale: Locale;
  t: (key: string) => string;
}

const DATE_MODIFIED = "2026-06-08";

export default function HomePageContent({ locale }: HomePageContentProps) {
  const faqItems = getFAQsByCategory("general").slice(0, 4);
  const homepageHero = getHomepageHero(locale);
  const trustBadges = getTrustBadges(locale);
  const homepageFeatures = getHomepageFeatures(locale);
  const storyContent = getStoryContent(locale);

  return (
    <>
      <HeroSection content={homepageHero} variant="homepage" />
      <TrustBar badges={trustBadges} />
      <AnimatedSection>
        <section className="py-6 bg-white">
          <div className="container-padding mx-auto max-w-4xl">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-5 md:p-6 text-left">
              <p className="text-xs text-stone-500 mb-3">
                {locale === "en" ? "Updated" : "Päivitetty"}{" "}
                {new Date(DATE_MODIFIED).toLocaleDateString(locale === "en" ? "en-GB" : "fi-FI")}
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong className="text-stone-900">
                  {locale === "en"
                    ? "Hyvän Tuulen Sauna offers authentic Finnish sauna experiences by the sea in Helsinki."
                    : "Hyvän Tuulen Sauna tarjoaa aitoja suomalaisia saunaelämyksiä merellisessä Helsingissä."}
                </strong>{" "}
                {locale === "en" ? (
                  <>
                    With eight years of experience, we organize{" "}
                    <Link href="/saunalauttaristeilyt-helsingissa" className="text-blue-700 hover:underline">sauna boat cruises</Link>
                    ,{" "}
                    <Link href="/julkinen-sauna" className="text-blue-700 hover:underline">public sauna sessions</Link>
                    {" and "}
                    <Link href="/yksityissauna" className="text-blue-700 hover:underline">private events</Link>
                    {" from Kalkkihiekantori pier in Aurinkolahti."}
                  </>
                ) : (
                  <>
                    Kahdeksan vuoden kokemuksella järjestämme{" "}
                    <Link href="/saunalauttaristeilyt-helsingissa" className="text-blue-700 hover:underline">saunalauttaristeilyjä</Link>
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
        <ServiceTabs locale={locale} />
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
          title={locale === "en" ? "Why choose Hyvän Tuulen Sauna?" : "Miksi valita Hyvän Tuulen Sauna?"}
          subtitle={locale === "en" ? "Experiences at sea" : "Kokemuksia merellä"}
          columns={5}
        />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <GalleryPreview
          images={getGalleryPreviewImages(locale)}
          title={locale === "en" ? "Gallery" : "Galleria"}
          subtitle={locale === "en" ? "Moments from our sauna boats" : "Tunnelmia saunalautoiltamme"}
          locale={locale}
        />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <FAQAccordion
          items={faqItems}
          title={locale === "en" ? "FAQ" : "Usein kysyttyä"}
          showAllLink
          locale={locale}
        />
      </AnimatedSection>
      <FinalCTA
        title={locale === "en" ? "Book your sauna experience today" : "Varaa saunaelämys tänään"}
        description={locale === "en"
          ? "Welcome to enjoy the most fun moments of the summer at Hyvän Tuulen Sauna <3"
          : "Tervetuloa nauttimaan kesän hauskimmista hetkistä Hyvän Tuulen Saunalle <3"}
        primaryCta={{ text: locale === "en" ? "Book a sauna boat" : "Varaa saunalautta", href: "/saunalauttaristeilyt-helsingissa#boats" }}
        secondaryCta={{ text: locale === "en" ? "Call us" : "Soita meille", href: "tel:+358442313546" }}
        variant="dark"
      />
      <StickyMobileCTA />
    </>
  );
}
