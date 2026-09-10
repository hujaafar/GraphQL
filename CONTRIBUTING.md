# Contributing

Use Node.js 22.12 or newer, install with `npm ci`, and start with `npm run dev`.

Before opening a change, run:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build:static
```

Use `npm run format` when formatting changes are needed. Keep dependency changes in `package.json` and the existing lockfile together.

Keep live API failures distinct from the sample route. Do not commit credentials, JWTs, real learner exports, or screenshots containing private student information. Add calculation and request-lifecycle tests when changing those behaviors. UI changes should preserve keyboard access, narrow layouts, and reduced motion.

Prefer commits that describe one meaningful change: authentication, analytics, design, testing, or documentation. Explain why a calculation or API scope changes in the pull request.
