import Link from 'next/link';

import type { LegalDocument, MarketLocaleContext } from '@eal/domain';
import { evaluateLegalPublication } from '@eal/domain';

import { text } from '../content/copy';
import { StatusMessage } from './form-field';
import { LegalDisclosureDrawer } from './legal-disclosure-drawer';
import { MediaFrame } from './media-frame';
import { toRoute } from './routes';
import { EmptyState } from './feedback';

const LEGAL_DOCUMENTS = [
  'privacy',
  'cookies',
  'terms',
  'finance',
  'reservation',
  'vehicle-data',
  'driver-assistance',
] as const;

export function LegalExperience({
  context,
  document,
  requestedType,
}: {
  readonly context: MarketLocaleContext;
  readonly document?: LegalDocument;
  readonly requestedType?: LegalDocument['documentType'];
}) {
  const isReady = document !== undefined && evaluateLegalPublication(document).publishable;
  const title = isReady ? document.version : text(context.locale, 'legal');
  return (
    <section className="page-section layout-shell legal-page">
      <div className="section-heading">
        <p className="section-kicker">{text(context.locale, 'legal')}</p>
        <h1>
          {isReady ? legalTitle(context, document.documentType) : text(context.locale, 'legal')}
        </h1>
        {isReady ? (
          <p>
            {text(context.locale, 'legalVersion')} {title} ·{' '}
            {formatEffectiveDate(document.effectiveAt, context)}
          </p>
        ) : (
          <StatusMessage tone="warning">{text(context.locale, 'legalPending')}</StatusMessage>
        )}
      </div>
      {isReady ? (
        <div className="legal-document-body">
          {document.sections.map((section) => (
            <section key={section.id}>
              {section.heading === undefined ? null : (
                <h2>{localized(section.heading, context)}</h2>
              )}
              {section.body === undefined ? null : <p>{localized(section.body, context)}</p>}
            </section>
          ))}
        </div>
      ) : (
        <>
          <EmptyState
            description={text(context.locale, 'legalPending')}
            title={text(context.locale, 'contentPending')}
            action={
              <div className="legal-document-links">
                {LEGAL_DOCUMENTS.map((type) => (
                  <Link href={toRoute(legalPath(context, type))} key={type}>
                    {legalTitle(context, type)}
                  </Link>
                ))}
              </div>
            }
          />
          <MediaFrame
            locale={context.locale}
            label={text(context.locale, 'legalPending')}
            tone="editorial"
          />
        </>
      )}
      {requestedType === 'finance' || requestedType === 'vehicle-data' ? (
        <LegalDisclosureDrawer
          locale={context.locale}
          title={legalTitle(context, requestedType)}
          triggerLabel={text(context.locale, 'viewDisclosure')}
        >
          <p>{text(context.locale, 'legalPending')}</p>
        </LegalDisclosureDrawer>
      ) : null}
    </section>
  );
}

function legalPath(context: MarketLocaleContext, type: LegalDocument['documentType']): string {
  return '/' + context.locale + '/' + context.market + '/legal/' + type;
}

function legalTitle(context: MarketLocaleContext, type: LegalDocument['documentType']): string {
  const labels: Record<LegalDocument['documentType'], string> = {
    privacy: text(context.locale, 'privacy'),
    cookies: text(context.locale, 'cookies'),
    terms: text(context.locale, 'terms'),
    finance: text(context.locale, 'financeDisclosure'),
    reservation: text(context.locale, 'reservationDisclosure'),
    'vehicle-data': text(context.locale, 'vehicleDataDisclosure'),
    'driver-assistance': text(context.locale, 'driverAssistanceDisclosure'),
    other: text(context.locale, 'legal'),
  };
  return labels[type];
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

function formatEffectiveDate(value: string, context: MarketLocaleContext): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? text(context.locale, 'datePending')
    : new Intl.DateTimeFormat(context.locale === 'zh-Hans' ? 'zh-CN' : 'en-AU', {
        dateStyle: 'long',
      }).format(date);
}
