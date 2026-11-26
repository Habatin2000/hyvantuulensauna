// JSON-LD Structured Data for Hyvän Tuulen Sauna

import { SITE_URL } from '@/lib/site';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export type SchemaLocale = 'fi' | 'en' | 'es' | 'fr' | 'de';

const supportedLocales: SchemaLocale[] = ['fi', 'en', 'es', 'fr', 'de'];

const localizedPaths: Record<string, Partial<Record<SchemaLocale, string>>> = {
  '/saunalauttaristeilyt-helsingissa': {
    en: '/sauna-boat-cruises-helsinki',
    es: '/cruceros-en-sauna-helsinki',
    fr: '/croisieres-sauna-helsinki',
    de: '/sauna-bootstouren-helsinki',
  },
  '/julkinen-sauna': {
    en: '/public-sauna-helsinki',
    es: '/sauna-publica-helsinki',
    fr: '/sauna-public-helsinki',
    de: '/oeffentliche-sauna-helsinki',
  },
  '/avanto': {
    en: '/ice-swimming-sauna-helsinki',
    es: '/sauna-privada-helsinki',
    fr: '/sauna-prive-helsinki',
    de: '/private-sauna-helsinki',
  },
  '/polttarit-yritystilaisuudet': {
    en: '/bachelor-parties-corporate-events-helsinki',
    es: '/eventos-despedidas-empresas-helsinki',
    fr: '/evenements-helsinki',
    de: '/junggesellenabschiede-firmenevents-helsinki',
  },
  '/sijainti': {
    en: '/location',
    es: '/ubicacion',
    fr: '/acces',
    de: '/standort',
  },
  '/toiminnastamme': {
    en: '/about',
    es: '/sobre-nosotros',
    fr: '/a-propos',
    de: '/ueber-uns',
  },
  '/usein-kysyttya': {
    en: '/faq',
    es: '/preguntas-frecuentes',
    fr: '/faq',
    de: '/faq',
  },
  '/galleria': {
    en: '/gallery',
    es: '/galeria',
    fr: '/galerie',
    de: '/galerie',
  },
  '/kiitos': {
    en: '/thank-you',
    es: '/gracias',
    fr: '/merci',
    de: '/danke',
  },
};

export const normalizePageLocale = (locale: string): SchemaLocale =>
  supportedLocales.includes(locale as SchemaLocale) ? locale as SchemaLocale : 'fi';

export const getLocalizedPagePath = (path: string, locale: SchemaLocale) => {
  if (locale === 'fi') return path;
  const localizedPath = localizedPaths[path]?.[locale] ?? path;
  return `/${locale}${localizedPath === '/' ? '' : localizedPath}`;
};

export const getLocalizedPageUrl = (path: string, locale: SchemaLocale) => {
  const localizedPath = getLocalizedPagePath(path, locale);
  return `${SITE_URL}${localizedPath.endsWith('/') ? localizedPath : `${localizedPath}/`}`;
};

export const getLanguageAlternates = (path: string) => ({
  'fi-FI': getLocalizedPageUrl(path, 'fi'),
  'en-US': getLocalizedPageUrl(path, 'en'),
  'en-GB': getLocalizedPageUrl(path, 'en'),
  'es-ES': getLocalizedPageUrl(path, 'es'),
  'fr-FR': getLocalizedPageUrl(path, 'fr'),
  'de-DE': getLocalizedPageUrl(path, 'de'),
  'x-default': getLocalizedPageUrl(path, 'fi'),
});

export const getOpenGraphLocale = (locale: SchemaLocale) => ({
  fi: 'fi_FI',
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
})[locale];

export const getHomeLabel = (locale: SchemaLocale) => ({
  fi: 'Etusivu',
  en: 'Home',
  es: 'Inicio',
  fr: 'Accueil',
  de: 'Startseite',
})[locale];

