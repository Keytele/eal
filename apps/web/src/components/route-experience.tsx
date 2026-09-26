import Link from 'next/link';

import type { Locale, MarketLocaleContext } from '@eal/domain';
import { MODEL_PLACEHOLDERS, type EalModelCode } from '@eal/vehicle-data';

import { text } from '../content/copy';
import { selectHomepageHero } from '../content/home';
import {
  AdvancedCommerceExperience,
  AdvancedCompareExperience,
  AdvancedEditorialExperience,
  AdvancedOperationsExperience,
  AdvancedTechnologyExperience,
  AdvancedVehicleModelExperience,
  AdvancedVehicleRangeExperience,
  type RouteQuery,
} from './advanced-experiences';
import { ConfiguratorPanel } from './configurator-panel';
import { HeroReveal, Reveal } from './motion';
import { MediaFrame } from './media-frame';
import { toRoute } from './routes';
import { VehicleLineupRail } from './vehicle-lineup-rail';

interface RouteExperienceProperties {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
  readonly query?: RouteQuery;
}

type ExperienceKind =
  | 'home'
  | 'range'
  | 'compare'
  | 'model'
  | 'technology'
  | 'commerce'
  | 'retail'
  | 'ownership'
  | 'editorial'
  | 'utility';

export function RouteExperience({ context, segments, query = {} }: RouteExperienceProperties) {
  const kind = resolveKind(segments);
  const modelCode = findModelCode(segments);

  switch (kind) {
    case 'home':
      return <HomeExperience context={context} />;
    case 'range':
      return <AdvancedVehicleRangeExperience context={context} query={query} />;
    case 'compare':
      return <AdvancedCompareExperience context={context} query={query} />;
    case 'model':
      return <AdvancedVehicleModelExperience context={context} modelCode={modelCode} />;
    case 'technology':
      return <AdvancedTechnologyExperience context={context} segments={segments} />;
    case 'commerce':
      return (
        <AdvancedCommerceExperience
          context={context}
          modelCode={modelCode}
          query={query}
          segments={segments}
        />
      );
    case 'retail':
      return <AdvancedOperationsExperience context={context} segments={segments} />;
    case 'ownership':
      return <AdvancedOperationsExperience context={context} segments={segments} />;
    case 'editorial':
    case 'utility':
      return <AdvancedEditorialExperience context={context} query={query} segments={segments} />;
  }
}

function HomeExperience({ context }: { readonly context: MarketLocaleContext }) {
  const basePath = '/' + context.locale + '/' + context.market;
  const hero = selectHomepageHero([], context);
  return (
    <>
      <section className="hero hero-home">
        <MediaFrame cinematic className="hero-media" locale={context.locale} />
        <div className="layout-shell hero-content">
          <HeroReveal delay={0.05}>
            <p className="section-kicker">EAL</p>
          </HeroReveal>
          <HeroReveal delay={0.13}>
            <h1>
              {hero.kind === 'approved'
                ? (hero.campaign.heading.values[context.locale] ??
                  text(context.locale, 'contentPending'))
                : text(context.locale, 'contentPending')}
            </h1>
          </HeroReveal>
          <HeroReveal delay={0.22}>
            <p className="hero-copy">{text(context.locale, 'homeReadiness')}</p>
          </HeroReveal>
          <HeroReveal className="hero-actions" delay={0.31}>
            <Link className="button button-primary" href={toRoute(basePath + '/vehicles')}>
              {text(context.locale, 'viewVehicles')}
            </Link>
            <Link className="button button-secondary" href={toRoute(basePath + '/technology')}>
              {text(context.locale, 'exploreTechnology')}
            </Link>
          </HeroReveal>
        </div>
      </section>
      <section
        className="metric-rail layout-shell"
        aria-label={text(context.locale, 'productInformationStatus')}
      >
        {[
          ['catalog', text(context.locale, 'catalog')],
          ['media', text(context.locale, 'media')],
          ['commerce', text(context.locale, 'commerce')],
          ['retailers', text(context.locale, 'retailers')],
        ].map(([key, label]) => (
          <div key={key}>
            <span className="metric-icon" aria-hidden="true" />
            <p>{label}</p>
            <strong>{text(context.locale, 'contentPending')}</strong>
          </div>
        ))}
      </section>
      <section className="model-lineup layout-shell">
        <Reveal>
          <div className="section-heading">
            <p className="section-kicker">{text(context.locale, 'allModels')}</p>
            <h2>{text(context.locale, 'vehicles')}</h2>
          </div>
        </Reveal>
        <VehicleLineupRail context={context} />
      </section>
      <section className="editorial-band">
        <div className="layout-shell editorial-band-grid">
          <Reveal>
            <p className="section-kicker">{text(context.locale, 'technologyOverview')}</p>
            <h2>{text(context.locale, 'contentPending')}</h2>
            <Link className="text-link" href={toRoute(basePath + '/technology')}>
              {text(context.locale, 'exploreTechnology')} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <MediaFrame locale={context.locale} tone="technology" />
        </div>
      </section>
    </>
  );
}

