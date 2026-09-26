'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { ealMotion } from '@eal/design-tokens';
import type { MarketLocaleContext, MediaAsset } from '@eal/domain';

import { selectApprovedMedia } from '../../content/technology';
import { MediaFrame } from '../media-frame';
import styles from './media.module.css';

export interface StaticMediaFallbackProperties {
  readonly context: MarketLocaleContext;
  readonly label: string;
  readonly tone?: 'vehicle' | 'technology' | 'editorial';
  readonly className?: string;
}

export interface MediaAssetFrameProperties extends StaticMediaFallbackProperties {
  readonly asset?: MediaAsset;
  readonly caption?: ReactNode;
  readonly transition?: 'none' | 'crossfade';
}

/**
 * Renders an approved, context-matched image only. Every other media state is
 * intentionally represented by the existing manifest-aware static frame.
 */
export function MediaAssetFrame({
  asset,
  caption,
  className,
  context,
  label,
  tone = 'technology',
  transition = 'none',
}: MediaAssetFrameProperties) {
  const reducedMotion = useReducedMotion();
  const [failedAssetId, setFailedAssetId] = useState<string>();
  const selection = selectApprovedMedia(failedAssetId === asset?.id ? undefined : asset, context, [
    'image',
  ]);
  const enterEase = [...ealMotion.ease.enter] as [number, number, number, number];

  useEffect(() => {
    setFailedAssetId(undefined);
  }, [asset?.id]);

  if (selection.state !== 'ready') {
    return (
      <StaticMediaFallback className={className} context={context} label={label} tone={tone} />
    );
  }

  return (
    <figure
      aria-label={selection.alt}
      className={[styles.frame, className].filter(Boolean).join(' ')}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          alt=""
          animate={{ opacity: 1 }}
          className={styles.image}
          exit={transition === 'crossfade' && !reducedMotion ? { opacity: 0 } : undefined}
          initial={transition === 'crossfade' && !reducedMotion ? { opacity: 0 } : false}
          key={selection.asset.id}
          onError={() => setFailedAssetId(selection.asset.id)}
          src={selection.sourceUrl}
          transition={{
            duration: reducedMotion || transition === 'none' ? 0 : ealMotion.duration.panel,
            ease: enterEase,
          }}
        />
      </AnimatePresence>
      {caption === undefined ? null : <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

export function MediaCrossfade(properties: Omit<MediaAssetFrameProperties, 'transition'>) {
  return <MediaAssetFrame {...properties} transition="crossfade" />;
}

export function StaticMediaFallback({
  className,
  context,
  label,
  tone = 'technology',
}: StaticMediaFallbackProperties) {
  return <MediaFrame className={className} label={label} locale={context.locale} tone={tone} />;
}
