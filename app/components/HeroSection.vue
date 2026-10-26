<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Scattered paw prints in the background -->
    <svg class="pointer-events-none absolute -left-6 top-10 h-24 w-24 rotate-[-20deg] text-brand-sand" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="50" cy="62" rx="16" ry="13" /><ellipse cx="28" cy="44" rx="7" ry="9" /><ellipse cx="42" cy="30" rx="7" ry="9" />
        <ellipse cx="58" cy="30" rx="7" ry="9" /><ellipse cx="72" cy="44" rx="7" ry="9" />
      </g>
    </svg>
    <svg class="pointer-events-none absolute bottom-6 right-[45%] hidden h-16 w-16 rotate-[25deg] text-brand-sand lg:block" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="50" cy="62" rx="16" ry="13" /><ellipse cx="28" cy="44" rx="7" ry="9" /><ellipse cx="42" cy="30" rx="7" ry="9" />
        <ellipse cx="58" cy="30" rx="7" ry="9" /><ellipse cx="72" cy="44" rx="7" ry="9" />
      </g>
    </svg>

    <div class="relative mx-auto max-w-5xl px-4 pb-14 pt-10 sm:pt-14">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div class="order-2 text-center lg:order-1 lg:text-left">
          <p class="font-hand text-2xl text-brand-terracotta sm:text-3xl">{{ t('home.hero.eyebrow') }}</p>
          <h1 class="mt-1 text-4xl leading-tight text-brand-text sm:text-5xl">
            {{ t('home.hero.title') }}
          </h1>
          <p class="mx-auto mt-5 max-w-2xl text-brand-text-muted lg:mx-0">
            {{ t('home.hero.lead') }}
          </p>

          <div class="mt-8">
            <SpeciesSelector />
          </div>
        </div>

        <div class="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <!-- Hand-drawn colour blobs behind the photo -->
          <svg class="absolute -right-5 -top-7 h-[92%] w-[80%] rotate-6 text-brand-cta sm:-right-8 sm:-top-9" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
            <path fill="currentColor" d="M44 22c28-20 82-22 116 2s46 74 26 110-70 60-112 52S6 146 6 104s10-62 38-82z" />
          </svg>
          <svg class="absolute -bottom-6 -left-5 h-28 w-28 text-brand-salmon" viewBox="0 0 100 100" aria-hidden="true">
            <path fill="currentColor" d="M50 6c22 0 42 16 44 40s-14 46-40 48S6 76 6 50 28 6 50 6z" />
          </svg>
          <img
            src="/images/hero/cat-and-dog.jpg"
            :alt="t('home.hero.imageAlt')"
            class="relative aspect-[4/3] w-full -rotate-2 rounded-[2.5rem] border-[6px] border-brand-surface object-cover shadow-lg"
            width="1600"
            height="1065"
          >
          <svg class="absolute -bottom-8 right-6 h-20 w-20 rotate-12" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M50 88S12 64 12 38a19 19 0 0 1 38-6 19 19 0 0 1 38 6c0 26-38 50-38 50z" fill="#ff7c5f" stroke="#183f37" stroke-width="4" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>
