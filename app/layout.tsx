import type { Metadata } from "next";
import { Quicksand, Corben, Pacifico } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { organizationSchema, websiteSchema } from "./schema";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import MetaPixel from "@/components/MetaPixel";
import CookieConsent from "@/components/CookieConsent";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const corben = Corben({
  variable: "--font-corben",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hyvän Tuulen Sauna | Saunalautat Helsingissä",
    template: "%s | Hyvän Tuulen Sauna"
  },
  description: "Aito suomalainen saunaelämys merellisessä Helsingissä. Varaa saunalautta kesäksi tai yksityissauna ympäri vuoden. Kalkkihiekantori, Aurinkolahti, Helsinki.",

  authors: [{ name: "Hyvän Tuulen Sauna" }],
  creator: "Hyvän Tuulen Sauna",
  publisher: "Hyvän Tuulen Sauna",
  metadataBase: new URL("https://hyvantuulensauna.fi"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    url: "https://hyvantuulensauna.fi",
    siteName: "Hyvän Tuulen Sauna",
    title: "Hyvän Tuulen Sauna | Saunalautat Helsingissä",
    description: "Aito suomalainen saunaelämys merellisessä Helsingissä. Varaa saunalautta kesäksi tai yksityissauna ympäri vuoden.",
    images: [
      {
        url: "/images/gallery-raft-sunset.webp",
        width: 1200,
        height: 630,
        alt: "Hyvän Tuulen Sauna - Saunalautta auringonlaskussa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyvän Tuulen Sauna | Saunalautat Helsingissä",
    description: "Aito suomalainen saunaelämys merellisessä Helsingissä. Varaa saunalautta kesäksi tai yksityissauna ympäri vuoden.",
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
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/gallery-raft-sunset.webp"
          type="image/webp"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
      </head>
      <body
        className={`${quicksand.variable} ${corben.variable} ${pacifico.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <AnalyticsProvider />
        <MetaPixel />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
