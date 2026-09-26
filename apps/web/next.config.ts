import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  // The root quality gate runs flat-config ESLint before every build. Next's
  // legacy build-time detector does not recognize that configuration in a
  // monorepo, so avoid a duplicate, misleading warning here.
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@eal/analytics',
    '@eal/design-tokens',
    '@eal/domain',
    '@eal/i18n',
    '@eal/ui',
    '@eal/vehicle-data',
  ],
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
      "connect-src 'self' https:",
      "media-src 'self' https:",
      'upgrade-insecure-requests',
    ].join('; ');
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
