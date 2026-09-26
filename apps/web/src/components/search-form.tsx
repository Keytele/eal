'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import type { Locale, Market } from '@eal/domain';

import { text } from '../content/copy';
import { toRoute } from './routes';

export function SearchForm({
  locale,
  market,
  initialValue = '',
}: {
  readonly locale: Locale;
  readonly market: Market;
  readonly initialValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(
      toRoute(
        '/' +
          locale +
          '/' +
          market +
          '/search' +
          (query.length > 0 ? '?q=' + encodeURIComponent(query) : ''),
      ),
    );
  }

  return (
    <form className="search-form" onSubmit={submit} role="search">
      <label htmlFor="site-search">{text(locale, 'searchInput')}</label>
      <div>
        <input
          id="site-search"
          onChange={(event) => setValue(event.target.value)}
          type="search"
          value={value}
        />
        <button className="button button-primary" type="submit">
          {text(locale, 'searchSubmit')}
        </button>
      </div>
    </form>
  );
}
