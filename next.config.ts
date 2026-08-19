import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Image optimization is handled by the OpenNext Cloudflare adapter via the
  // IMAGES binding in wrangler.jsonc (see https://opennext.js.org/cloudflare/howtos/image)
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/saunalautat-kesalla',
        destination: '/saunalauttaristeilyt-helsingissa',
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
