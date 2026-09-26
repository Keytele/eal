'use client';

import { useEffect, useState } from 'react';

import type { Locale, Market } from '@eal/domain';

import { text } from '../content/copy';
import { Dialog } from './feedback';

interface ConsentBannerProperties {
  readonly locale: Locale;
  readonly market: Market;
}

export function ConsentBanner({ locale, market }: ConsentBannerProperties) {
  const storageKey = 'eal-consent-' + locale + '-' + market;
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(storageKey) === null);
  }, [storageKey]);

  function saveEssentialConsent() {
    window.localStorage.setItem(storageKey, 'necessary');
    setVisible(false);
  }

  function openPreferences() {
    setPreferencesOpen(true);
  }

  if (!visible && !preferencesOpen) {
    return null;
  }

  return (
    <>
      {visible ? (
        <aside aria-label={text(locale, 'cookieConsent')} className="consent-banner">
          <p>{text(locale, 'demoNotice')}</p>
          <div>
            <button className="button button-primary" onClick={saveEssentialConsent} type="button">
              {text(locale, 'acceptEssential')}
            </button>
            <button className="button button-secondary" onClick={openPreferences} type="button">
              {text(locale, 'managePreferences')}
            </button>
          </div>
        </aside>
      ) : null}
      {preferencesOpen ? (
        <Dialog
          closeLabel={text(locale, 'close')}
          onClose={() => setPreferencesOpen(false)}
          title={text(locale, 'preferenceTitle')}
        >
          <p>{text(locale, 'preferenceDescription')}</p>
        </Dialog>
      ) : null}
    </>
  );
}
