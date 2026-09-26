import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { isLocale, isMarket, type Locale, type Market } from '@eal/domain';

import { ConsentBanner } from '../../../components/consent-banner';
import { MotionProvider } from '../../../components/motion';
import { SiteFooter } from '../../../components/site-footer';
import { SiteHeader } from '../../../components/site-header';
import { WebVitalsReporter } from '../../../components/web-vitals-reporter';

interface MarketLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string; market: string }>;
}

export async function generateMetadata({
  params,
}: Pick<MarketLayoutProperties, 'params'>): Promise<Metadata> {
  const { locale, market } = await params;
  if (!isLocale(locale) || !isMarket(market)) {
    return {};
  }

  return {
    alternates: {
      canonical: '/' + locale + '/' + market,
      languages: {
        en: '/en/' + market,
        'zh-Hans': '/zh-Hans/' + market,
      },
    },
  };
}

export default async function MarketLayout({ children, params }: MarketLayoutProperties) {
  const { locale: requestedLocale, market: requestedMarket } = await params;
  if (!isLocale(requestedLocale) || !isMarket(requestedMarket)) {
    notFound();
  }

  const locale: Locale = requestedLocale;
  const market: Market = requestedMarket;
  return (
    <MotionProvider>
      <div lang={locale}>
        <SiteHeader locale={locale} market={market} />
        <main id="main-content">{children}</main>
        <SiteFooter locale={locale} market={market} />
        <ConsentBanner locale={locale} market={market} />
        <WebVitalsReporter locale={locale} market={market} />
      </div>
    </MotionProvider>
  );
}
