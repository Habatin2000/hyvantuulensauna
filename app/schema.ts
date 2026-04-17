// JSON-LD Structured Data for Hyvän Tuulen Sauna

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://hyvantuulensauna.fi/#organization",
  "name": "Hyvän Tuulen Sauna",
  "alternateName": "Hyvän Tuulen Sauna Oy",
  "description": "Aito suomalainen saunaelämys merellisessä Helsingissä. Saunalauttaristeilyt, yksityissauna ja julkinen sauna.",
  "url": "https://hyvantuulensauna.fi",
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
    "latitude": 60.198930,
    "longitude": 25.141096
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "22:00"
    }
  ],
  "image": [
    "https://hyvantuulensauna.fi/images/gallery-raft-sunset.jpg",
    "https://hyvantuulensauna.fi/images/gallery-aalto-raft.jpeg",
    "https://hyvantuulensauna.fi/images/gallery-virta-deck.jpeg"
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
    "name": "Saunapalvelut",
    "itemListElement": [
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
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "150"
  },
  "sameAs": [
    "https://instagram.com/hyvantuulensauna",
    "https://facebook.com/hyvantuulensauna"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://hyvantuulensauna.fi/#website",
  "url": "https://hyvantuulensauna.fi",
  "name": "Hyvän Tuulen Sauna",
  "description": "Aito suomalainen saunaelämys merellisessä Helsingissä",
  "publisher": {
    "@id": "https://hyvantuulensauna.fi/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://hyvantuulensauna.fi/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const generateServiceSchema = (title: string, description: string, url: string, image?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": title,
  "description": description,
  "provider": {
    "@id": "https://hyvantuulensauna.fi/#organization"
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
    "url": "https://hyvantuulensauna.fi"
  },
  "publisher": {
    "@id": "https://hyvantuulensauna.fi/#organization"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url
  }
});

export const generateEventSchema = (name: string, description: string, url: string, image: string, startDate: string, endDate: string, location: string) => ({
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
    "@id": "https://hyvantuulensauna.fi/#organization"
  },
  "offers": {
    "@type": "Offer",
    "url": url,
    "price": "25",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-05-01"
  }
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
