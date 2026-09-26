'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import type { Locale } from '@eal/domain';

import { text, type CopyKey } from '../content/copy';

const steps = [
  'trim',
  'exterior',
  'interior',
  'wheels',
  'packages',
  'summary',
] as const satisfies readonly CopyKey[];

export function ConfiguratorPanel({
  locale,
  modelCode,
  initialStep = 0,
}: {
  readonly locale: Locale;
  readonly modelCode?: string;
  readonly initialStep?: number;
}) {
  const [activeStep, setActiveStep] = useState(() =>
    Math.max(0, Math.min(steps.length - 1, initialStep)),
  );
  const reducedMotion = useReducedMotion();
  const heading = text(locale, 'configuratorHeading');
  const pending = text(locale, 'configuratorPending');

  return (
    <section aria-labelledby="configurator-heading" className="configurator-panel">
      <div className="configurator-topline">
        <div>
          <p className="section-kicker">{modelCode?.toUpperCase() ?? 'EAL'}</p>
          <h2 id="configurator-heading">{heading}</h2>
        </div>
        <span className="status-label">{text(locale, 'contentPending')}</span>
      </div>
      <ol aria-label={heading} className="configurator-steps">
        {steps.map((step, index) => (
          <li key={step}>
            <button
              aria-current={index === activeStep ? 'step' : undefined}
              onClick={() => {
                setActiveStep(index);
                const parameters = new URLSearchParams(window.location.search);
                parameters.set('step', String(index));
                window.history.replaceState(
                  null,
                  '',
                  window.location.pathname + '?' + parameters.toString(),
                );
              }}
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {text(locale, step)}
            </button>
          </li>
        ))}
      </ol>
      <motion.div
        className="configurator-content"
        initial={false}
        animate={{ opacity: 1, x: 0 }}
        key={activeStep}
        transition={{
          duration: reducedMotion ? 0 : 0.36,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <p>{pending}</p>
        <p className="configurator-note">{text(locale, 'commercialUnavailable')}</p>
      </motion.div>
    </section>
  );
}
