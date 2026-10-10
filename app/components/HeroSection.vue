<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 pb-10 pt-12 text-center sm:pt-16">
    <picture>
      <source media="(min-width: 768px)" srcset="/images/hero/hero-desktop.svg" >
      <img
        src="/images/hero/hero-mobile.svg"
        alt=""
        class="mx-auto mb-8 h-auto w-full max-w-3xl rounded-3xl"
        width="1600"
        height="900"
      >
    </picture>

    <h1 class="text-3xl font-semibold text-brand-text sm:text-4xl">
      {{ t('home.hero.title') }}
    </h1>
    <p class="mx-auto mt-4 max-w-2xl text-brand-text-muted">
      {{ t('home.hero.lead') }}
    </p>

    <div class="mt-8">
      <SpeciesSelector />
    </div>
  </section>
</template>
