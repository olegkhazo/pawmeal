# Launch checklist — PawMeal Georgia pilot

Everything in this file is unresolved or placeholder, carried forward from `docs/progress.md`'s stage-by-stage notes. The code and docs in this repo describe a deployable project — they do not mean any of this has actually happened. Per `.cursorrules.txt` section 15: do not run ads, publish, or message anyone without the owner's explicit instruction, and do not call this project launch-ready while any of the items below are still open.

## Blocking — must be done before any public launch

- [ ] **Verify the database for real.** Docker Desktop's daemon never came up during this build (Stages 1–6, including after a full restart). `npm run db:migrate -- --name init` has never run, and no lead has ever actually landed in Postgres. Before anything else: get a reachable `DATABASE_URL`, run the migration, submit the quiz, confirm a row appears in `Lead`, then exercise `npm run export-leads`, `npm run delete-lead`, and `npm run purge-expired-leads` against real rows.
- [ ] **Smoke-test the production build directly**, not just `npm run dev`. Stage 6 found a Windows-only crash in `node .output/server/index.mjs` that two full stages of dev-mode testing never caught. Confirm the built server actually answers `/`, `/api/leads`, `/robots.txt`, `/sitemap.xml` on whatever OS production will run on.
- [ ] **Replace the placeholder product/hero images.** Everything under `public/images/**` is a labeled SVG placeholder, not real photography or an approved render. See `docs/image-prompts.md` for the brief and the manifest of what's needed (6 product shots + hero, desktop/mobile crops).
- [ ] **Get the Georgian translation reviewed by a native speaker.** All of `locales/ka.json` (nav, hero, quiz, FAQ, privacy, errors, messenger text) was written by a non-native-speaker process. Spec section 10 is explicit that machine/non-native translation must not be marked as human-reviewed until it actually is.
- [ ] **Fill in real business contacts**: `BUSINESS_WHATSAPP_NUMBER`, `BUSINESS_TELEGRAM_USERNAME`, `OPERATOR_CONTACT_EMAIL` in production `.env`. Until these are set, the messenger buttons stay hidden and the privacy page's deletion contact shows a placeholder note — both correct behavior, but not launch-ready.
- [ ] **Decide the legal entity, address, and actual legal basis for data processing**, and update `app/pages/privacy.vue` / `locales/*.json` (`privacy.operatorBody`) accordingly. The current text explicitly avoids inventing any of this, per section 13 — it needs the owner's real answer, not a placeholder, before launch.
- [ ] **Smoke test on the real HTTPS production domain** once deployed (section 15's explicit requirement) — set `PUBLIC_SITE_URL` to the real domain first, since `robots.txt`'s `Sitemap:` line, the sitemap's URLs, and hreflang/canonical tags all derive from it.

## Should be done before spending real ad budget

- [ ] **Decide on `PRICE_TEST_ENABLED` and real segment prices**, once the owner has approved numbers (section 11). Currently always off — quiz step 8 always shows "we'll discuss cost after the quiz," never a number. This is Stage 11 work, not yet built.
- [ ] **Choose and wire up a real analytics provider**, if one is wanted. `ANALYTICS_PROVIDER=none` keeps `useTracking()` a no-op by design (see `docs/measurement.md`) — nothing is lying to you about traffic right now, there's just no sink yet. If a consent-gating policy applies to the chosen provider, gate its script load behind that consent inside `useTracking.ts`, not elsewhere.
- [ ] **Measure LCP/CLS/INP for real** (local Lighthouse run at minimum, ideally on the actual production domain). Not measured in this session — see `docs/progress.md` Stage 6. Section 15's ≤2.5s/≤0.1/≤200ms are targets, not guarantees, but right now they're unverified entirely.
- [ ] **Schedule `npm run purge-expired-leads`** on whatever the production host uses for cron/scheduled jobs — nothing in this repo runs it automatically.
- [ ] Decide whether to build the optional Telegram bot (`/start` + opaque token, section 9) for a guaranteed-delivery alternative to the manual `t.me/{username}` link. Not built — out of scope unless the owner asks for it specifically.

## Worth revisiting, not blocking

- [ ] Node engine warnings: this project was built on Node v22.14.0, below several packages' declared `engines.node >= 22.21/22.22`. Everything worked anyway, but upgrading Node is the first thing to try if something inexplicable breaks later.
- [ ] `npm audit` reports transitive advisories through Prisma's bundled `mysql2` (unused — we only use Postgres) and Nitro's dev-only HTTPS cert tooling. `npm audit fix --force` would downgrade Nuxt/Prisma to old majors — not applied; re-check when a non-breaking fix exists upstream.
- [ ] Two Windows-only Nitro workarounds live in `nuxt.config.ts` (`nitro.externals.inline` for an SSR renderer bug, `nitro.rollupConfig.output.banner` for the production-startup crash). Both have upstream issue links in the code comments / README "Known issues" — remove them once fixed upstream, and re-verify production boots without them before removing.
- [ ] The 404 page's language switcher renders without an `href` (since `switchLocalePath()` can't resolve a path for an unmatched route) — the "back home" link still works, so this is cosmetic, not broken.
- [ ] `CONSENT_VERSION`/`PRIVACY_VERSION` in `server/utils/consent.ts` are placeholder version strings — bump them whenever the consent checkbox copy or privacy policy text changes materially, so stored leads keep an accurate record of what they agreed to.

## Already done (listed here so it isn't re-litigated)

- Full landing, 9-step quiz, lead persistence with idempotency/rate-limiting, messenger handoff, typed analytics adapter, privacy page, SEO basics, and the measurement guide are built and covered by 26 unit + 27 e2e tests (`npm run test`, `npm run test:e2e`).
- `docs/progress.md` has the complete stage-by-stage record of decisions, bugs found and fixed, and validation actually performed — read it before assuming something wasn't checked.
