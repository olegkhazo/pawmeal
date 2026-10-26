<script setup lang="ts">
// Hand-drawn style icon inside a scalloped "stamp" badge. Purely decorative
// (aria-hidden) — the surrounding text always carries the meaning.
export type DoodleIcon = 'pouch' | 'bowl' | 'truck' | 'clipboard' | 'chat' | 'paw'

withDefaults(defineProps<{ icon: DoodleIcon; tint?: string }>(), { tint: '#fdf3de' })

const ink = '#183f37'
// Bumps around the edge make the scalloped stamp outline.
const bumps = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  return { cx: 50 + Math.cos(a) * 39, cy: 50 + Math.sin(a) * 39 }
})
</script>

<template>
  <svg viewBox="0 0 100 100" class="h-full w-full" aria-hidden="true">
    <g :fill="tint">
      <circle cx="50" cy="50" r="40" />
      <circle v-for="(b, i) in bumps" :key="i" :cx="b.cx" :cy="b.cy" r="8.5" />
    </g>

    <g :stroke="ink" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <template v-if="icon === 'pouch'">
        <path d="M36 28h28l4 42q0 6-6 6H38q-6 0-6-6z" fill="#f4b221" />
        <path d="M38 35h24" />
        <rect x="41" y="46" width="18" height="14" rx="4" fill="#fffcf8" />
        <path d="M45 54q2-4 5 0q3-4 5 0" stroke-width="2" />
      </template>

      <template v-else-if="icon === 'bowl'">
        <path d="M27 52q4-9 9-3q4-8 9-2q5-8 10-1q5-7 9 1q5-5 9 5" fill="#c57959" />
        <path d="M24 52h52q-2 22-26 22T24 52z" fill="#ff7c5f" />
        <path d="M40 30q-3 5 0 9M50 27q-3 6 0 11M60 30q-3 5 0 9" stroke-width="2.2" />
      </template>

      <template v-else-if="icon === 'truck'">
        <rect x="20" y="36" width="36" height="26" rx="3" fill="#e0edf5" />
        <path d="M56 44h12l8 9v9H56z" fill="#f4b221" />
        <path d="M61 47h6l4 5h-10z" fill="#fffcf8" stroke-width="2" />
        <circle cx="32" cy="64" r="6" fill="#fffcf8" />
        <circle cx="66" cy="64" r="6" fill="#fffcf8" />
        <path d="M30 46q3 4 6 0q3 4 6 0" stroke-width="2" />
      </template>

      <template v-else-if="icon === 'clipboard'">
        <rect x="30" y="26" width="40" height="50" rx="5" fill="#fffcf8" />
        <rect x="41" y="22" width="18" height="9" rx="3" fill="#d2da78" />
        <path d="M37 42l3 3 5-6M50 42h13M37 54l3 3 5-6M50 54h13M37 66h26" />
      </template>

      <template v-else-if="icon === 'chat'">
        <path d="M24 34q0-8 8-8h36q8 0 8 8v18q0 8-8 8H44l-11 10v-10h-1q-8 0-8-8z" fill="#ffdfd8" />
        <circle cx="38" cy="43" r="2.4" fill="#183f37" />
        <circle cx="50" cy="43" r="2.4" fill="#183f37" />
        <circle cx="62" cy="43" r="2.4" fill="#183f37" />
      </template>

      <template v-else>
        <ellipse cx="50" cy="60" rx="13" ry="11" fill="#c57959" />
        <ellipse cx="33" cy="45" rx="5.5" ry="7" fill="#c57959" />
        <ellipse cx="44" cy="35" rx="5.5" ry="7" fill="#c57959" />
        <ellipse cx="56" cy="35" rx="5.5" ry="7" fill="#c57959" />
        <ellipse cx="67" cy="45" rx="5.5" ry="7" fill="#c57959" />
      </template>
    </g>
  </svg>
</template>
