import type { MetadataRoute } from 'next';

import { EAL_MODEL_CODES } from '@eal/vehicle-data';

import { siteOrigin } from '../content/seo';

const locales = ['en', 'zh-Hans'] as const;
const markets = ['au', 'cn'] as const;
const publicPaths = [
  '',
  '/vehicles',
  '/technology',
  '/technology/800v-architecture',
  '/technology/battery-charging',
  '/technology/intelligent-driving',
  '/technology/software-connectivity',
  '/technology/energy-ecosystem',
  '/technology/safety',
  '/design',
  '/sustainability',
  '/about',
  '/news',
  '/support',
  '/ownership',
  '/retailers',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [] as MetadataRoute.Sitemap;
  for (const locale of locales) {
    for (const market of markets) {
      for (const path of publicPaths) {
        entries.push({
          url: siteOrigin() + '/' + locale + '/' + market + path,
          changeFrequency: path === '/news' ? 'daily' : 'weekly',
          priority: path === '' ? 1 : path === '/vehicles' || path === '/technology' ? 0.8 : 0.5,
        });
      }
      for (const model of EAL_MODEL_CODES) {
        entries.push({
          url: siteOrigin() + '/' + locale + '/' + market + '/vehicles/' + model,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }
  return entries;
}
