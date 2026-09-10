import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="route-state">
      <p className="eyebrow">404 / A LOOSE CONNECTION</p>
      <h1>This page isn’t in your graph.</h1>
      <Link href="/" className="button button-primary">
        Back to Graphite
      </Link>
    </main>
  );
}
