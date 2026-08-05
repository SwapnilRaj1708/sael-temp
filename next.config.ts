import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output is the deployment artefact: `.next/standalone/server.js`
  // runs under PM2 behind Nginx. See docs/architecture.md §8.
  output: 'standalone',
  // URL parity with the legacy site — see docs/accessibility-and-seo.md.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.blob.core.windows.net' }],
  },
  turbopack: {
    rules: {
      // SVGR, scoped to the icon folder only. Icons inherit `currentColor` and
      // so have to be components; the brand artwork in src/assets/images/ is
      // fixed-colour and stays a file for `next/image` to process. Widening
      // this to all `*.svg` would break every image import.
      // docs/asset-inventory.md §3. Types: src/types/svg.d.ts.
      './src/assets/icons/*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async redirects() {
    return []; // populated in FE-22
  },
};

export default nextConfig;
