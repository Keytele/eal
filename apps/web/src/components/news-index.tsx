import Link from 'next/link';

import type { MarketLocaleContext, NewsArticle } from '@eal/domain';
import { evaluateLocalizedPublication } from '@eal/domain';

import { text } from '../content/copy';
import { StatusMessage } from './form-field';
import { MediaFrame } from './media-frame';
import { toRoute } from './routes';
import { EmptyState } from './feedback';

export function NewsIndex({
  context,
  articles = [],
}: {
  readonly context: MarketLocaleContext;
  readonly articles?: readonly NewsArticle[];
}) {
  const publishedArticles = articles.filter((article) => {
    if (article.context.locale !== context.locale || article.context.market !== context.market) {
      return false;
    }
    return evaluateLocalizedPublication(article).visible;
  });

  return (
    <section className="page-section layout-shell editorial-page">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'news')}</p>
        <h1>{text(context.locale, 'news')}</h1>
        <p>{text(context.locale, 'editorialReadiness')}</p>
      </div>
      {publishedArticles.length === 0 ? (
        <EmptyState
          description={text(context.locale, 'editorialPending')}
          title={text(context.locale, 'contentPending')}
          action={
            <Link
              className="button button-secondary"
              href={toRoute('/' + context.locale + '/' + context.market + '/search')}
            >
              {text(context.locale, 'search')}
            </Link>
          }
        />
      ) : (
        <div className="editorial-list">
          {publishedArticles.map((article) => (
            <article className="editorial-card" key={article.id}>
              <NewsMedia context={context} article={article} />
              <div className="editorial-card-content">
                <p className="section-kicker">{formatArticleDate(article.publishedAt, context)}</p>
                <h2>{localized(article.title, context)}</h2>
                {article.excerpt === undefined ? null : (
                  <p>{localized(article.excerpt, context)}</p>
                )}
                <Link
                  className="text-link"
                  href={toRoute(
                    '/' + context.locale + '/' + context.market + '/news/' + article.slug,
                  )}
                >
                  {text(context.locale, 'readArticle')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function NewsArticleTemplate({
  context,
  slug,
  article,
}: {
  readonly context: MarketLocaleContext;
  readonly slug: string;
  readonly article?: NewsArticle;
}) {
  const isReady =
    article !== undefined &&
    article.slug === slug &&
    article.context.locale === context.locale &&
    article.context.market === context.market &&
    evaluateLocalizedPublication(article).visible;

  return (
    <article className="page-section layout-shell editorial-article">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'news')}</p>
        <h1>
          {isReady ? localized(article.title, context) : text(context.locale, 'contentPending')}
        </h1>
        {isReady ? (
          <p>
            {localized(article.author, context)} · {formatArticleDate(article.publishedAt, context)}
          </p>
        ) : (
          <StatusMessage tone="warning">{text(context.locale, 'editorialPending')}</StatusMessage>
        )}
      </div>
      {isReady ? (
        <>
          <NewsMedia context={context} article={article} />
          <div className="editorial-article-body">
            {article.sections.map((section) => (
              <section key={section.id}>
                {section.heading === undefined ? null : (
                  <h2>{localized(section.heading, context)}</h2>
                )}
                {section.body === undefined ? null : <p>{localized(section.body, context)}</p>}
              </section>
            ))}
          </div>
          {article.relatedContent.length > 0 ? (
            <nav aria-label={text(context.locale, 'relatedContent')} className="related-content">
              {article.relatedContent.map((related) => (
                <Link
                  href={toRoute('/' + context.locale + '/' + context.market + related.path)}
                  key={related.id}
                >
                  {localized(related.title, context)}
                </Link>
              ))}
            </nav>
          ) : null}
        </>
      ) : (
        <MediaFrame
          locale={context.locale}
          label={text(context.locale, 'editorialPending')}
          tone="editorial"
        />
      )}
    </article>
  );
}

function NewsMedia({
  context,
  article,
}: {
  readonly context: MarketLocaleContext;
  readonly article: NewsArticle;
}) {
  const media = article.media.find(
    (candidate) =>
      candidate.status === 'approved' &&
      candidate.rights.status === 'cleared' &&
      (candidate.markets === undefined || candidate.markets.includes(context.market)),
  );
  return media?.sourceUrl === undefined ? (
    <MediaFrame
      locale={context.locale}
      label={text(context.locale, 'vehicleMediaPending')}
      tone="editorial"
    />
  ) : (
    <figure className="editorial-media">
      {/* CMS media is rendered only after the content and rights gates above. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={localized(media.alt, context)} src={media.sourceUrl} />
    </figure>
  );
}

function localized(
  value: {
    readonly defaultLocale: 'en' | 'zh-Hans';
    readonly values: Readonly<Partial<Record<'en' | 'zh-Hans', string>>>;
  },
  context: MarketLocaleContext,
): string {
  return (
    value.values[context.locale] ??
    value.values[value.defaultLocale] ??
    text(context.locale, 'contentPending')
  );
}

function formatArticleDate(value: string, context: MarketLocaleContext): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? text(context.locale, 'datePending')
    : new Intl.DateTimeFormat(context.locale === 'zh-Hans' ? 'zh-CN' : 'en-AU', {
        dateStyle: 'long',
      }).format(date);
}
