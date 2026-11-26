import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Image optimization is handled by the OpenNext Cloudflare adapter via the
  // IMAGES binding in wrangler.jsonc (see https://opennext.js.org/cloudflare/howtos/image)
  trailingSlash: true,
  async redirects() {
    return [
      // Public design-preview URLs resolve to their exact production counterparts.
      { source: '/vibe/', destination: '/', permanent: true },
      { source: '/vibe/en/', destination: '/en/', permanent: true },
      { source: '/vibe/avanto/', destination: '/avanto/', permanent: true },
      { source: '/vibe/en/avanto/', destination: '/en/ice-swimming-sauna-helsinki/', permanent: true },
      { source: '/vibe/julkinen-sauna/', destination: '/julkinen-sauna/', permanent: true },
      { source: '/vibe/en/julkinen-sauna/', destination: '/en/public-sauna-helsinki/', permanent: true },
      { source: '/vibe/saunalauttaristeilyt/', destination: '/saunalauttaristeilyt-helsingissa/', permanent: true },
      { source: '/vibe/en/saunalauttaristeilyt/', destination: '/en/sauna-boat-cruises-helsinki/', permanent: true },
      { source: '/vibe/tapahtumat/', destination: '/polttarit-yritystilaisuudet/', permanent: true },
      { source: '/vibe/en/tapahtumat/', destination: '/en/bachelor-parties-corporate-events-helsinki/', permanent: true },
      { source: '/vibe/sijainti/', destination: '/sijainti/', permanent: true },
      { source: '/vibe/en/sijainti/', destination: '/en/location/', permanent: true },
      { source: '/vibe/meista/', destination: '/toiminnastamme/', permanent: true },
      { source: '/vibe/en/meista/', destination: '/en/about/', permanent: true },
      { source: '/vibe/ukk/', destination: '/usein-kysyttya/', permanent: true },
      { source: '/vibe/en/ukk/', destination: '/en/faq/', permanent: true },
      { source: '/vibe/galleria/', destination: '/galleria/', permanent: true },
      { source: '/vibe/en/galleria/', destination: '/en/gallery/', permanent: true },

      // Legacy blog URLs indexed by Google (?post=... rendered the homepage)
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'post',
            value: 'saunalauttaristeilyn-kokemukset-helsingissa',
          },
        ],
        destination: '/saunalauttaristeilyt-helsingissa/',
        permanent: true,
      },
      {
        source: '/en',
        has: [
          {
            type: 'query',
            key: 'post',
            value: 'saunalauttaristeilyn-kokemukset-helsingissa',
          },
        ],
        destination: '/saunalauttaristeilyt-helsingissa/',
        permanent: true,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'post',
            value: 'kokemus-tyotiimin-palautumisesta-saunassa',
          },
        ],
        destination: '/toiminnastamme/',
        permanent: true,
      },
      {
        source: '/en',
        has: [
          {
            type: 'query',
            key: 'post',
            value: 'kokemus-tyotiimin-palautumisesta-saunassa',
          },
        ],
        destination: '/toiminnastamme/',
        permanent: true,
      },
      // Old English slugs (Finnish slugs under /en) → localized English slugs.
      // Destinations carry the trailing slash so the 308 lands in one hop.
      {
        source: '/en/saunalauttaristeilyt-helsingissa',
        destination: '/en/sauna-boat-cruises-helsinki/',
        permanent: true,
      },
      {
        source: '/en/julkinen-sauna',
        destination: '/en/public-sauna-helsinki/',
        permanent: true,
      },
      {
        // /yksityissauna merged into the cruises page — keep link equity via 301
        source: '/yksityissauna',
        destination: '/saunalauttaristeilyt-helsingissa/',
        permanent: true,
      },
      {
        source: '/en/yksityissauna',
        destination: '/en/sauna-boat-cruises-helsinki/',
        permanent: true,
      },
      {
        source: '/en/private-sauna-helsinki',
        destination: '/en/sauna-boat-cruises-helsinki/',
        permanent: true,
      },
      {
        source: '/en/sijainti',
        destination: '/en/location/',
        permanent: true,
      },
      {
        source: '/en/toiminnastamme',
        destination: '/en/about/',
        permanent: true,
      },
      {
        source: '/en/usein-kysyttya',
        destination: '/en/faq/',
        permanent: true,
      },
      {
        source: '/en/galleria',
        destination: '/en/gallery/',
        permanent: true,
      },
      {
        source: '/en/kiitos',
        destination: '/en/thank-you/',
        permanent: true,
      },
      {
        source: '/saunalautat-kesalla',
        destination: '/saunalauttaristeilyt-helsingissa/',
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
