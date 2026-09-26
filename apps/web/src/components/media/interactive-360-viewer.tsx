'use client';

import type { PointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { MarketLocaleContext } from '@eal/domain';

import { selectMedia360FrameSet, type Media360FrameSet } from '../../content/technology';
import { MediaCrossfade, StaticMediaFallback } from './media-asset-frame';
import styles from './media.module.css';

export interface Interactive360Labels {
  readonly region: string;
  readonly dragHint: string;
  readonly start: string;
  readonly previous: string;
  readonly next: string;
  /**
   * A localized label template containing the {current} and {total}
   * placeholders. A string keeps the server-to-client boundary serializable.
   */
  readonly framePosition: string;
}

export interface Interactive360ViewerProperties {
  readonly context: MarketLocaleContext;
  readonly fallbackLabel: string;
  readonly frameSet?: Media360FrameSet;
  readonly labels: Interactive360Labels;
  readonly onStarted?: (frameSetId: string) => void;
  readonly className?: string;
}

/**
 * Optional 360 behavior. It starts as an approved static poster, never
 * auto-rotates, and exposes the same frame changes through drag, buttons, and
 * keyboard input. Callers may bridge onStarted to consent-aware analytics.
 */
export function Interactive360Viewer({
  className,
  context,
  fallbackLabel,
  frameSet,
  labels,
  onStarted,
}: Interactive360ViewerProperties) {
  const selection = selectMedia360FrameSet(frameSet, context);
  const [interactive, setInteractive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerPosition = useRef<number | undefined>(undefined);
  const selectionId = selection.state === 'ready' ? selection.id : undefined;

  useEffect(() => {
    setInteractive(false);
    setActiveIndex(0);
    pointerPosition.current = undefined;
  }, [selectionId]);

  if (selection.state !== 'ready') {
    return (
      <StaticMediaFallback
        className={className}
        context={context}
        label={fallbackLabel}
        tone="vehicle"
      />
    );
  }

  const readySelection = selection;
  const normalizedActiveIndex = Math.min(activeIndex, readySelection.frames.length - 1);
  const activeFrame = readySelection.frames[normalizedActiveIndex];

  function moveFrame(direction: -1 | 1) {
    setActiveIndex(
      (current) =>
        (current + direction + readySelection.frames.length) % readySelection.frames.length,
    );
  }

  function beginInteraction() {
    setInteractive(true);
    onStarted?.(readySelection.id);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerPosition.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (pointerPosition.current === undefined) {
      return;
    }

    const difference = event.clientX - pointerPosition.current;
    if (Math.abs(difference) < 18) {
      return;
    }

    moveFrame(difference > 0 ? -1 : 1);
    pointerPosition.current = event.clientX;
  }

  function finishPointer(event: PointerEvent<HTMLDivElement>) {
    pointerPosition.current = undefined;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section
      aria-label={labels.region}
      className={[styles.viewer, className].filter(Boolean).join(' ')}
    >
      {interactive ? (
        <>
          <div
            aria-label={labels.dragHint}
            className={styles.viewerSurface}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                moveFrame(-1);
              }
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                moveFrame(1);
              }
            }}
            onPointerCancel={finishPointer}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointer}
            role="group"
            tabIndex={0}
          >
            <MediaCrossfade
              asset={activeFrame.resolved.asset}
              context={context}
              label={fallbackLabel}
              tone="vehicle"
            />
          </div>
          <div className={styles.viewerControls}>
            <button aria-label={labels.previous} onClick={() => moveFrame(-1)} type="button">
              {labels.previous}
            </button>
            <button aria-label={labels.next} onClick={() => moveFrame(1)} type="button">
              {labels.next}
            </button>
            <p aria-live="polite" className={styles.viewerStatus}>
              {labels.framePosition
                .replace('{current}', String(normalizedActiveIndex + 1))
                .replace('{total}', String(readySelection.frames.length))}
            </p>
          </div>
        </>
      ) : (
        <>
          <MediaCrossfade
            asset={readySelection.poster.asset}
            context={context}
            label={fallbackLabel}
            tone="vehicle"
          />
          <div className={styles.viewerControls}>
            <button onClick={beginInteraction} type="button">
              {labels.start}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
