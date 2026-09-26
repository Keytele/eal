import type { ReactNode } from 'react';

import styles from './technology.module.css';

export interface TechnologyVisualFallbackProperties {
  readonly title: ReactNode;
  readonly description: ReactNode;
  readonly children?: ReactNode;
  readonly className?: string;
}

/**
 * Static, semantic fallback for an engineering visual. Callers provide only
 * approved title, description, and data/diagram content.
 */
export function TechnologyVisualFallback({
  children,
  className,
  description,
  title,
}: TechnologyVisualFallbackProperties) {
  return (
    <figure className={[styles.visualFallback, className].filter(Boolean).join(' ')}>
      <figcaption>
        <strong>{title}</strong>
        <p>{description}</p>
      </figcaption>
      {children === undefined ? null : <div>{children}</div>}
    </figure>
  );
}
