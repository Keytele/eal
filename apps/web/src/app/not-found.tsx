import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="status-page layout-shell">
      <p className="section-kicker">404</p>
      <h1>Route unavailable</h1>
      <p>The requested EAL page is not available in this market or language.</p>
      <Link className="button button-primary" href="/">
        Choose a market
      </Link>
    </section>
  );
}
