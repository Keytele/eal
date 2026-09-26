import Link from 'next/link';

import type { Locale, MarketLocaleContext } from '@eal/domain';
import { MODEL_PLACEHOLDERS, type EalModelCode } from '@eal/vehicle-data';

import { text } from '../content/copy';
import { filterModels, parseVehicleFilters, type BodyFilter } from '../content/vehicle-filters';
import { ConfiguratorPanel } from './configurator-panel';
import { BuildActions } from './build-actions';
import { StatusMessage } from './form-field';
import { EmptyState } from './feedback';
import { LegalExperience } from './legal-document';
import { Interactive360Viewer } from './media/interactive-360-viewer';
import { MediaFrame } from './media-frame';
import { Reveal } from './motion';
import { NewsArticleTemplate, NewsIndex } from './news-index';
import { toRoute } from './routes';
import { ServiceRequestForm } from './service-request-form';
import { SearchForm } from './search-form';
import { TechnologyDiagram } from './technology/technology-diagram';
import { TechnologyVisualFallback } from './technology/technology-visual-fallback';
import { searchSiteIndex, searchSuggestions } from '../content/search';

export type RouteQuery = Readonly<Record<string, string | string[] | undefined>>;

export function AdvancedVehicleRangeExperience({
  context,
  query,
}: {
  readonly context: MarketLocaleContext;
  readonly query: RouteQuery;
}) {
  const state = parseVehicleFilters(query);
  const models = filterModels(MODEL_PLACEHOLDERS, state);
  const basePath = '/' + context.locale + '/' + context.market;

  return (
    <section className="page-section layout-shell">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'allModels')}</p>
        <h1>{text(context.locale, 'vehicles')}</h1>
        <p>{text(context.locale, 'contentPending')}</p>
      </div>
      <div className="filter-bar" aria-label={text(context.locale, 'filterBy')}>
        {(['all', 'suv', 'sedan', 'grand-tourer'] as const).map((filter) => (
          <Link
            aria-current={state.body === filter ? 'page' : undefined}
            className="filter-link"
            href={toRoute(vehicleFilterHref(basePath, filter, state.compare))}
            key={filter}
          >
            {bodyLabel(context.locale, filter)}
          </Link>
        ))}
        {state.compare.length > 0 ? (
          <Link
            className="filter-link filter-link-accent"
            href={toRoute(basePath + '/compare?models=' + state.compare.join(','))}
          >
            {text(context.locale, 'compare')} ({state.compare.length})
          </Link>
        ) : null}
      </div>
      <p className="results-count" aria-live="polite">
        {models.length} / {MODEL_PLACEHOLDERS.length}
      </p>
      {models.length === 0 ? (
        <EmptyState
          description={text(context.locale, 'contentPending')}
          title={text(context.locale, 'noResults')}
        />
      ) : (
        <div className="model-grid">
          {models.map((model, index) => (
            <Reveal delay={index * 0.04} key={model.code}>
              <article className="model-card">
                <MediaFrame
                  className="model-card-media"
                  label={
                    model.code.toUpperCase() + ' — ' + text(context.locale, 'vehicleMediaPending')
                  }
                  locale={context.locale}
                />
                <div className="model-card-content">
                  <p>{bodyLabel(context.locale, model.category)}</p>
                  <h2>{model.code.toUpperCase()}</h2>
                  <div className="card-actions">
                    <Link href={toRoute(basePath + '/vehicles/' + model.code)}>
                      {text(context.locale, 'modelOverview')} <span aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href={toRoute(
                        vehicleFilterHref(
                          basePath + '/vehicles',
                          state.body,
                          toggleCompare(state.compare, model.code),
                        ),
                      )}
                    >
                      {state.compare.includes(model.code)
                        ? text(context.locale, 'removeCompare')
                        : text(context.locale, 'compare')}
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

export function AdvancedVehicleModelExperience({
  context,
  modelCode,
}: {
  readonly context: MarketLocaleContext;
  readonly modelCode?: EalModelCode;
}) {
  const basePath = '/' + context.locale + '/' + context.market;
  const displayModel = modelCode?.toUpperCase() ?? 'EAL';
  const sections = [
    ['overview', text(context.locale, 'overview')],
    ['exterior', text(context.locale, 'exterior')],
    ['interior', text(context.locale, 'interior')],
    ['technology', text(context.locale, 'technology')],
    ['trims', text(context.locale, 'trims')],
    ['specifications', text(context.locale, 'specifications')],
    ['gallery', text(context.locale, 'gallery')],
  ] as const;

  return (
    <>
      <section className="hero hero-model">
        <MediaFrame cinematic className="hero-media" locale={context.locale} />
        <div className="layout-shell hero-content">
          <p className="section-kicker">{displayModel}</p>
          <h1>{text(context.locale, 'modelOverview')}</h1>
          <p className="hero-copy">{text(context.locale, 'contentPending')}</p>
          <div className="hero-actions">
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
          </div>
        </div>
      </section>
      <nav aria-label={text(context.locale, 'modelSections')} className="model-subnav">
        {sections.map(([id, label]) => (
          <a href={'#' + id} key={id}>
            {label}
          </a>
        ))}
      </nav>
      <section className="page-section layout-shell split-section" id="overview">
        <div>
          <p className="section-kicker">{displayModel}</p>
          <h2>{text(context.locale, 'contentPending')}</h2>
          <StatusMessage tone="warning">
            {text(context.locale, 'commercialUnavailable')}
          </StatusMessage>
        </div>
        <MediaFrame locale={context.locale} />
      </section>
      <section className="page-section layout-shell" id="specifications">
        <SpecificationTable locale={context.locale} model={displayModel} />
      </section>
      <section className="page-section layout-shell split-section" id="gallery">
        <div>
          <p className="section-kicker">{text(context.locale, 'gallery')}</p>
          <h2>{text(context.locale, 'vehicleMediaPending')}</h2>
        </div>
        <Interactive360Viewer
          context={context}
          fallbackLabel={text(context.locale, 'vehicleMediaPending')}
          labels={{
            dragHint: text(context.locale, 'dragHint'),
            framePosition: text(context.locale, 'framePosition'),
            next: text(context.locale, 'nextFrame'),
            previous: text(context.locale, 'previousFrame'),
            region: text(context.locale, 'viewerRegion'),
            start: text(context.locale, 'startViewer'),
          }}
        />
      </section>
    </>
  );
}

export function AdvancedCompareExperience({
  context,
  query,
}: {
  readonly context: MarketLocaleContext;
  readonly query: RouteQuery;
}) {
  const requested = typeof query.models === 'string' ? query.models.split(',') : [];
  const selected = requested
    .filter((value): value is EalModelCode =>
      MODEL_PLACEHOLDERS.some((model) => model.code === value),
    )
    .slice(0, 3);
  const models = MODEL_PLACEHOLDERS.filter((model) => selected.includes(model.code));
  const rows = [
    text(context.locale, 'bodyType'),
    text(context.locale, 'availability'),
    text(context.locale, 'specifications'),
  ];
  return (
    <section className="page-section layout-shell">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'compare')}</p>
        <h1>{text(context.locale, 'compareVehicles')}</h1>
        <p>{text(context.locale, 'contentPending')}</p>
      </div>
      {models.length < 2 ? (
        <EmptyState
          description={text(context.locale, 'compareInstructions')}
          title={text(context.locale, 'noComparison')}
        />
      ) : (
        <div className="comparison-table-wrap" tabIndex={0}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">{text(context.locale, 'specification')}</th>
                {models.map((model) => (
                  <th key={model.code} scope="col">
                    {model.code.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {models.map((model) => (
                    <td key={model.code}>{text(context.locale, 'contentPending')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function AdvancedTechnologyExperience({
  context,
  segments,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
}) {
  const basePath = '/' + context.locale + '/' + context.market;
  const detail = segments[1];
  const topics = [
    ['800v-architecture', text(context.locale, 'technology800v')],
    ['battery-charging', text(context.locale, 'technologyBattery')],
    ['intelligent-driving', text(context.locale, 'technologyDriving')],
    ['software-connectivity', text(context.locale, 'technologySoftware')],
    ['energy-ecosystem', text(context.locale, 'technologyEnergy')],
    ['safety', text(context.locale, 'safety')],
  ] as const;
  const title =
    detail === undefined
      ? text(context.locale, 'technologyOverview')
      : topicTitle(context.locale, detail);

  return (
    <>
      <section className="hero hero-technology">
        <MediaFrame cinematic className="hero-media" locale={context.locale} tone="technology" />
        <div className="layout-shell hero-content">
          <p className="section-kicker">{text(context.locale, 'technology')}</p>
          <h1>{title}</h1>
          <p className="hero-copy">{text(context.locale, 'contentPending')}</p>
        </div>
      </section>
      <section className="page-section layout-shell">
        <div className="feature-rail">
          {topics.map(([slug, label]) => (
            <Link href={toRoute(basePath + '/technology/' + slug)} key={slug}>
              <span>{label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="page-section layout-shell split-section">
        <div>
          <p className="section-kicker">{title}</p>
          <h2>{text(context.locale, 'contentPending')}</h2>
          <StatusMessage tone="warning">
            {text(context.locale, 'commercialUnavailable')}
          </StatusMessage>
        </div>
        <TechnologyDiagram
          fallback={
            <TechnologyVisualFallback
              description={text(context.locale, 'contentPending')}
              title={title}
            />
          }
          id={'technology-' + (detail ?? 'overview')}
          labels={{
            collapse: text(context.locale, 'collapse'),
            expand: text(context.locale, 'expand'),
            stageList: text(context.locale, 'stageList'),
            stagePosition: text(context.locale, 'stagePosition'),
          }}
          stages={[]}
          title={title}
        />
      </section>
    </>
  );
}

export function AdvancedCommerceExperience({
  context,
  segments,
  query,
  modelCode,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
  readonly query: RouteQuery;
  readonly modelCode?: EalModelCode;
}) {
  const basePath = '/' + context.locale + '/' + context.market;
  const isConfigurator = segments[0] === 'configure' || segments[0] === 'shop';
  return (
    <section className="page-section layout-shell">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'commerce')}</p>
        <h1>
          {isConfigurator
            ? text(context.locale, 'configure')
            : text(context.locale, 'contentPending')}
        </h1>
        <p>{text(context.locale, 'commercialUnavailable')}</p>
      </div>
      {isConfigurator ? (
        <>
          <ConfiguratorPanel
            initialStep={parseStep(query.step)}
            locale={context.locale}
            modelCode={modelCode}
          />
          <div className="build-summary">
            <p className="section-kicker">{text(context.locale, 'buildSummary')}</p>
            <h2>{modelCode?.toUpperCase() ?? 'EAL'}</h2>
            <StatusMessage tone="warning">{text(context.locale, 'summaryPending')}</StatusMessage>
            <Link
              className="text-link"
              href={toRoute(basePath + '/saved-builds?source=' + (query.source ?? 'configurator'))}
            >
              {text(context.locale, 'saveBuild')}
            </Link>
            <BuildActions locale={context.locale} modelCode={modelCode?.toUpperCase() ?? 'EAL'} />
          </div>
        </>
      ) : (
        <ServiceState context={context} />
      )}
    </section>
  );
}

export function AdvancedOperationsExperience({
  context,
  segments,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
}) {
  const serviceKey = segments[0] ?? 'service';
  return (
    <section className="page-section layout-shell">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'service')}</p>
        <h1>{serviceTitle(context.locale, serviceKey)}</h1>
        <p>{text(context.locale, 'serviceUnavailable')}</p>
      </div>
      <ServiceState context={context} />
      {['test-drive', 'contact', 'trade-in'].includes(serviceKey) ? (
        <ServiceRequestForm locale={context.locale} />
      ) : null}
    </section>
  );
}

export function AdvancedEditorialExperience({
  context,
  segments,
  query,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
  readonly query: RouteQuery;
}) {
  const service = segments[0] ?? 'about';
  const searchTerm = typeof query.q === 'string' ? query.q : '';

  if (service === 'news') {
    return segments[1] === undefined ? (
      <NewsIndex context={context} />
    ) : (
      <NewsArticleTemplate context={context} slug={segments[1]} />
    );
  }

  if (service === 'search') {
    return <SearchExperience context={context} searchTerm={searchTerm} />;
  }

  const requestedLegalType = resolveLegalDocumentType(service, segments[1]);
  if (requestedLegalType !== undefined || service === 'legal') {
    return <LegalExperience context={context} requestedType={requestedLegalType} />;
  }

  const title = text(context.locale, 'contentPending');
  return (
    <section className="page-section layout-shell information-page">
      <div>
        <p className="section-kicker">{title}</p>
        <h1>{searchTerm.length > 0 ? searchTerm : title}</h1>
        <StatusMessage tone="warning">{text(context.locale, 'contentPending')}</StatusMessage>
      </div>
      <MediaFrame locale={context.locale} tone="editorial" />
    </section>
  );
}

function SearchExperience({
  context,
  searchTerm,
}: {
  readonly context: MarketLocaleContext;
  readonly searchTerm: string;
}) {
  const results = searchTerm.length > 0 ? searchSiteIndex(context, searchTerm) : [];
  const basePath = '/' + context.locale + '/' + context.market;
  return (
    <section className="page-section layout-shell search-page">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'search')}</p>
        <h1>{text(context.locale, 'searchResults')}</h1>
        <SearchForm initialValue={searchTerm} locale={context.locale} market={context.market} />
      </div>
      <p aria-live="polite" className="results-count">
        {searchTerm.length === 0
          ? text(context.locale, 'searchRecovery')
          : results.length + ' ' + text(context.locale, 'searchResults')}
      </p>
      {searchTerm.length === 0 ? (
        <SearchSuggestions context={context} />
      ) : results.length === 0 ? (
        <EmptyState
          description={text(context.locale, 'searchRecovery')}
          title={text(context.locale, 'searchNoResults')}
          action={<SearchSuggestions context={context} />}
        />
      ) : (
        <>
          <ul className="search-results">
            {results.map((result) => (
              <li key={result.id}>
                <Link href={toRoute(result.path)}>
                  <span>{result.kind}</span>
                  <strong>{result.title.values[context.locale] ?? result.title.values.en}</strong>
                </Link>
              </li>
            ))}
          </ul>
          <StatusMessage tone="warning">
            {text(context.locale, 'inventorySearchSeparate')}
          </StatusMessage>
        </>
      )}
      <Link className="text-link" href={toRoute(basePath + '/inventory')}>
        {text(context.locale, 'inventory')} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

function SearchSuggestions({ context }: { readonly context: MarketLocaleContext }) {
  const basePath = '/' + context.locale + '/' + context.market + '/search?q=';
  return (
    <div className="search-suggestions">
      <p>{text(context.locale, 'searchSuggestions')}</p>
      {searchSuggestions(context.locale).map((suggestion) => (
        <Link href={toRoute(basePath + encodeURIComponent(suggestion))} key={suggestion}>
          {suggestion}
        </Link>
      ))}
    </div>
  );
}

function resolveLegalDocumentType(
  service: string,
  detail: string | undefined,
): Parameters<typeof LegalExperience>[0]['requestedType'] {
  const value = service === 'legal' ? detail : service;
  return [
    'privacy',
    'cookies',
    'terms',
    'finance',
    'reservation',
    'vehicle-data',
    'driver-assistance',
  ].includes(value ?? '')
    ? (value as Parameters<typeof LegalExperience>[0]['requestedType'])
    : undefined;
}

function SpecificationTable({
  locale,
  model,
}: {
  readonly locale: Locale;
  readonly model: string;
}) {
  const rows = [
    text(locale, 'dimensions'),
    text(locale, 'battery'),
    text(locale, 'charging'),
    text(locale, 'performance'),
    text(locale, 'interior'),
  ];
  return (
    <div
      className="structured-table"
      role="table"
      aria-label={model + ' ' + text(locale, 'specifications')}
    >
      <div role="row">
        <strong role="columnheader">{text(locale, 'specification')}</strong>
        <strong role="columnheader">{text(locale, 'status')}</strong>
      </div>
      {rows.map((label) => (
        <div key={label} role="row">
          <span role="cell">{label}</span>
          <span role="cell">{text(locale, 'contentPending')}</span>
        </div>
      ))}
    </div>
  );
}

function ServiceState({ context }: { readonly context: MarketLocaleContext }) {
  const homePath = '/' + context.locale + '/' + context.market;
  return (
    <div className="service-unavailable">
      <span aria-hidden="true" />
      <StatusMessage tone="warning">{text(context.locale, 'serviceUnavailable')}</StatusMessage>
      <p>{text(context.locale, 'serviceDataNotice')}</p>
      <Link className="text-link" href={toRoute(homePath)}>
        {text(context.locale, 'tryAgain')}
      </Link>
      <Link className="text-link" href={toRoute(homePath + '/contact')}>
        {text(context.locale, 'requestService')}
      </Link>
    </div>
  );
}

function vehicleFilterHref(
  basePath: string,
  body: BodyFilter,
  compare: readonly EalModelCode[],
): string {
  const query = new URLSearchParams();
  if (body !== 'all') query.set('body', body);
  if (compare.length > 0) query.set('compare', compare.join(','));
  const suffix = query.toString();
  return basePath + (suffix.length > 0 ? '?' + suffix : '');
}

function toggleCompare(
  current: readonly EalModelCode[],
  value: EalModelCode,
): readonly EalModelCode[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : current.length >= 3
      ? current
      : [...current, value];
}

function bodyLabel(locale: Locale, value: BodyFilter | 'grand-tourer'): string {
  switch (value) {
    case 'all':
      return text(locale, 'all');
    case 'suv':
      return text(locale, 'suv');
    case 'sedan':
      return text(locale, 'sedan');
    case 'grand-tourer':
      return text(locale, 'grandTourer');
  }
}

function topicTitle(locale: Locale, value: string): string {
  const topics = {
    '800v-architecture': text(locale, 'technology800v'),
    'battery-charging': text(locale, 'technologyBattery'),
    'intelligent-driving': text(locale, 'technologyDriving'),
    'software-connectivity': text(locale, 'technologySoftware'),
    'energy-ecosystem': text(locale, 'technologyEnergy'),
    safety: text(locale, 'safety'),
  };
  return topics[value as keyof typeof topics] ?? text(locale, 'technologyOverview');
}

function serviceTitle(locale: Locale, value: string): string {
  const titles = {
    inventory: text(locale, 'inventory'),
    retailers: text(locale, 'retailers'),
    'test-drive': text(locale, 'bookDrive'),
    contact: text(locale, 'contact'),
    'trade-in': text(locale, 'tradeIn'),
    reserve: text(locale, 'reserve'),
    finance: text(locale, 'finance'),
    'saved-builds': text(locale, 'savedBuilds'),
    ownership: text(locale, 'ownership'),
    support: text(locale, 'support'),
  };
  return titles[value as keyof typeof titles] ?? text(locale, 'service');
}

function parseStep(value: string | string[] | undefined): number {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = candidate === undefined ? 0 : Number(candidate);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}
