import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: API routes require server mode (not static export)
  // For static hosting, use 'output: export' without API routes
  images: {
    unoptimized: true,
  },
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

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
