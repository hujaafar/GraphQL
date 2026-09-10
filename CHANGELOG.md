# Changelog

## 2026-09-10

### Graphite workspace

- Introduced original orbital artwork, a cinematic sign-in screen, responsive analytics, scroll effects, and a clearly labeled fictional sample route.
- Added searchable project history, audit result filters, exact chart data, and profile details.
- Separated the dashboard shell, project table, audit history, profile card, and shared pagination into focused components.

### Reliability and access

- Isolated tab sessions from blocked legacy storage and made storage errors actionable.
- Rejected incomplete credentials before network access and cancelled abandoned sign-ins without creating late sessions.
- Stopped GraphQL requests without a valid token and normalized authorization header replacement.
- Corrected project outcomes for zero and reversed awards, nonfinite aggregates, and timestamp ordering across timezones.
- Made search match displayed project names and return focus to the input after clearing.
- Kept sign-out reachable on mobile, enlarged header touch targets, and added keyboard focus targets for skip links and section navigation.
- Reset parallax and document scrolling when motion is paused; retain the last successful load timestamp during failed refreshes.

### Repository and delivery

- Added request and calculation regression tests, architecture and data documentation, formatting, and a CI quality workflow.
- Pinned current checkout and Node setup actions to their reviewed release commits, with checkout credentials disabled after retrieval.
- Classified Next.js, React, and React DOM as production dependencies so runtime installs include them.
- Retained both regular Next.js hosting and static export from the same application source.

The automated suite uses controlled API responses. Real-account login and browser interaction remain outside its coverage.
