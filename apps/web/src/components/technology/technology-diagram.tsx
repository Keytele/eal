'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { ealMotion } from '@eal/design-tokens';

import styles from './technology.module.css';

export interface TechnologyDiagramStage {
  readonly id: string;
  readonly label: ReactNode;
  readonly description?: ReactNode;
}

export interface TechnologyDiagramLabels {
  readonly expand: string;
  readonly collapse: string;
  readonly stageList: string;
  /**
   * A localized label template containing the {current} and {total}
   * placeholders. A string keeps the server-to-client boundary serializable.
   */
  readonly stagePosition: string;
}

export interface TechnologyDiagramProperties {
  readonly id: string;
  readonly title: ReactNode;
  readonly fallback: ReactNode;
  readonly stages: readonly TechnologyDiagramStage[];
  readonly labels: TechnologyDiagramLabels;
  readonly className?: string;
  readonly onExpanded?: (diagramId: string) => void;
}

/**
 * Content-neutral technical diagram. It leaves all engineering facts to
 * approved structured content and keeps a complete static fallback visible in
 * every mode. The callback is deliberately an intent hook, not an analytics
 * client, so consent remains outside the component.
 */
export function TechnologyDiagram({
  className,
  fallback,
  id,
  labels,
  onExpanded,
  stages,
  title,
}: TechnologyDiagramProperties) {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const headingId = id + '-heading';
  const hasStages = stages.length > 0;
  const activeStage = stages[activeIndex];
  const progress =
    stages.length < 2 ? 1 : Math.min(1, Math.max(0, activeIndex / (stages.length - 1)));
  const emphasizedEase = [...ealMotion.ease.emphasized] as [number, number, number, number];

  function toggleExpanded() {
    setExpanded((current) => {
      const next = !current;
      if (next) {
        onExpanded?.(id);
      }
      return next;
    });
  }

  return (
    <section
      aria-labelledby={headingId}
      className={[styles.diagram, className].filter(Boolean).join(' ')}
    >
      <div className={styles.diagramHeader}>
        <h3 id={headingId}>{title}</h3>
        {hasStages ? (
          <button aria-expanded={expanded} onClick={toggleExpanded} type="button">
            {expanded ? labels.collapse : labels.expand}
          </button>
        ) : null}
      </div>
      <div className={styles.diagramFallback}>{fallback}</div>
      {expanded && hasStages ? (
        <div className={styles.diagramInteractive}>
          <ol aria-label={labels.stageList} className={styles.stageList}>
            {stages.map((stage, index) => (
              <li key={stage.id}>
                <button
                  aria-current={index === activeIndex ? 'step' : undefined}
                  aria-label={labels.stagePosition
                    .replace('{current}', String(index + 1))
                    .replace('{total}', String(stages.length))}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  {stage.label}
                </button>
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className={styles.progressTrack}>
            <motion.span
              animate={{ scaleX: reducedMotion ? 1 : progress }}
              initial={false}
              transition={{
                duration: reducedMotion ? 0 : ealMotion.duration.ui,
                ease: emphasizedEase,
              }}
            />
          </div>
          {activeStage === undefined ? null : (
            <div aria-live="polite" className={styles.stageDescription}>
              {activeStage.description ?? activeStage.label}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
