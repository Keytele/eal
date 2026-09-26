'use client';

import { useState, type FormEvent } from 'react';

import type { Locale } from '@eal/domain';

import { text } from '../content/copy';
import { FormField, StatusMessage } from './form-field';

export function ServiceRequestForm({ locale }: { readonly locale: Locale }) {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="service-request-form" onSubmit={submit}>
      <div className="service-request-grid">
        <FormField
          autoComplete="given-name"
          id="first-name"
          label={text(locale, 'firstName')}
          required
        />
        <FormField
          autoComplete="family-name"
          id="last-name"
          label={text(locale, 'lastName')}
          required
        />
      </div>
      <FormField
        autoComplete="email"
        id="email"
        label={text(locale, 'email')}
        required
        type="email"
      />
      {submitted ? (
        <StatusMessage tone="warning">{text(locale, 'requestPending')}</StatusMessage>
      ) : null}
      <button className="button button-primary" type="submit">
        {text(locale, 'submitRequest')}
      </button>
    </form>
  );
}
