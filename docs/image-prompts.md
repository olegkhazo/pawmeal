# Image prompts & manifest — Stage 2

No image-generation tool was available in this environment, so every asset below is a clearly-labeled SVG placeholder (text label + "placeholder — concept photo pending"), not a real or implied-real photo. These are temporary and must be replaced before a public launch. This file is the brief for whoever (a person or an image-generation tool) produces the real photography/renders.

## Common prompt

Use this for every product card, adjusting only species/protein as noted below:

> Photorealistic premium pet food concept product photography, unbranded sealed flat food pouch with subtle transparent window showing gently cooked food, warm ivory studio background, soft natural shadows, minimal muted green label area left blank for later typography, matching product family, realistic food texture, no logos, no readable text, no medical badges, no hands, no watermark. Product is a packaging concept, not an existing certified product.

Keep the composition identical across all six cards; vary only the packaging accent color per family and the visible food texture per protein. Do not add ingredients that contradict the card (e.g. no fish texture on a chicken concept).

## Hero prompt

> Composition of several unbranded sealed flat food pouches (same style as the product shots) arranged next to a simple pet bowl, warm ivory studio background, soft natural shadows, empty space reserved at the top for a headline, no logos, no readable text, no people, no watermark. Packaging concept, not an existing certified product.

Needs two crops: desktop 16:9 and a separate mobile 4:5 crop (not just a scaled-down version — recompose so the subject stays legible in portrait).

## Manifest

| Asset | Species | Protein | File (current placeholder) | Target formats | Status |
|---|---|---|---|---|---|
| Product card | dog | chicken | `public/images/products/dog-chicken.svg` | 1:1, source + AVIF/WebP | **placeholder** |
| Product card | dog | turkey | `public/images/products/dog-turkey.svg` | 1:1, source + AVIF/WebP | **placeholder** |
| Product card | dog | beef | `public/images/products/dog-beef.svg` | 1:1, source + AVIF/WebP | **placeholder** |
| Product card | cat | chicken | `public/images/products/cat-chicken.svg` | 1:1, source + AVIF/WebP | **placeholder** |
| Product card | cat | turkey | `public/images/products/cat-turkey.svg` | 1:1, source + AVIF/WebP | **placeholder** |
| Product card | cat | fish | `public/images/products/cat-fish.svg` | 1:1, source + AVIF/WebP | **placeholder** |
| Hero (desktop) | — | — | `public/images/hero/hero-desktop.svg` | 16:9, source + AVIF/WebP | **placeholder** |
| Hero (mobile) | — | — | `public/images/hero/hero-mobile.svg` | 4:5, source + AVIF/WebP | **placeholder** |

Once real assets exist: keep the original source files (PSD/PNG/whatever the generator outputs) somewhere separate from the optimized `public/images/**` output, export product shots at 1:1 and hero at 16:9 (desktop) / 4:5 (mobile), encode the web-served versions as AVIF with a WebP fallback, and set `loading="lazy"` on every product card image (hero stays eager/non-lazy since it's above the fold). Alt text for every image already exists per locale under `recipes.<id>.alt` in `locales/*.json` — update the wording there if the final photography changes what's visible, but keep each alt string honest about status (these remain "concept photo", not finished product shots, until real photography/approved renders land).

## Not done here

- No actual photography or AI-rendered imagery was produced — this file only prepares the brief and the manifest.
- The gallery copy note required by spec section 6 ("Визуализация будущей упаковки") is wired into the product card captions in the UI, not just this doc — see `RecipeCard.vue`.
