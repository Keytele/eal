import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, isMarket, type Locale, type Market } from '@eal/domain';

import { RouteExperience } from '../../../../components/route-experience';
import { StructuredData } from '../../../../components/structured-data';
import { getRouteSeo } from '../../../../content/seo';

interface RoutePageProperties {
  readonly params: Promise<{
    locale: string;
    market: string;
    segments?: string[];
  }>;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: RoutePageProperties): Promise<Metadata> {
  const { locale, market, segments = [] } = await params;
  if (!isLocale(locale) || !isMarket(market)) {
    return {};
  }

  const seo = getRouteSeo({ locale, market }, segments);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical,
      languages: seo.languages,
    },
    robots: seo.indexable ? undefined : { index: false, follow: true },
  };
}

export default async function RoutePage({ params, searchParams }: RoutePageProperties) {
  const { locale: requestedLocale, market: requestedMarket, segments = [] } = await params;
  const query = await searchParams;
  if (!isLocale(requestedLocale) || !isMarket(requestedMarket)) {
    notFound();
  }

  const context = {
    locale: requestedLocale as Locale,
    market: requestedMarket as Market,
  };
  return (
    <>
      <StructuredData context={context} segments={segments} />
      <RouteExperience context={context} segments={segments} query={query} />
    </>
  );
}