const organizationCopy: Record<SchemaLocale, {
  description: string;
  openingHours: string;
  catalogName: string;
  offers: Array<{ name: string; description: string }>;
}> = {
  fi: {
    description: 'Aito suomalainen saunaelämys merellisessä Helsingissä. Saunalauttaristeilyt, yksityissauna ja julkinen sauna.',
    openingHours: 'Aukiolo varauksen mukaan',
    catalogName: 'Saunapalvelut',
    offers: [
      { name: 'Saunalauttaristeilyt', description: 'Kesäkauden saunalauttaristeilyt Helsingin itäisessä saaristossa' },
      { name: 'Julkinen sauna', description: 'Avoimet saunavuorot yleisölle' },
      { name: 'Yksityissauna', description: 'Yksityistilaisuuksien saunavuorot' },
    ],
  },
  en: {
    description: 'Authentic Finnish sauna experience in maritime Helsinki. Sauna boat cruises, private sauna and public sauna.',
    openingHours: 'Open by appointment',
    catalogName: 'Sauna services',
    offers: [
      { name: 'Sauna boat cruises', description: 'Summer season sauna boat cruises in the Eastern Helsinki archipelago' },
      { name: 'Public sauna', description: 'Open sauna sessions for the public' },
      { name: 'Private sauna', description: 'Sauna sessions for private events' },
    ],
  },
  es: {
    description: 'Auténtica experiencia de sauna finlandesa en el Helsinki marítimo. Cruceros en sauna flotante, sauna privada y sauna pública.',
    openingHours: 'Abierto con reserva previa',
    catalogName: 'Servicios de sauna',
    offers: [
      { name: 'Cruceros en sauna flotante', description: 'Cruceros de verano en sauna flotante por el archipiélago del este de Helsinki' },
      { name: 'Sauna pública', description: 'Sesiones de sauna abiertas al público' },
      { name: 'Sauna privada', description: 'Sesiones de sauna para eventos privados' },
    ],
  },
  fr: {
    description: 'Authentique expérience de sauna finlandais dans le Helsinki maritime. Croisières en sauna flottant, sauna privé et sauna public.',
    openingHours: 'Ouvert sur rendez-vous',
    catalogName: 'Services de sauna',
    offers: [
      { name: 'Croisières en sauna flottant', description: 'Croisières estivales en sauna flottant dans l’archipel de l’est d’Helsinki' },
      { name: 'Sauna public', description: 'Séances de sauna ouvertes au public' },
      { name: 'Sauna privé', description: 'Séances de sauna pour événements privés' },
    ],
  },
  de: {
    description: 'Authentisches finnisches Saunaerlebnis im maritimen Helsinki. Saunabootfahrten, private Sauna und öffentliche Sauna.',
    openingHours: 'Nach Vereinbarung geöffnet',
    catalogName: 'Sauna-Angebote',
    offers: [
      { name: 'Saunabootfahrten', description: 'Saunabootfahrten in der Sommersaison durch den Schärengarten von Ost-Helsinki' },
      { name: 'Öffentliche Sauna', description: 'Öffentliche Saunazeiten für alle Gäste' },
      { name: 'Private Sauna', description: 'Saunazeiten für private Veranstaltungen' },
    ],
  },
};

export const getOrganizationSchema = (locale: SchemaLocale = 'fi') => {
  const copy = organizationCopy[locale];

  return {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": ORGANIZATION_ID,
  "name": "Hyvän Tuulen Sauna",
  "alternateName": "Hyvän Tuulen Sauna Oy",
  "description": copy.description,
  "url": `${SITE_URL}/`,
  "telephone": "+358442313546",
  "email": "info@hyvantuulensauna.fi",
  "foundingDate": "2018",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Meripellontie 11C",
    "addressLocality": "Helsinki",
    "postalCode": "00970",
    "addressCountry": "FI"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 60.2078110,
    "longitude": 25.1059710
  },
  "hasMap": "https://maps.app.goo.gl/VtS6aSXd3hxFEPxH6",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "description": copy.openingHours
    }
  ],
  "image": [
    "https://www.hyvantuulensauna.fi/images/gallery-raft-sunset.webp",
    "https://www.hyvantuulensauna.fi/images/gallery-aalto-raft.webp",
    "https://www.hyvantuulensauna.fi/images/gallery-virta-deck.webp"
  ],
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Credit Card, ePassi, Online payment",
  "areaServed": {
    "@type": "City",
    "name": "Helsinki"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": copy.catalogName,
    "itemListElement": copy.offers.map(offer => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": offer.name,
        "description": offer.description,
      },
    })),
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "344"
  },
  "sameAs": [
    "https://maps.app.goo.gl/VtS6aSXd3hxFEPxH6",
    "https://instagram.com/hyvantuulensauna",
    "https://facebook.com/hyvantuulensauna"
  ]
  };
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.hyvantuulensauna.fi/#website",
  "url": `${SITE_URL}/`,
  "name": "Hyvän Tuulen Sauna",
  "description": "Aito suomalainen saunaelämys merellisessä Helsingissä",
  "publisher": {
    "@id": ORGANIZATION_ID
  }
};

export const generateServiceSchema = (title: string, description: string, url: string, image?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": title,
  "description": description,
  "provider": {
    "@id": ORGANIZATION_ID
  },
  "areaServed": {
    "@type": "City",
    "name": "Helsinki"
  },
  "url": url,
  ...(image && { "image": image })
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateArticleSchema = (title: string, description: string, url: string, image: string, datePublished: string, dateModified: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": image,
  "url": url,
  "datePublished": datePublished,
  "dateModified": dateModified,
  "author": {
    "@type": "Organization",
    "name": "Hyvän Tuulen Sauna",
    "url": `${SITE_URL}/`
  },
  "publisher": {
    "@id": ORGANIZATION_ID
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url
  }
});

export const generateEventSchema = (name: string, description: string, url: string, image: string, startDate: string, endDate: string, location: string, price?: string, validFrom?: string) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": name,
  "description": description,
  "url": url,
  "image": image,
  "startDate": startDate,
  "endDate": endDate,
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": location,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kalkkihiekantori",
      "addressLocality": "Helsinki",
      "postalCode": "00980",
      "addressCountry": "FI"
    }
  },
  "organizer": {
    "@id": ORGANIZATION_ID
  },
  ...(price && {
    "offers": {
      "@type": "Offer",
      "url": url,
      "price": price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      ...(validFrom && { "validFrom": validFrom })
    }
  })
});

export const generateHowToSchema = (name: string, description: string, steps: Array<{ name: string; text: string }>) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": name,
  "description": description,
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text
  }))
});
