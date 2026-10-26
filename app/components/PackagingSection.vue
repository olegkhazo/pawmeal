<script setup lang="ts">
const { t, tm } = useI18n()
const pointCount = (tm('home.packaging.points') as unknown[]).length

// Doypack silhouettes on the fridge shelves: x, shelf baseline y, height, tint.
// Kept deliberately faint (see the mist overlay) — the fridge is the subject,
// the pouches only hint at what's inside.
const pouches = [
  { x: 98, y: 110, h: 52, fill: '#3f7d52' },
  { x: 140, y: 110, h: 46, fill: '#c06a1f' },
  { x: 182, y: 110, h: 52, fill: '#a4553f' },
  { x: 104, y: 190, h: 50, fill: '#c06a1f' },
  { x: 148, y: 190, h: 54, fill: '#3f7d52' },
  { x: 194, y: 190, h: 48, fill: '#8a8f5a' },
  { x: 112, y: 272, h: 54, fill: '#a4553f' },
  { x: 160, y: 272, h: 50, fill: '#3f7d52' },
]

function pouchPath(x: number, y: number, h: number) {
  // Stand-up pouch: slightly narrower top seal, rounded gusset at the base.
  return `M${x + 3} ${y - h} h30 q3 0 3 3 l3 ${h - 9} q0 6 -6 6 h-30 q-6 0 -6 -6 l3 ${-(h - 9)} q0 -3 3 -3 z`
}
</script>

<template>
  <section id="packaging" class="mx-auto max-w-5xl px-4 py-12">
    <div
      class="grid overflow-hidden rounded-3xl bg-brand-accent-strong text-white shadow-md md:grid-cols-2"
    >
      <div class="flex items-center justify-center bg-brand-sky p-6 sm:p-8">
        <svg
          viewBox="0 0 400 330"
          class="h-auto w-full max-w-sm"
          role="img"
          aria-labelledby="packaging-illustration-title"
        >
          <title id="packaging-illustration-title">{{ t('home.packaging.imageAlt') }}</title>
          <defs>
            <linearGradient id="pk-interior" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ffffff" />
              <stop offset="1" stop-color="#d7e6e1" />
            </linearGradient>
            <radialGradient id="pk-glow" cx="0.5" cy="0.05" r="0.9">
              <stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="pk-mist" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#f4f9f7" stop-opacity="0.55" />
              <stop offset="0.5" stop-color="#f4f9f7" stop-opacity="0.35" />
              <stop offset="1" stop-color="#f4f9f7" stop-opacity="0.6" />
            </linearGradient>
            <filter id="pk-soft" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.4" />
            </filter>
          </defs>

          <ellipse cx="200" cy="314" rx="160" ry="10" fill="#2f5f3e" opacity="0.12" />

          <!-- Fridge body -->
          <rect x="70" y="14" width="200" height="296" rx="16" fill="#fbf6ee" stroke="#cfc4ae" stroke-width="2" />
          <rect x="84" y="28" width="172" height="262" rx="8" fill="url(#pk-interior)" />
          <rect x="84" y="28" width="172" height="262" rx="8" fill="url(#pk-glow)" />
          <rect x="150" y="32" width="40" height="5" rx="2.5" fill="#ffffff" />

          <!-- Pouches, softened and veiled so they read as barely visible -->
          <g filter="url(#pk-soft)" opacity="0.5">
            <g v-for="(p, i) in pouches" :key="i">
              <path :d="pouchPath(p.x, p.y, p.h)" :fill="p.fill" />
              <line :x1="p.x + 6" :y1="p.y - p.h + 9" :x2="p.x + 30" :y2="p.y - p.h + 9" stroke="#ffffff" stroke-opacity="0.7" stroke-width="2" />
              <rect :x="p.x + 7" :y="p.y - p.h / 2 - 6" width="22" height="14" rx="3" fill="#ffffff" opacity="0.45" />
            </g>
          </g>
          <rect x="84" y="28" width="172" height="262" rx="8" fill="url(#pk-mist)" />

          <!-- Glass shelves -->
          <rect x="88" y="110" width="164" height="4" rx="2" fill="#b9d0c8" opacity="0.8" />
          <rect x="88" y="190" width="164" height="4" rx="2" fill="#b9d0c8" opacity="0.8" />
          <rect x="88" y="272" width="164" height="4" rx="2" fill="#b9d0c8" opacity="0.8" />

          <!-- Open door, swung toward the viewer -->
          <path d="M270 18 L346 40 Q352 42 352 48 L352 280 Q352 286 346 288 L270 306 Z" fill="#f2ebdf" stroke="#cfc4ae" stroke-width="2" />
          <path d="M282 64 L340 78 L340 96 L282 84 Z" fill="#e3dac8" />
          <path d="M282 150 L340 160 L340 178 L282 170 Z" fill="#e3dac8" />
          <path d="M282 236 L340 242 L340 260 L282 256 Z" fill="#e3dac8" />
          <rect x="336" y="120" width="5" height="60" rx="2.5" fill="#cfc4ae" />

          <!-- Cold air drifting out -->
          <g fill="none" stroke="#9fc2b6" stroke-linecap="round" stroke-width="2.5" opacity="0.7">
            <path d="M30 96 q14 -10 28 0 t28 0" />
            <path d="M22 160 q14 -10 28 0 t28 0" />
            <path d="M34 224 q14 -10 28 0 t28 0" />
          </g>
          <g fill="#9fc2b6" opacity="0.8">
            <circle cx="372" cy="70" r="3" />
            <circle cx="382" cy="130" r="2" />
            <circle cx="368" cy="196" r="2.5" />
          </g>
        </svg>
      </div>

      <div class="flex flex-col justify-center p-8 sm:p-10">
        <h2 class="text-2xl font-semibold sm:text-3xl">
          {{ t('home.packaging.title') }}
        </h2>
        <p class="mt-3 text-lg text-white/90">{{ t('home.packaging.lead') }}</p>
        <ul class="mt-6 space-y-5">
          <li v-for="index in pointCount" :key="index" class="flex gap-3">
            <span
              class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-cta text-xs font-semibold text-brand-text"
              aria-hidden="true"
            >
              {{ index }}
            </span>
            <div>
              <h3 class="font-semibold">{{ t(`home.packaging.points.${index - 1}.title`) }}</h3>
              <p class="mt-1 text-sm text-white/80">{{ t(`home.packaging.points.${index - 1}.description`) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
