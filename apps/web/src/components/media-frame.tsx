'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { Locale } from '@eal/domain';

import { text } from '../content/copy';

interface MediaFrameProperties {
  readonly locale: Locale;
  readonly label?: string;
  readonly tone?: 'vehicle' | 'technology' | 'editorial';
  readonly className?: string;
  readonly cinematic?: boolean;
}

export function MediaFrame({
  locale,
  label,
  tone = 'vehicle',
  className,
  cinematic = false,
}: MediaFrameProperties) {
  const reducedMotion = useReducedMotion();
  const description = label ?? text(locale, 'vehicleMediaPending');
  return (
    <motion.figure
      aria-label={description}
      className={['media-frame', 'media-frame-' + tone, className].filter(Boolean).join(' ')}
      initial={cinematic && !reducedMotion ? { opacity: 0, scale: 1.03, x: 24 } : false}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{
        duration: cinematic && !reducedMotion ? 0.9 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="media-frame-structure" aria-hidden="true">
        <span className="media-horizon" />
        <span className="media-vehicle" />
        <span className="media-reflection" />
      </div>
      <figcaption>
        <span>{description}</span>
        <small>{text(locale, 'mediaManifest')}</small>
      </figcaption>
    </motion.figure>
  );
}
