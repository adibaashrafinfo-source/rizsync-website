import type { NextConfig } from 'next';

/**
 * Content-Security-Policy is intentionally permissive enough for the third
 * parties this site loads (GTM/GA4, Cloudflare Turnstile, Google Maps embed,
 * Meta Pixel) and nothing more. Keep this list in sync with the scripts that
 * are actually mounted in `src/app/layout.tsx`.
 */
const csp = [
  "default-src 'self'",
  // 'unsafe-inline'/'unsafe-eval' are required by GTM and Next.js' inline
  // bootstrap; nonces would need middleware and are a later optimisation.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://www.facebook.com https://maps.gstatic.com https://maps.googleapis.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  "frame-src 'self' https://challenges.cloudflare.com https://www.google.com https://www.googletagmanager.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This app lives in a sub-directory of a repo that has its own lockfile;
  // pin the trace root so Next.js does not warn about the ambiguity.
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
