"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" tabIndex={-1} className="route-state">
      <h1>Something interrupted your workspace.</h1>
      <p>Your Reboot01 data has not been changed.</p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
