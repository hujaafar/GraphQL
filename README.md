# Graphite

**Your learning, connected.** A Reboot01 analytics workspace built with Next.js, TypeScript, and Apollo GraphQL.

![Graphite's original amber glass and graphite orbital artwork](public/images/graphite-orbit.webp)

Graphite brings experience, projects, skills, and peer feedback into one considered workspace. It connects to a student's existing Reboot01 account and provides a separate, clearly labeled sample workspace for exploring the interface without credentials.

[Open Graphite](https://graph-ql-eh1l.vercel.app/) · [Explore the sample workspace](https://graph-ql-eh1l.vercel.app/demo/) · [Changelog](CHANGELOG.md)

## The experience

- **A clear overview:** module XP, passed projects, audit ratio, and current level.
- **A useful growth chart:** cumulative experience, calendar-month controls, and an exact data table.
- **Skills in context:** highest attained percentages, a radar visualization, and complete skill values.
- **Project history:** search, status filters, best grades, module XP, dates, and pagination.
- **Peer audits:** given and received XP, pass/fail history, and filtered results.
- **A coherent visual identity:** original local artwork, a cinematic sign-in page, scroll-linked parallax, section reveals, and responsive layouts.
- **Considered access:** per-request session headers, tab-scoped tokens, expiry handling, accessible controls, and reduced-motion support.

## Run locally

Requires **Node.js 22.12+** and npm.

```sh
git clone https://github.com/hujaafar/GraphQL.git
cd GraphQL
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Choose **Explore the sample workspace** to inspect the dashboard with fictional data, or sign in with a Reboot01 account to load your own records.

The default Reboot01 endpoints work without an environment file. To use another compatible installation, copy `.env.example` to `.env.local` and update the public URLs and module path. Never place a password or token in an environment variable prefixed with `NEXT_PUBLIC_`.

| Route             | Purpose                                                      |
| ----------------- | ------------------------------------------------------------ |
| `/` and `/login/` | Sign in to the Reboot01 account                              |
| `/profile/`       | Authenticated learning workspace                             |
| `/demo/`          | Fictional sample workspace; no account or API request needed |

## Build and verify

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

For static hosting, use `npm run build:static` and publish the generated `out/` directory. The normal build retains Next.js and Vercel compatibility. API requests still go directly from the browser to Reboot01, so the upstream service must allow the deployed origin.

The test suite covers token expiry, blocked storage, cancelled and failed sign-ins, UTF-8 credentials, current-token request headers, GraphQL failures, module scopes, ranks, skill maxima, project outcomes, human-readable search, timezone ordering, and XP reconciliation. GitHub Actions runs formatting, lint, types, tests, and the static build for pull requests and updates to `main`.

## Inside the repository

```text
src/
  app/          Routes, shared layout, metadata, and design tokens
  components/   Workspace, charts, identity, and motion
  graphql/      Dashboard query and module configuration
  lib/          Authentication, Apollo transport, calculations, sample data
tests/          Request lifecycle and data regression tests
docs/           Architecture, data semantics, and design decisions
scripts/        Portable static export
```

- [Architecture and session model](docs/architecture.md)
- [Data contract and calculations](docs/data-contract.md)
- [Design and artwork](docs/design.md)
- [Contribution guide](CONTRIBUTING.md)

## Data and scope

This is an independent educational project, not an official Reboot01 application. It is read-only: it does not edit grades, submit audits, or modify student records. The artwork is decorative; the sample route is explicitly fictional. Real authentication and learner data depend on Reboot01's API and access rules.

Live-account login and browser regression testing are not included in the automated suite. The tests use controlled responses rather than real student credentials.

The dependency tree retains the existing project libraries. React compatibility is updated, and a PostCSS override keeps Next.js's parser on a patched 8.x release without a framework-major migration.

Built by [hujaafar](https://github.com/hujaafar).
