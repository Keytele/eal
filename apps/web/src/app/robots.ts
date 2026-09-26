import type { MetadataRoute } from 'next';

import { siteOrigin } from '../content/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*?*q=', '/*?*models='],
    },
    sitemap: siteOrigin() + '/sitemap.xml',
  };
}
