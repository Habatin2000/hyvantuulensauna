import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HomePageContent from "@/components/pages/HomePageContent";
import { SITE_URL } from "@/lib/site";
import type { Locale } from "@/content/homepage";
import fiMessages from "@/messages/fi.json";
import enMessages from "@/messages/en.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // NOTE: read messages directly — next-intl's getTranslations({ locale })
  // resolves the request-locale (fi) instead of the explicit locale in this
  // generateMetadata context, which served Finnish titles on /en/.
  const meta = (locale === "en" ? enMessages : fiMessages).metadata;
  const isEn = locale === "en";
  const pageUrl = isEn ? `${SITE_URL}/en` : SITE_URL;

  return {
    title: { absolute: meta.defaultTitle },
    description: meta.defaultDescription,
    alternates: {
      canonical: pageUrl,
      languages: {
        "fi-FI": `${SITE_URL}/`,
        "en-US": `${SITE_URL}/en/`,
        "en-GB": `${SITE_URL}/en/`,
        "x-default": `${SITE_URL}/`,
      },
    },
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "fi_FI",
      url: pageUrl,
      siteName: "Hyvän Tuulen Sauna",
      title: meta.defaultTitle,
      description: meta.defaultDescription,
      images: [
        {
          url: "/images/gallery-raft-sunset.webp",
          width: 1200,
          height: 630,
          alt: isEn
            ? "Hyvän Tuulen Sauna - Sauna boat at sunset"
            : "Hyvän Tuulen Sauna - Saunalautta auringonlaskussa",
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
  const safeLocale = (locale === "en" ? "en" : "fi") as Locale;
  const t = await getTranslations({ locale });
  return <HomePageContent locale={safeLocale} t={t} />;
}
