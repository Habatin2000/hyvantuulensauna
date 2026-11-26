import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import "../vibe/vibe.css";
import VibeHeader from "@/components/vibe/VibeHeader";
import VibeFooter from "@/components/vibe/VibeFooter";
import type { Locale } from "@/components/vibe/content";
import { getVibeRoute } from "@/components/vibe/routes";
import RouteTracker from "@/components/analytics/RouteTracker";
import { getOrganizationSchema, websiteSchema } from "./schema";
import { SITE_URL } from "@/lib/site";
import ConsentBanner from "@/components/analytics/ConsentBanner";

const quicksand = localFont({
  src: "../../public/fonts/quicksand-latin.woff2",
  variable: "--font-quicksand",
  weight: "400 700",
  display: "swap",
});

const corben = localFont({
  src: [
    {
      path: "../../public/fonts/corben-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/corben-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const pacifico = localFont({
  src: "../../public/fonts/pacifico-regular.woff2",
  variable: "--font-pacifico",
  weight: "400",
  display: "swap",
});

const metadataCopy: Record<Locale, { title: string; description: string; imageAlt: string }> = {
  fi: {
    title: "Hyvän Tuulen Sauna | Saunalautat Helsingissä",
    description: "Aito suomalainen saunaelämys merellisessä Helsingissä. Varaa saunalautta kesäksi tai yksityissauna ympäri vuoden. Kalkkihiekantori, Aurinkolahti, Helsinki.",
    imageAlt: "Hyvän Tuulen Sauna - Saunalautta auringonlaskussa",
  },
  en: {
    title: "Hyvän Tuulen Sauna | Sauna Boats in Helsinki",
    description: "Authentic Finnish sauna experience by the sea in Helsinki. Book a sauna boat for summer or a private sauna all year round. Kalkkihiekantori, Aurinkolahti, Helsinki.",
    imageAlt: "Hyvän Tuulen Sauna - Sauna boat at sunset",
  },
  es: {
    title: "Hyvän Tuulen Sauna | Saunas flotantes en Helsinki",
    description: "Auténtica experiencia de sauna finlandesa junto al mar en Helsinki. Reserva una embarcación con sauna en verano o una sauna privada durante todo el año. Kalkkihiekantori, Aurinkolahti, Helsinki.",
    imageAlt: "Hyvän Tuulen Sauna - Embarcación con sauna al atardecer",
  },
  fr: {
    title: "Hyvän Tuulen Sauna | Saunas flottants à Helsinki",
    description: "Une authentique expérience de sauna finlandais au bord de la mer à Helsinki. Réservez un radeau-sauna en été ou un sauna privé toute l’année. Kalkkihiekantori, Aurinkolahti, Helsinki.",
    imageAlt: "Hyvän Tuulen Sauna - Radeau-sauna au coucher du soleil",
  },
  de: {
    title: "Hyvän Tuulen Sauna | Saunaboote in Helsinki",
    description: "Authentisches finnisches Saunaerlebnis am Meer in Helsinki. Buchen Sie ein Saunaboot für den Sommer oder eine private Sauna für das ganze Jahr. Kalkkihiekantori, Aurinkolahti, Helsinki.",
    imageAlt: "Hyvän Tuulen Sauna - Saunaboot bei Sonnenuntergang",
  },
};

const openGraphLocales: Record<Locale, string> = {
  fi: 'fi_FI',
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
};

const skipToContent: Record<Locale, string> = {
  fi: 'Siirry sisältöön',
  en: 'Skip to content',
  es: 'Saltar al contenido',
  fr: 'Aller au contenu',
  de: 'Zum Inhalt springen',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const { title, description, imageAlt } = metadataCopy[safeLocale];
  const homeUrl = `${SITE_URL}${getVibeRoute('home', safeLocale)}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Hyvän Tuulen Sauna"
    },
    description,
    icons: {
      icon: "/images/favicon.ico",
      apple: "/apple-touch-icon.png",
      shortcut: "/images/favicon.ico",
    },
    alternates: {
      languages: {
        'fi-FI': `${SITE_URL}/`,
        'en-US': `${SITE_URL}/en/`,
        'en-GB': `${SITE_URL}/en/`,
        'es-ES': `${SITE_URL}/es/`,
        'fr-FR': `${SITE_URL}/fr/`,
        'de-DE': `${SITE_URL}/de/`,
        'x-default': `${SITE_URL}/`,
      },
    },
    openGraph: {
      type: "website",
      locale: openGraphLocales[safeLocale],
      url: homeUrl,
      siteName: "Hyvän Tuulen Sauna",
      title,
      description,
      images: [
        {
          url: "/images/gallery-raft-sunset.webp",
          width: 1920,
          height: 2559,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/gallery-raft-sunset.webp"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport: Viewport = { themeColor: '#F3F6F8' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* Consent defaults + dataLayer must be defined before gtag.js loads.
            Kept as an eager inline snippet on purpose: gtag() calls only queue
            onto window.dataLayer and are processed once gtag.js loads lazily. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'granted',
                security_storage: 'granted'
              });
              gtag('js', new Date());
              gtag('config', 'AW-17838327897');
              gtag('config', 'G-2LE9R6N8P5', { send_page_view: false });
              gtag('config', 'GT-PBNGTFCX');
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17838327897"
          strategy="lazyOnload"
        />
        {/* Google Preferred Sources button library */}
        <Script
          src="https://news.google.com/swg/js/v1/publisher.js"
          strategy="lazyOnload"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getOrganizationSchema(locale), websiteSchema]),
          }}
        />
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1035132709038943');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1035132709038943&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body
        className={`${quicksand.variable} ${corben.variable} ${pacifico.variable} vibe-shell theme-avanto font-sans antialiased min-h-screen flex flex-col`}
        style={{
          '--vibe-font-body': 'var(--font-quicksand)',
          '--vibe-font-display': 'var(--font-display)',
          '--vibe-font-logo': 'var(--font-pacifico)',
        } as React.CSSProperties}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <a className="vibe-skip-link" href="#main-content">
            {skipToContent[locale]}
          </a>
          <VibeHeader locale={locale} />
          {children}
          <VibeFooter locale={locale} />
          <RouteTracker />
          <ConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
