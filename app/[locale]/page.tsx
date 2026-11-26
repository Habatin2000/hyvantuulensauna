import type { Metadata } from "next";
import VibePageContent, { pageCopy } from "@/components/vibe/VibePageContent";
import type { Locale } from "@/components/vibe/content";
import fiMessages from "@/messages/fi.json";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";
import frMessages from "@/messages/fr.json";
import deMessages from "@/messages/de.json";
import {
  getLanguageAlternates,
  getLocalizedPageUrl,
  getOpenGraphLocale,
  generateFAQSchema,
  normalizePageLocale,
} from "./schema";

const messages = {
  fi: fiMessages,
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // NOTE: read messages directly — next-intl's getTranslations({ locale })
  // resolves the request-locale (fi) instead of the explicit locale in this
  // generateMetadata context, which served Finnish titles on /en/.
  const safeLocale = normalizePageLocale(locale);
  const meta = messages[safeLocale].metadata;
  const pageUrl = getLocalizedPageUrl('/', safeLocale);

  return {
    title: { absolute: meta.defaultTitle },
    description: meta.defaultDescription,
    alternates: {
      canonical: pageUrl,
      languages: getLanguageAlternates('/'),
    },
    openGraph: {
      type: "website",
      locale: getOpenGraphLocale(safeLocale),
      url: pageUrl,
      siteName: meta.siteName,
      title: meta.defaultTitle,
      description: meta.defaultDescription,
      images: [
        {
          url: "/images/gallery-raft-sunset.webp",
          width: 1920,
          height: 2559,
          alt: meta.socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.defaultTitle,
      description: meta.defaultDescription,
      images: [
        {
          url: "/images/gallery-raft-sunset.webp",
          alt: meta.socialImageAlt,
        },
      ],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale) as Locale;
  const faqSchema = generateFAQSchema(pageCopy[safeLocale].faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />
      <VibePageContent locale={safeLocale} />
    </>
  );
}
