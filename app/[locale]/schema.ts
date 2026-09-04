// JSON-LD Structured Data for Hyvän Tuulen Sauna

type SchemaLocale = 'fi' | 'en';

export const getOrganizationSchema = (locale: SchemaLocale = 'fi') => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.hyvantuulensauna.fi/#organization",
  "name": "Hyvän Tuulen Sauna",
  "alternateName": "Hyvän Tuulen Sauna Oy",
  "description": locale === 'en'
    ? "Authentic Finnish sauna experience in maritime Helsinki. Sauna boat cruises, private sauna and public sauna."
    : "Aito suomalainen saunaelämys merellisessä Helsingissä. Saunalauttaristeilyt, yksityissauna ja julkinen sauna.",
  "url": "https://www.hyvantuulensauna.fi",
  "telephone": "+358442313546",
  "email": "info@hyvantuulensauna.fi",
  "foundingDate": "2018",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kalkkihiekantori",
    "addressLocality": "Helsinki",
    "postalCode": "00980",
    "addressCountry": "FI"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 60.1989759,
    "longitude": 25.1407083
  },
  "hasMap": "https://maps.app.goo.gl/VtS6aSXd3hxFEPxH6",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "22:00"
    }
  ],
  "image": [
    "https://www.hyvantuulensauna.fi/images/gallery-raft-sunset.webp",
    "https://www.hyvantuulensauna.fi/images/gallery-aalto-raft.webp",
    "https://www.hyvantuulensauna.fi/images/gallery-virta-deck.webp"
  ],
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Credit Card",
  "areaServed": {
    "@type": "City",
    "name": "Helsinki"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": locale === 'en' ? "Sauna services" : "Saunapalvelut",
    "itemListElement": locale === 'en' ? [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Sauna boat cruises",
          "description": "Summer season sauna boat cruises in the Eastern Helsinki archipelago"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Public sauna",
          "description": "Open sauna sessions for the public"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Private sauna",
          "description": "Sauna sessions for private events"
        }
      }
    ] : [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Saunalauttaristeilyt",
          "description": "Kesäkauden saunalauttaristeilyt Helsingin itäisessä saaristossa"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Julkinen sauna",
          "description": "Avoimet saunavuorot yleisölle"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Yksityissauna",
          "description": "Yksityistilaisuuksien saunavuorot"
        }
      }
    ]
  },
  "sameAs": [
    "https://maps.app.goo.gl/VtS6aSXd3hxFEPxH6",
    "https://instagram.com/hyvantuulensauna",
    "https://facebook.com/hyvantuulensauna"
  ]
});

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.hyvantuulensauna.fi/#website",
  "url": "https://www.hyvantuulensauna.fi",
  "name": "Hyvän Tuulen Sauna",
  "description": "Aito suomalainen saunaelämys merellisessä Helsingissä",
  "publisher": {
    "@id": "https://www.hyvantuulensauna.fi/#organization"
  }
};

export const generateServiceSchema = (title: string, description: string, url: string, image?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": title,
  "description": description,
  "provider": {
    "@id": "https://www.hyvantuulensauna.fi/#organization"
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
    "url": "https://www.hyvantuulensauna.fi"
  },
  "publisher": {
    "@id": "https://www.hyvantuulensauna.fi/#organization"
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
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 60.198930,
      "longitude": 25.141096
    }
  },
  "organizer": {
    "@id": "https://www.hyvantuulensauna.fi/#organization"
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
