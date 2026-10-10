# Image prompts & manifest

## Product cards — ingredient photos (2026-10-10 update)

The owner asked (after seeing the Stage 2 SVG placeholders in the browser) to replace the 6 product-card images with real photos of each concept's main ingredient — e.g. a piece of salmon for the fish concept, a piece of turkey for the turkey concept — rather than waiting for the original sealed-pouch packaging-concept photography described below. This is a deliberate content pivot, not a reversion of the "no fake photography" rule: every image below is a genuine, appropriately-licensed photo of the named ingredient, not an AI render and not implied to be finished product/packaging photography.

No image-generation tool was available in this environment, so these are licensed stock photos, sourced and attributed as follows:

| Card | Species | Protein | File | Source | License | Attribution required? |
|---|---|---|---|---|---|---|
| Product card | dog | chicken | `public/images/products/dog-chicken.jpg` | [Wikimedia Commons — Kycklingfilé.jpg](https://commons.wikimedia.org/wiki/File:Kycklingfil%C3%A9.jpg) | Public domain (author's dedication) | No |
| Product card | cat | chicken | `public/images/products/cat-chicken.jpg` | same file as above | Public domain | No |
| Product card | dog | turkey | `public/images/products/dog-turkey.jpg` | [Pixabay — "Turkey Hen Meat"](https://pixabay.com/photos/turkey-hen-meat-raw-pink-chicken-569069/) | Pixabay Content License | No |
| Product card | cat | turkey | `public/images/products/cat-turkey.jpg` | same file as above | Pixabay Content License | No |
| Product card | dog | beef | `public/images/products/dog-beef.jpg` | [Wikimedia Commons — Rib-steak-raw-MCB.jpg](https://commons.wikimedia.org/wiki/File:Rib-steak-raw-MCB.jpg) (Michael C. Berch, 2007) | CC BY-SA 2.5 | **Yes** — credited in the site footer (`footer.photoCredits`, all 3 locales) |
| Product card | cat | fish | `public/images/products/cat-fish.jpg` | [Wikimedia Commons — SalmonFillet.jpg](https://commons.wikimedia.org/wiki/File:SalmonFillet.jpg) | CC0 1.0 (public domain) | No |

Notes:
- Turkey and raw chicken breast look genuinely similar unprocessed — a distinctly "turkey-looking" free stock photo with editorial-quality styling was not found after a reasonably thorough search (Unsplash/Pexels/Pixabay/Wikimedia Commons). The chosen Pixabay photo is correctly labeled as turkey by its uploader; this is a real limitation of free stock photography for this ingredient, not a mislabeling.
- These are source-quality JPEGs straight from their source (118 KB–840 KB), not yet optimized to AVIF/WebP or pre-cropped to a 1:1 source master — `RecipeCard.vue`'s `aspect-square object-cover` handles the square crop at render time, but a proper optimization pass (AVIF + WebP fallback, consistent source resolution) is still pending before launch.
- `recipes.<id>.alt` in `locales/*.json` now describes each image honestly as an ingredient photo ("Фото ингредиента, не упаковки" / "Ingredient photo, not packaging" / ქართულად შესაბამისად), not a packaging visualization. The catalog's `home.catalog.galleryNote` caption was updated the same way.
- The CC BY-SA 2.5 beef photo's attribution lives in the site footer, visible on every page — not just in this doc — per the license's actual requirement.

## Hero image — original brief (not changed by this update)

The hero composition (`public/images/hero/hero-desktop.svg`, `hero-mobile.svg`) is still the original labeled SVG placeholder from Stage 2 — the owner's request was specifically about the product cards, not the hero. The original packaging-concept brief below still applies whenever real hero photography/renders are produced.

### Common prompt (original packaging-concept brief, superseded for product cards by the table above)

> Photorealistic premium pet food concept product photography, unbranded sealed flat food pouch with subtle transparent window showing gently cooked food, warm ivory studio background, soft natural shadows, minimal muted green label area left blank for later typography, matching product family, realistic food texture, no logos, no readable text, no medical badges, no hands, no watermark. Product is a packaging concept, not an existing certified product.

This prompt is kept here for whenever actual sealed-pouch packaging photography/renders are produced later (e.g. once real packaging design exists) — it no longer describes what the product cards currently show.

### Hero prompt

> Composition of several unbranded sealed flat food pouches (same style as the product shots) arranged next to a simple pet bowl, warm ivory studio background, soft natural shadows, empty space reserved at the top for a headline, no logos, no readable text, no people, no watermark. Packaging concept, not an existing certified product.

Needs two crops: desktop 16:9 and a separate mobile 4:5 crop (not just a scaled-down version — recompose so the subject stays legible in portrait).

| Asset | File (current placeholder) | Target formats | Status |
|---|---|---|---|
| Hero (desktop) | `public/images/hero/hero-desktop.svg` | 16:9, source + AVIF/WebP | **placeholder** |
| Hero (mobile) | `public/images/hero/hero-mobile.svg` | 4:5, source + AVIF/WebP | **placeholder** |

## Still not done

- No hero photography/renders — still an SVG placeholder.
- Product-card images are real ingredient photos now, but not yet optimized (AVIF/WebP, consistent resolution) or replaced with actual sealed-pouch packaging photography of the real product, if the owner wants that later instead.
