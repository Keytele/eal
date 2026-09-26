'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Locale, Market } from '@eal/domain';

import { text } from '../content/copy';
import { HeroReveal } from './motion';
import { toRoute } from './routes';

export function EntryChooser() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('en');
  const [market, setMarket] = useState<Market>('au');
  const languageOptions: readonly { value: Locale; label: string }[] = [
    { value: 'en', label: text(locale, 'english') },
    { value: 'zh-Hans', label: text(locale, 'simplifiedChinese') },
  ];
  const marketOptions: readonly { value: Market; label: string }[] = [
    { value: 'au', label: text(locale, 'australia') },
    { value: 'cn', label: text(locale, 'china') },
  ];

  function continueToMarket() {
    router.push(toRoute('/' + locale + '/' + market));
  }

  return (
    <main className="entry-page">
      <div className="entry-frame">
        <div className="entry-mark" aria-label="EAL">
          EAL
        </div>
        <HeroReveal className="entry-content" delay={0.08}>
          <p className="section-kicker">{text(locale, 'entryKicker')}</p>
          <h1>{text(locale, 'entryTitle')}</h1>
          <p className="entry-copy">{text(locale, 'entryDescription')}</p>
          <fieldset className="choice-group">
            <legend>{text(locale, 'language')}</legend>
            <div className="choice-row">
              {languageOptions.map((option) => (
                <button
                  aria-pressed={locale === option.value}
                  className="choice-button"
                  key={option.value}
                  onClick={() => setLocale(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="choice-group">
            <legend>{text(locale, 'market')}</legend>
            <div className="choice-row">
              {marketOptions.map((option) => (
                <button
                  aria-pressed={market === option.value}
                  className="choice-button"
                  key={option.value}
                  onClick={() => setMarket(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="button button-primary" onClick={continueToMarket} type="button">
            {text(locale, 'continue')}
          </button>
        </HeroReveal>
        <div aria-hidden="true" className="entry-architecture" />
      </div>
    </main>
  );
}
