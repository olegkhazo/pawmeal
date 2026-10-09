<script setup lang="ts">
const { t, tm } = useI18n()
const stepCount = (tm('home.howItWorks.steps') as unknown[]).length
</script>

<template>
  <section id="how-it-works" class="mx-auto max-w-5xl px-4 py-12">
    <h2 class="text-center text-2xl font-semibold text-brand-text sm:text-3xl">
      {{ t('home.howItWorks.title') }}
    </h2>
    <ol class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <li
        v-for="index in stepCount"
        :key="index"
        class="rounded-2xl border border-brand-border bg-brand-surface p-5"
      >
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-sm font-semibold text-white"
          aria-hidden="true"
        >
          {{ index }}
        </span>
        <h3 class="mt-3 font-semibold text-brand-text">{{ t(`home.howItWorks.steps.${index - 1}.title`) }}</h3>
        <p class="mt-2 text-sm text-brand-text-muted">{{ t(`home.howItWorks.steps.${index - 1}.description`) }}</p>
      </li>
    </ol>
  </section>
</template>
