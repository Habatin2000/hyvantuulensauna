import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Quicksand, Corben, Pacifico } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import RouteTracker from "@/components/analytics/RouteTracker";
import { getOrganizationSchema, websiteSchema } from "./schema";
import { SITE_URL } from "@/lib/site";
import ConsentBanner from "@/components/analytics/ConsentBanner";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const corben = Corben({
  variable: "--font-corben",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const isEnglish = locale === 'en';
  
  const title = isEnglish
    ? "Hyvän Tuulen Sauna | Sauna Boats in Helsinki"
    : "Hyvän Tuulen Sauna | Saunalautat Helsingissä";
  
  const description = isEnglish
    ? "Authentic Finnish sauna experience by the sea in Helsinki. Book a sauna boat for summer or a private sauna all year round. Kalkkihiekantori, Aurinkolahti, Helsinki."
    : "Aito suomalainen saunaelämys merellisessä Helsingissä. Varaa saunalautta kesäksi tai yksityissauna ympäri vuoden. Kalkkihiekantori, Aurinkolahti, Helsinki.";

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
        'x-default': `${SITE_URL}/`,
      },
    },
    openGraph: {
      type: "website",
      locale: isEnglish ? "en_US" : "fi_FI",
      url: SITE_URL,
      siteName: "Hyvän Tuulen Sauna",
      title,
      description,
      images: [
        {
          url: "/images/gallery-raft-sunset.webp",
          width: 1200,
          height: 630,
          alt: isEnglish
            ? "Hyvän Tuulen Sauna - Sauna boat at sunset"
            : "Hyvän Tuulen Sauna - Saunalautta auringonlaskussa",
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

export const viewport: Viewport = { themeColor: '#3b82f6' };

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
  const messages = await getMessages();

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getOrganizationSchema(locale === 'en' ? 'en' : 'fi'), websiteSchema]),
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
        className={`${quicksand.variable} ${corben.variable} ${pacifico.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <RouteTracker />
          <ConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
