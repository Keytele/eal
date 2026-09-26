'use client';

import { useState, type ReactNode } from 'react';

import type { Locale } from '@eal/domain';

import { text } from '../content/copy';
import { Dialog } from './feedback';

export function LegalDisclosureDrawer({
  locale,
  title,
  triggerLabel,
  children,
}: {
  readonly locale: Locale;
  readonly title: string;
  readonly triggerLabel: string;
  readonly children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="text-link legal-disclosure-trigger"
        onClick={() => setOpen(true)}
        type="button"
      >
        {triggerLabel}
      </button>
      {open ? (
        <Dialog closeLabel={text(locale, 'close')} onClose={() => setOpen(false)} title={title}>
          <div className="legal-drawer-copy">{children}</div>
        </Dialog>
      ) : null}
    </>
  );
}
