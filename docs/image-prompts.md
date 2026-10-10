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

## Hero image (2026-10-10 update)

The owner asked for a two-column hero layout (CTA on the left, a photo of a cat and a dog sitting together on the right), styled after the structural layout of foodforjoe.es's hero (left CTA / right pet image) — not a pixel copy of their design, just the same two-column idea, which is a generic layout pattern anyway. foodforjoe.es was not actually reachable by the fetch tool in this session (same as in Stage 0 — likely a client-rendered SPA), so this was built from the owner's description, not a direct look at the reference.

This replaces the original SVG "pouches + bowl" placeholder entirely — `HeroSection.vue` now renders a single real photo, not separate desktop/mobile crops via `<picture>`.

| Asset | File | Source | License | Attribution required? |
|---|---|---|---|---|
| Hero (cat + dog) | `public/images/hero/cat-and-dog.jpg` | [Pexels — photo by Helena Jankovičová Kováčová](https://www.pexels.com/photo/16395150/) | Pexels License | No (credited here anyway as a courtesy) |

Notes:
- Downloaded at 1600×1065 (Pexels' own resize query param, `?w=1600`) rather than the ~4100px original — keeps the file around 175 KB instead of ~1.6 MB, since this image loads eagerly above the fold and directly affects LCP.
- A Bengal-pattern cat and a Yorkshire terrier, both upright (cat sitting, dog in an alert half-stand) side by side on a shelf by a window — close enough to "sitting next to each other" to match the ask; a photo with both animals in a strict seated pose and this level of photo quality, brand-appropriate lighting, and a genuinely free license was not found after a reasonably thorough search.
- Used as a single image at a `4/3` object-cover aspect ratio for both the right-column desktop layout and the stacked-above-text mobile layout — not separate crops. `alt` text is now descriptive (`home.hero.imageAlt`, all 3 locales) since this is real photo content, not decorative.

### Superseded — original packaging-concept hero brief

The hero no longer uses the sealed-pouch "packaging concept" composition described below. Kept only in case the owner wants that direction again later (e.g. once real packaging design exists) — it does not describe the current hero image.

> Composition of several unbranded sealed flat food pouches (same style as the product shots) arranged next to a simple pet bowl, warm ivory studio background, soft natural shadows, empty space reserved at the top for a headline, no logos, no readable text, no people, no watermark. Packaging concept, not an existing certified product.

### Superseded — original product-card packaging-concept brief

> Photorealistic premium pet food concept product photography, unbranded sealed flat food pouch with subtle transparent window showing gently cooked food, warm ivory studio background, soft natural shadows, minimal muted green label area left blank for later typography, matching product family, realistic food texture, no logos, no readable text, no medical badges, no hands, no watermark. Product is a packaging concept, not an existing certified product.

## Still not done

- No sealed-pouch packaging photography/renders of the actual product — both the hero and the product cards currently show real but unbranded stock photography (pets, ingredients), not the product itself, since there is no real packaging yet.
- Product-card images are real ingredient photos now, but not yet optimized (AVIF/WebP, consistent resolution).