export function RangeExperience({ context }: { readonly context: MarketLocaleContext }) {
  return (
    <section className="page-section layout-shell">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'allModels')}</p>
        <h1>{text(context.locale, 'vehicles')}</h1>
        <p>{text(context.locale, 'contentPending')}</p>
      </div>
      <ModelGrid context={context} />
    </section>
  );
}

export function ModelExperience({
  context,
  modelCode,
}: {
  readonly context: MarketLocaleContext;
  readonly modelCode?: EalModelCode;
}) {
  const basePath = '/' + context.locale + '/' + context.market;
  const displayModel = modelCode?.toUpperCase() ?? 'EAL';
  return (
    <>
      <section className="hero hero-model">
        <MediaFrame cinematic className="hero-media" locale={context.locale} />
        <div className="layout-shell hero-content">
          <HeroReveal delay={0.08}>
            <p className="section-kicker">{displayModel}</p>
          </HeroReveal>
          <HeroReveal delay={0.16}>
            <h1>{text(context.locale, 'modelOverview')}</h1>
          </HeroReveal>
          <HeroReveal delay={0.24}>
            <p className="hero-copy">{text(context.locale, 'contentPending')}</p>
          </HeroReveal>
          <HeroReveal className="hero-actions" delay={0.32}>
            <Link
              className="button button-primary"
              href={toRoute(basePath + '/configure/' + (modelCode ?? 'c2'))}
            >
              {text(context.locale, 'configure')}
            </Link>
            <Link
              className="button button-secondary"
              href={toRoute(basePath + '/test-drive/' + (modelCode ?? 'c2'))}
            >
              {text(context.locale, 'bookDrive')}
            </Link>
          </HeroReveal>
        </div>
      </section>
      <nav aria-label={displayModel + ' sections'} className="model-subnav">
        {['Overview', 'Exterior', 'Interior', 'Technology', 'Trims', 'Specifications'].map(
          (item) => (
            <a href={'#' + item.toLowerCase()} key={item}>
              {item}
            </a>
          ),
        )}
      </nav>
      <section className="page-section layout-shell split-section" id="overview">
        <Reveal>
          <p className="section-kicker">{displayModel}</p>
          <h2>{text(context.locale, 'contentPending')}</h2>
          <p>{text(context.locale, 'commercialUnavailable')}</p>
        </Reveal>
        <MediaFrame locale={context.locale} />
      </section>
      <section className="page-section layout-shell" id="specifications">
        <div
          className="structured-table"
          role="table"
          aria-label={displayModel + ' specifications'}
        >
          <div role="row">
            <strong role="columnheader">Specification</strong>
            <strong role="columnheader">Status</strong>
          </div>
          {['Dimensions', 'Battery', 'Charging', 'Performance', 'Interior'].map((item) => (
            <div key={item} role="row">
              <span role="cell">{item}</span>
              <span role="cell">{text(context.locale, 'contentPending')}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function TechnologyExperience({
  context,
  segments,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
}) {
  const detail = segments[1];
  const basePath = '/' + context.locale + '/' + context.market;
  const title =
    detail === undefined ? text(context.locale, 'technologyOverview') : humanize(detail);
  const themes = [
    ['800v-architecture', '800V'],
    ['battery-charging', 'Battery & charging'],
    ['intelligent-driving', 'Intelligent driving'],
    ['software-connectivity', 'Software & connectivity'],
    ['energy-ecosystem', 'Energy ecosystem'],
    ['safety', 'Safety'],
  ] as const;
  return (
    <>
      <section className="hero hero-technology">
        <MediaFrame cinematic className="hero-media" locale={context.locale} tone="technology" />
        <div className="layout-shell hero-content">
          <HeroReveal delay={0.08}>
            <p className="section-kicker">{text(context.locale, 'technology')}</p>
          </HeroReveal>
          <HeroReveal delay={0.16}>
            <h1>{title}</h1>
          </HeroReveal>
          <HeroReveal delay={0.24}>
            <p className="hero-copy">{text(context.locale, 'contentPending')}</p>
          </HeroReveal>
        </div>
      </section>
      <section className="page-section layout-shell">
        <div className="feature-rail">
          {themes.map(([slug, label]) => (
            <Link href={toRoute(basePath + '/technology/' + slug)} key={slug}>
              <span>{label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="page-section layout-shell split-section">
        <Reveal>
          <p className="section-kicker">{title}</p>
          <h2>{text(context.locale, 'contentPending')}</h2>
          <p>{text(context.locale, 'commercialUnavailable')}</p>
        </Reveal>
        <MediaFrame locale={context.locale} tone="technology" />
      </section>
    </>
  );
}

export function CommerceExperience({
  context,
  segments,
  modelCode,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
  readonly modelCode?: EalModelCode;
}) {
  const isConfigurator = segments[0] === 'configure' || segments[0] === 'shop';
  return (
    <section className="page-section layout-shell">
      <div className="section-heading">
        <p className="section-kicker">{humanize(segments[0] ?? 'commerce')}</p>
        <h1>{text(context.locale, 'contentPending')}</h1>
        <p>{text(context.locale, 'commercialUnavailable')}</p>
      </div>
      {isConfigurator ? (
        <ConfiguratorPanel locale={context.locale} modelCode={modelCode} />
      ) : (
        <ServiceUnavailable locale={context.locale} />
      )}
    </section>
  );
}

export function RetailExperience({
  context,
  segments,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
}) {
  return (
    <section className="page-section layout-shell">
      <div className="section-heading">
        <p className="section-kicker">{humanize(segments[0] ?? 'retail')}</p>
        <h1>{text(context.locale, 'contentPending')}</h1>
      </div>
      <div className="retailer-layout">
        <MediaFrame locale={context.locale} label={text(context.locale, 'contentPending')} />
        <ServiceUnavailable locale={context.locale} />
      </div>
    </section>
  );
}

export function OwnershipExperience({
  context,
  segments,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
}) {
  return <InformationExperience context={context} segments={segments} />;
}

function InformationExperience({
  context,
  segments,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
}) {
  const title = humanize(segments[segments.length - 1] ?? 'EAL');
  return (
    <section className="page-section layout-shell information-page">
      <Reveal>
        <p className="section-kicker">{title}</p>
        <h1>{text(context.locale, 'contentPending')}</h1>
        <p>{text(context.locale, 'serviceUnavailable')}</p>
      </Reveal>
      <MediaFrame locale={context.locale} tone="editorial" />
    </section>
  );
}

function ModelGrid({ context }: { readonly context: MarketLocaleContext }) {
  const basePath = '/' + context.locale + '/' + context.market;
  return (
    <div className="model-grid">
      {MODEL_PLACEHOLDERS.map((model, index) => (
        <Reveal delay={index * 0.04} key={model.code}>
          <article className="model-card">
            <MediaFrame
              className="model-card-media"
              label={model.code.toUpperCase() + ' — ' + text(context.locale, 'vehicleMediaPending')}
              locale={context.locale}
            />
            <div className="model-card-content">
              <p>{model.category.replace('-', ' ')}</p>
              <h3>{model.code.toUpperCase()}</h3>
              <Link href={toRoute(basePath + '/vehicles/' + model.code)}>
                {text(context.locale, 'modelOverview')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

function ServiceUnavailable({ locale }: { readonly locale: Locale }) {
  return (
    <aside className="service-unavailable" role="status">
      <span aria-hidden="true" />
      <p>{text(locale, 'serviceUnavailable')}</p>
    </aside>
  );
}

function resolveKind(segments: readonly string[]): ExperienceKind {
  const first = segments[0];
  if (first === undefined) {
    return 'home';
  }
  if (first === 'vehicles') {
    return segments[1] === undefined ? 'range' : 'model';
  }
  if (first === 'compare') {
    return 'compare';
  }
  if (first === 'technology') {
    return 'technology';
  }
  if (
    ['shop', 'configure', 'reserve', 'order', 'finance', 'trade-in', 'saved-builds'].includes(first)
  ) {
    return 'commerce';
  }
  if (['inventory', 'retailers', 'test-drive', 'contact'].includes(first)) {
    return 'retail';
  }
  if (['ownership', 'support'].includes(first)) {
    return 'ownership';
  }
  if (
    [
      'design',
      'sustainability',
      'about',
      'news',
      'search',
      'legal',
      'privacy',
      'cookies',
      'terms',
      'vehicle-data',
      'driver-assistance',
    ].includes(first)
  ) {
    return 'editorial';
  }
  return 'utility';
}

function findModelCode(segments: readonly string[]): EalModelCode | undefined {
  const candidate =
    segments[0] === 'vehicles'
      ? segments[1]
      : segments[0] === 'configure' || segments[0] === 'shop'
        ? segments[1]
        : undefined;
  return MODEL_PLACEHOLDERS.some((model) => model.code === candidate)
    ? (candidate as EalModelCode)
    : undefined;
}

function humanize(value: string): string {
  return value
    .split('-')
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ');
}
