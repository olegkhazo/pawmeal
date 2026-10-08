# References — Stage 0 review

Reviewed 2026-10-08. Goal: borrow structural/mechanical ideas only (information architecture, flow logic). No text, imagery, branding, ratings, or stats are copied; every section below is rewritten in our own words and none of it is used verbatim in the product.

## https://www.foodforjoe.es/

**Status: unreachable.** Fetched twice (with and without trailing slash); the fetch tool returned no page content both times, most likely because the site renders entirely client-side (JS SPA) and the fetcher only sees an empty shell, or the page is geo/robot-gated. No structural notes could be extracted directly.

Per the spec, Food for Joe is meant as the primary reference for **separating the dog/cat journey from the first screen** (species choice drives everything downstream: recipes, quiz, recommendation). We proceed on that documented intent alone, combined with general known patterns of the "fresh pet food DTC" category (hero with species picker → short value props → quiz CTA → recipe catalog → subscription explainer → FAQ), which is also the structure independently confirmed below for Different Dog and Smalls, and is what PawMeal's landing already needs to implement per section 4 of the spec. If the page becomes reachable later, revisit this entry.

## https://www.differentdog.com/

Reachable. Structural takeaways (mechanics only, not copy or design):

- Single long-scroll landing: hero → value pillars → proof/trust → "how it works" steps → brand story → FAQ → final CTA. We follow an equivalent order (spec section 4 already specifies this shape).
- Value proposition is split into a small fixed number of pillar cards (ingredients, formulation, format/preservation, batch process) — confirms our plan to keep the "короткая ценность" block to a handful of short, verifiable bullet points rather than long copy.
- "How it works" is a short numbered sequence (profile → recipe selection → delivery schedule → outcome check-in). Matches our quiz → recommendation → operator discussion → pilot delivery flow (spec section 4.4), just without any outcome/results promise since we cannot claim health outcomes.
- Recipes are not all displayed on the homepage; the catalog is reached through the personalization flow. We diverge here per spec: PawMeal must show a 6-card catalog directly on the landing (section 4.5), independent of quiz completion, so species/variety is visible before commitment.
- FAQ groups cluster around ingredients, preparation, storage, suitability, subscription flexibility, and nutritional completeness — directly useful as a category checklist for our own FAQ (section 4.8), minus any completeness/suitability claims we are not allowed to make.
- Visual style notes (illustration-heavy, mascot icons, large whitespace) are noted only as "one direction that exists in the category" — PawMeal's own visual identity (warm light background, graphite text, single green accent, soft cards) is specified independently in section 4 and is not derived from this site.

Nothing about pricing, review counts, certifications, or health-outcome percentages from this site is carried into PawMeal; those are exactly the categories of claim the spec forbids us from fabricating (section 2).

## https://www.smalls.com/

Reachable. Structural takeaways (mechanics only):

- Confirms the "build your plan" CTA repeated at multiple scroll depths, which we adopt as the repeated-CTA pattern already required by spec section 4.9 ("повторные CTA").
- Cat-specific framing is carried by tone/copy more than layout — useful as a cue that our cats vs. dogs distinction should mainly happen through species selection, imagery, and copy, not a structurally different page.
- Product lineup is grouped into a small number of named categories, which maps loosely to our fixed 6-concept catalog grouped by species (section 5) — we use a simpler, flatter grouping since PawMeal has no accessories/treats tier in MVP.
- FAQ/support reached through dedicated FAQ + contact + policy pages — matches our FAQ block (section 4.8) plus a separate /privacy route (section 4 routes).
- Trust badges seen here (free shipping, money-back guarantee, testimonials) are explicitly **not** usable for PawMeal — spec section 2 forbids promising free delivery, guarantees, or fabricated testimonials. Noted so no one on the team accidentally copies this pattern later.

## Net effect on PawMeal decisions

- Landing order, FAQ topic checklist, and "repeat the CTA" pattern are adopted as structure.
- No claims, numbers, testimonials, certifications, or guarantees are carried over from any of the three sites.
- Visual design, photography, and copy are original per spec sections 2 and 4.
