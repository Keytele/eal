'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

import type { MarketLocaleContext } from '@eal/domain';
import { MODEL_PLACEHOLDERS } from '@eal/vehicle-data';

import { text } from '../content/copy';
import { MediaFrame } from './media-frame';
import { toRoute } from './routes';

export function VehicleLineupRail({ context }: { readonly context: MarketLocaleContext }) {
  const rail = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const basePath = '/' + context.locale + '/' + context.market;

  function move(direction: -1 | 1) {
    const next = Math.max(0, Math.min(MODEL_PLACEHOLDERS.length - 1, activeIndex + direction));
    setActiveIndex(next);
    const card = rail.current?.querySelector<HTMLElement>('[data-model-index="' + next + '"]');
    card?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    });
    card?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  }

  return (
    <div className="vehicle-lineup">
      <div
        aria-label={text(context.locale, 'allModels')}
        className="vehicle-rail"
        ref={rail}
        role="region"
      >
        {MODEL_PLACEHOLDERS.map((model, index) => (
          <article
            className="model-card vehicle-rail-card"
            data-model-index={index}
            key={model.code}
            onFocus={() => setActiveIndex(index)}
          >
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
        ))}
      </div>
      <div className="vehicle-rail-controls">
        <button
          aria-label={text(context.locale, 'previousModel')}
          disabled={activeIndex === 0}
          onClick={() => move(-1)}
          type="button"
        >
          ←
        </button>
        <p aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(MODEL_PLACEHOLDERS.length).padStart(2, '0')}
        </p>
        <button
          aria-label={text(context.locale, 'nextModel')}
          disabled={activeIndex === MODEL_PLACEHOLDERS.length - 1}
          onClick={() => move(1)}
          type="button"
        >
          →
        </button>
      </div>
    </div>
  );
}
