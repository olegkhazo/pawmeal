# Measurement guide — PawMeal Georgia pilot

This describes how to read the funnel and compute the formulas from section 12 of `.cursorrules.txt`. It does not define "good" thresholds — there is no ad budget or unit economics yet to judge against, and inventing one would be a guess dressed up as a target.

## Funnel

```
visitors → quiz starts → quiz completions → saved leads → messenger clicks → manually contacted → qualified → accepted price
```

| Stage | Source | Event / query |
|---|---|---|
| visitors | Analytics adapter (once a real provider is configured — see below) | `landing_view` |
| quiz starts | Analytics adapter | `quiz_started` |
| quiz completions | Analytics adapter | `quiz_completed` |
| **saved leads** | **Database — source of truth** | `SELECT count(*) FROM "Lead" WHERE ...` |
| messenger clicks | Analytics adapter | `messenger_clicked` |
| manually contacted | Database | `LeadActivity.status IN ('contacted','qualified','notInterested')` |
| qualified | Database | `LeadActivity.status = 'qualified'` (latest per lead) |
| accepted price | Database | `Lead.priceInterest = 'yes'` (only meaningful once `PRICE_TEST_ENABLED=true`, section 11) |

**Saved leads is the only stage that is authoritative.** Every analytics-adapter row (visitors through messenger clicks) can be undercounted by ad blockers, privacy modes, or — in this MVP — simply by `ANALYTICS_PROVIDER` still being `none` (the default; see `app/composables/useTracking.ts`). The lead count in Postgres is real regardless of whether analytics is wired up.

## Formulas

- **Quiz start rate** = quiz starts / visitors
- **Completion rate** = quiz completions / quiz starts
- **Lead conversion** = unique saved leads / visitors
- **CPL (cost per lead)** = ad spend / unique saved leads
- **Qualified CPL** = ad spend / qualified leads

All of these need an actual analytics provider wired up for the numerator-but-one stages (visitors/starts/completions) and an actual ad spend figure the owner supplies — neither exists yet in this MVP. The formulas are documented so that whoever wires up the provider and starts spending on ads has the definitions ready; they cannot be computed from this repo alone today.

## Required slices

Every number above should also be cut by:
- **City** (`cityId` — the fixed list in `data/cities.ts`, not the free-text `otherCity`)
- **Language** (`locale`)
- **Species** (`species`)
- **Campaign** (`utmCampaign`/`utmSource`, stored on `Lead`)
- **Price variant** (`experimentVariant`, once Stage 11's price experiment exists)

A single blended conversion rate across all cities/languages will hide the fact that, e.g., Tbilisi and a small town behave completely differently — slice before drawing any conclusion.

## What this data does NOT prove

- **A lead is not a sale.** `subscriptionInterest`/`priceInterest` are stated intent before any payment exists in this MVP (section 1, section 11) — do not report lead counts as revenue or committed customers.
- **A small sample does not prove or disprove market demand.** A pilot in a handful of cities with an early batch of leads is a signal to keep investigating, not a verdict.
- **A messenger-button click is not a completed conversation.** `messenger_clicked` fires on the click itself (section 12) — the person may never actually send the message, and `preferredChannel: 'call'` leads never click anything at all by design.
- **Analytics undercounts relative to the database.** If `landing_view`/`quiz_started` counts look suspiciously low next to the saved-lead count, that is expected under ad blockers or before a real provider is configured — it is not evidence the funnel broke.
- **No "normal" conversion benchmark is asserted here.** Section 12 is explicit that thresholds need a real test budget and the owner's own unit economics before they mean anything; this document intentionally does not supply one.

## Current state of the analytics side (as of Stage 5)

`ANALYTICS_PROVIDER=none` by default, which keeps `useTracking()` a no-op — no third-party script loads, nothing leaves the browser. The eleven events from section 12 (`landing_view`, `species_selected`, `quiz_started`, `quiz_step_completed`, `quiz_completed`, `recommendation_viewed`, `price_offer_viewed`, `price_interest_selected`, `lead_submit_success`, `lead_submit_error`, `messenger_clicked`) are already fired from the right places in the app (see `app/composables/useTracking.ts` and its call sites), but the only "sink" right now is a `console.debug` in dev mode. Every event payload is restricted by TypeScript (`shared/types/tracking.ts`) to the safe grouping fields section 12 allows — `locale`, `species`, `cityId`, `planType`, `experimentVariant`, `stepId`, `errorCode`, `channel` — the phone number, owner/pet name, Telegram handle, weight, and free-text answers are not fields any event payload can carry, so there is no runtime filter to bypass.

Wiring an actual provider (GA4, Plausible, Meta Pixel, etc.) is intentionally not done yet: loading a real third-party script the owner has not chosen and (if required by their consent policy) not gated behind consent would itself violate section 12. When a provider is chosen, load its script inside `useTracking.ts` only, gated by consent if that policy applies, and nowhere else in the app.
