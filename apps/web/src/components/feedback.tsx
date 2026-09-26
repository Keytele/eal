'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type StatusTone = 'neutral' | 'success' | 'warning' | 'error';

export function Alert({
  children,
  tone = 'neutral',
}: {
  readonly children: ReactNode;
  readonly tone?: StatusTone;
}) {
  return (
    <div
      className={'feedback-alert feedback-alert-' + tone}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}

export function LoadingState({ label }: { readonly label: string }) {
  return (
    <div aria-busy="true" className="feedback-loading" role="status">
      <span aria-hidden="true" />
      {label}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}) {
  return (
    <section className="feedback-empty">
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}

interface OverlayProperties {
  readonly title: string;
  readonly children: ReactNode;
  readonly onClose: () => void;
  readonly closeLabel: string;
}

export function Dialog({ title, children, onClose, closeLabel }: OverlayProperties) {
  const panel = useFocusAndEscape(onClose);
  return (
    <div className="feedback-overlay" role="presentation">
      <section
        aria-labelledby="feedback-dialog-title"
        aria-modal="true"
        className="feedback-dialog"
        ref={panel}
        role="dialog"
        tabIndex={-1}
      >
        <div className="feedback-overlay-heading">
          <h2 id="feedback-dialog-title">{title}</h2>
          <button
            aria-label={closeLabel}
            className="feedback-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function Drawer({ title, children, onClose, closeLabel }: OverlayProperties) {
  const panel = useFocusAndEscape(onClose);
  return (
    <div className="feedback-overlay" role="presentation">
      <aside
        aria-labelledby="feedback-drawer-title"
        aria-modal="true"
        className="feedback-drawer"
        ref={panel}
        role="dialog"
        tabIndex={-1}
      >
        <div className="feedback-overlay-heading">
          <h2 id="feedback-drawer-title">{title}</h2>
          <button
            aria-label={closeLabel}
            className="feedback-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

function useFocusAndEscape(onClose: () => void) {
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return panel;
}
