# PawMeal Georgia

Lead-generation MVP for a pet food subscription pilot in Georgia. Landing page + quiz in `ka`/`ru`/`en`, server-saved leads, WhatsApp/Telegram handoff. No payments, no cart, no client accounts — see `.cursorrules.txt` for the full product spec and `docs/progress.md` for build status.

Stack: Nuxt 4 (Vue 3, TypeScript strict) · Tailwind CSS v4 · `@nuxtjs/i18n` · Zod · libphonenumber-js · Nitro server routes · PostgreSQL + Prisma ORM 7.

## Requirements

- Node.js 22 LTS and npm (project was built and tested with Node v22.14.0 / npm 11.1.0; see the "Known issues" note below).
- Docker (for local PostgreSQL via `docker compose`) — or any reachable PostgreSQL instance.

## Setup

```bash
npm install
cp .env.example .env   # fill in real values when you have them; local defaults work for dev
docker compose up -d   # starts local PostgreSQL on localhost:5432 (user/pass/db: pawmeal)
npm run db:generate     # generates the Prisma Client into ./generated/prisma
```

## Development

```bash
npm run dev         # http://localhost:3000, redirects to /ka
```

Visit `/ka`, `/ru`, `/en` directly, or use the language switcher in the header.

## Checks

```bash
npm run typecheck   # nuxt typecheck (vue-tsc, strict mode)
npm run lint        # eslint .
npm run test        # vitest run — unit tests in tests/unit
npm run test:e2e    # playwright test — e2e tests in tests/e2e (starts the dev server itself)
```

## Database / Prisma

```bash
npm run db:generate   # regenerate the Prisma Client after editing prisma/schema.prisma
npm run db:migrate     # prisma migrate dev — create/apply a migration (needs DATABASE_URL reachable)
```

The Prisma Client is generated into `./generated/prisma` (gitignored, regenerate it after `npm install`). The connection string lives in `.env` as `DATABASE_URL`; the Prisma CLI reads it via `prisma.config.ts`, and the app reads it via `server/utils/prisma.ts` (PostgreSQL driver adapter — Prisma ORM 7 requires an explicit adapter, no bundled query engine).

As of Stage 1, `prisma/schema.prisma` only has the generator/datasource blocks — no models yet. The `Lead`/`LeadActivity` models land in Stage 4 together with the `/api/leads` endpoint; that stage is also where `db:migrate` gets its first real migration to run and where `scripts/export-leads`, `scripts/delete-lead`, and `scripts/purge-expired-leads` are added.

## Build / production preview

```bash
npm run build
npm run preview      # or: node .output/server/index.mjs
```

## Environment variables

See `.env.example` for the full list and inline comments. Summary:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (server-only, never exposed to the client) |
| `PUBLIC_SITE_URL` | Public base URL, used for canonical/hreflang tags |
| `BRAND_NAME` | Temporary, fully-configurable brand name shown in the UI |
| `BUSINESS_WHATSAPP_NUMBER` / `BUSINESS_TELEGRAM_USERNAME` | Messenger handoff after a lead is saved (Stage 5) |
| `OPERATOR_CONTACT_EMAIL` | Shown on the privacy page as the data-deletion contact |
| `DATA_RETENTION_DAYS` | How long lead data is kept before `scripts/purge-expired-leads` deletes it (Stage 4/8) |
| `PRICE_TEST_ENABLED` | Server-side switch for the price experiment (Stage 11); `false` until the owner approves real numbers |
| `ANALYTICS_PROVIDER` | Which analytics adapter to load, if any; `none` keeps analytics fully disabled (Stage 5/12) |

Production startup should validate that the required variables above are actually set — that validation is added together with the features that depend on each variable, not before.

## Known issues / environment notes

- **Node engine warnings on this machine:** several current packages (Nuxt 4.6, Nitro, Vite 8, some PostCSS plugins) declare `engines.node >= 22.21/22.22`, while this machine runs Node v22.14.0. `npm install` prints `EBADENGINE` warnings for these, but `dev`/`build`/`typecheck`/`lint`/`test` all run successfully on v22.14.0 in this project as verified during Stage 1. If something odd ever shows up that isn't explained elsewhere, upgrading Node to 22.21+ (or latest LTS) is the first thing to try.
- **Windows SSR workaround:** `nuxt.config.ts` sets `nitro.externals.inline` to bundle the renderer. This works around a confirmed Nuxt 4.6.0-on-Windows bug ([nuxt/nuxt#36467](https://github.com/nuxt/nuxt/issues/36467)) where every SSR page 500s with "Either manifest or precomputed data must be provided". Remove this workaround once upstream ships a fix in a later Nuxt patch release.
- `npm audit` currently reports transitive advisories (via Prisma's bundled `mysql2` support for non-Postgres providers we don't use, and via Nitro's dev-only `node-forge`/`listhen` HTTPS dev-cert tooling). The suggested `npm audit fix --force` would downgrade Nuxt and Prisma to old major versions, which would undo the Stage 0 "use current stable majors" decision — not applied. Revisit if a non-breaking fix becomes available.
- Local PostgreSQL via `docker compose up -d` was not run end-to-end in the environment this project was scaffolded in (Docker Desktop's daemon was not running there). The compose file and Prisma wiring are in place and `prisma generate` works without a live DB; verify `docker compose up -d` + `npm run db:migrate` once Docker is available, and definitely before Stage 4.

## Project status

See `docs/progress.md` for the stage-by-stage build log (done / next / validation / blockers) and `docs/references.md` for the competitive-reference review from Stage 0.
