'use client';

import { useState } from 'react';

import type { Locale } from '@eal/domain';

import { text } from '../content/copy';

export function BuildActions({
  locale,
  modelCode,
}: {
  readonly locale: Locale;
  readonly modelCode: string;
}) {
  const [message, setMessage] = useState<string>();
  const storageKey = 'eal-build-' + modelCode;

  function saveBuild() {
    window.sessionStorage.setItem(
      storageKey,
      JSON.stringify({ modelCode, href: window.location.href, savedAt: new Date().toISOString() }),
    );
    setMessage(text(locale, 'buildSaved'));
  }

  async function shareBuild() {
    const href = window.location.href;
    try {
      if (navigator.clipboard !== undefined) {
        await navigator.clipboard.writeText(href);
      } else {
        window.prompt(text(locale, 'shareBuild'), href);
      }
      setMessage(text(locale, 'buildLinkCopied'));
    } catch {
      setMessage(text(locale, 'localDemoSave'));
    }
  }

  return (
    <div className="build-actions">
      <button className="button button-secondary" onClick={saveBuild} type="button">
        {text(locale, 'saveBuild')}
      </button>
      <button className="button button-secondary" onClick={() => void shareBuild()} type="button">
        {text(locale, 'shareBuild')}
      </button>
      {message === undefined ? null : <p aria-live="polite">{message}</p>}
    </div>
  );
}
