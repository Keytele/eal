'use client';

export default function ErrorPage({ reset }: { readonly reset: () => void }) {
  return (
    <section className="status-page layout-shell">
      <p className="section-kicker">Service state</p>
      <h1>We could not load this experience</h1>
      <p>Try again or return to the market selection screen.</p>
      <button className="button button-primary" onClick={reset} type="button">
        Try again
      </button>
    </section>
  );
}
