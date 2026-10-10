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

`test:e2e` needs the Playwright browser binaries once per machine: `npx playwright install chromium`.

## Database / Prisma

```bash
npm run db:generate   # regenerate the Prisma Client after editing prisma/schema.prisma
npm run db:migrate     # prisma migrate dev — create/apply a migration (needs DATABASE_URL reachable)
```

The Prisma Client is generated into `./generated/prisma` (gitignored, regenerate it after `npm install`). The connection string lives in `.env` as `DATABASE_URL`; the Prisma CLI reads it via `prisma.config.ts`, and the app reads it via `server/utils/prisma.ts` (PostgreSQL driver adapter — Prisma ORM 7 requires an explicit adapter, no bundled query engine).

`prisma/schema.prisma` has three models: `Lead` (the full quiz + contact submission, section 8 of the spec), `LeadActivity` (operator notes/status on a lead, intentionally not a copy of the quiz answers), and `RateLimitHit` (backs the DB-persisted rate limiter in `server/utils/rateLimit.ts` — not in-process memory, so it survives restarts). **No migration has been generated or applied yet** — `npm run db:migrate` needs a reachable `DATABASE_URL`, and the Docker Desktop daemon was unavailable for the entire session this schema was written in (see "Known issues" below). Run it yourself once Docker/Postgres is up:

```bash
docker compose up -d
npm run db:migrate -- --name init
```

That creates `prisma/migrations/<timestamp>_init/` and applies it. `npx prisma validate` confirms the schema itself is syntactically correct without needing a live connection — that was run and passed.

### Leads API and CLI scripts

- `POST /api/leads` (`server/api/leads.post.ts`) validates the full submission with `shared/schemas/lead.ts` (server-side, independent of the client), enforces a body-size cap, checks `Origin` against `PUBLIC_SITE_URL` when present, rate-limits by IP, rejects a filled honeypot field with the same generic error as any other invalid payload, and is idempotent on `clientRequestId` (a retry with the same id returns the original `leadId` instead of creating a duplicate or doing a public lookup by phone). Every error path returns `{ errorCode }` and never logs the phone number, Telegram handle, free-text answers, or raw request body.
- `recommendedRecipeIds`/`needsConsultation` are computed server-side from `shared/utils/recommend.ts` — the client's own preview on quiz step 8 is never trusted as the stored value.
- `npm run export-leads -- --from=2026-01-01 --to=2026-12-31 --city=tbilisi --locale=ru --out=leads.csv` — CSV export with formula-injection guarding (a leading `=`, `+`, `-`, or `@` gets an escaping apostrophe). Server/CLI-only, no public route.
- `npm run delete-lead -- --id=<leadId>` — deletes one lead (and its activities, via cascade).
- `npm run purge-expired-leads` — deletes leads older than `DATA_RETENTION_DAYS` and prunes stale rate-limit rows. Intended to run on a schedule; not wired to a scheduler itself yet.

## Build / production preview

```bash
npm run build
npm run preview      # or: node .output/server/index.mjs
```

## Deployment

This is a standard Nuxt 4 app with a Node (Nitro) server output — it is not tied to any one host. On any VM/container host that can run Node 22 LTS and reach a PostgreSQL instance:

```bash
npm ci
npm run db:generate
npm run db:migrate -- --name init   # first deploy only; later deploys use `prisma migrate deploy`
npm run build
node .output/server/index.mjs       # listens on $PORT (default 3000) / $HOST
```

Put a reverse proxy (nginx, Caddy, the platform's own load balancer, etc.) in front of it for HTTPS — Nitro's Node server itself does not terminate TLS. Set every variable from `.env.example` in the real environment (not a committed `.env` file) before starting. **On Windows specifically**, always run `node .output/server/index.mjs` directly once after building and confirm it actually answers a request — see the Windows production-build note under "Known issues" below; `npm run dev` will not catch a regression there. This project has not been deployed anywhere in this session (see `docs/launch-checklist.md`) — the commands above are the intended path, not a verified one yet.

For subsequent deploys, prefer `npx prisma migrate deploy` over `migrate dev` (it doesn't prompt and doesn't try to create a new migration from schema drift) once `prisma/migrations/` already has history.

## Backup / restore

There's no custom backup tooling here — use Postgres' own:

```bash
# Backup
pg_dump "$DATABASE_URL" -F c -f pawmeal-backup.dump

# Restore into an empty database
pg_restore -d "$DATABASE_URL" --clean --if-exists pawmeal-backup.dump
```

Retention is handled separately by `npm run purge-expired-leads` (deletes leads older than `DATA_RETENTION_DAYS`) — run it on a schedule (cron, a platform scheduled job, etc.); nothing in this repo schedules it automatically. Back up before running it if you ever need to recover a purged lead.

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
- **Windows production-build workaround (found in Stage 6):** without `nitro.rollupConfig.output.banner` in `nuxt.config.ts`, the production server (`node .output/server/index.mjs`) crashed on startup with `ERR_INVALID_FILE_URL_PATH` — every build since Stage 4 was silently broken in production on Windows (dev mode and `npm run test:e2e`, which runs against `nuxt dev`, never exercise the production bundle, so this went unnoticed for two stages). Root cause: Nitro's own fallback `globalThis._importMeta_ = { url: "file:///_entry.js" }` has no drive letter, and the Prisma-generated client calls `fileURLToPath()` on it at module-load time. The banner sets a real, drive-lettered path first. This is Windows-only (Linux's file-URL parser doesn't require a drive letter) and not expected to affect a real deploy — remove it if a future Nitro release fixes the per-chunk `import.meta.url` shim. **If you build on Windows, always smoke-test `node .output/server/index.mjs` directly after a build** — `npm run dev` and `npm run test:e2e` will not catch a regression here.
- `npm audit` currently reports transitive advisories (via Prisma's bundled `mysql2` support for non-Postgres providers we don't use, and via Nitro's dev-only `node-forge`/`listhen` HTTPS dev-cert tooling). The suggested `npm audit fix --force` would downgrade Nuxt and Prisma to old major versions, which would undo the Stage 0 "use current stable majors" decision — not applied. Revisit if a non-breaking fix becomes available.
- **Local PostgreSQL has never been verified end-to-end in this environment.** Docker Desktop's daemon hung on startup throughout Stages 1–4 (including after a full process kill + relaunch); `docker info`/`docker ps`/`docker compose up -d` all time out. `prisma validate` and `prisma generate` work without a live DB and were run successfully, and the `/api/leads` route's `db_unavailable` error path was verified for real against this actually-unreachable database (see `tests/e2e/lead-submission.spec.ts`) — but the "happy path" (a lead actually landing in Postgres, `npm run db:migrate` producing a real migration, the CLI scripts touching real rows) has only been reviewed by reading the code, not run. **Treat this as the top priority to verify before trusting Stage 4 is fully working**: get Docker (or any reachable Postgres) running, then `npm run db:migrate -- --name init`, then resubmit the quiz and confirm a row appears in `Lead`.
- Product/hero images under `public/images/**` are temporary SVG placeholders (clearly labeled "placeholder — concept photo pending"), not real photography or AI-rendered concepts — see `docs/image-prompts.md` for the brief and manifest to replace them before launch.

## Project status

See `docs/progress.md` for the stage-by-stage build log (done / next / validation / blockers), `docs/references.md` for the competitive-reference review from Stage 0, `docs/measurement.md` for the analytics funnel and formulas, and **`docs/launch-checklist.md` before any public launch** — it lists everything that is still a placeholder (images, Georgian proofreading, business contacts, live-DB verification, performance measurement) and must not be treated as done just because the code exists.
