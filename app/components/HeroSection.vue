<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:pt-16">
    <div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div class="order-2 text-center lg:order-1 lg:text-left">
        <h1 class="text-3xl font-semibold text-brand-text sm:text-4xl">
          {{ t('home.hero.title') }}
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-brand-text-muted lg:mx-0">
          {{ t('home.hero.lead') }}
        </p>

        <div class="mt-8">
          <SpeciesSelector />
        </div>
      </div>

      <div class="order-1 lg:order-2">
        <img
          src="/images/hero/cat-and-dog.jpg"
          :alt="t('home.hero.imageAlt')"
          class="aspect-[4/3] w-full rounded-3xl object-cover shadow-sm"
          width="1600"
          height="1065"
        >
      </div>
    </div>
  </section>
</template>
