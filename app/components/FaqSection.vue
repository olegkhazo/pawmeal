<script setup lang="ts">
const { t, tm } = useI18n()
const itemCount = (tm('faq.items') as unknown[]).length
</script>

<template>
  <section id="faq" class="mx-auto max-w-3xl px-4 py-12">
    <h2 class="text-center text-2xl font-semibold text-brand-text sm:text-3xl">
      {{ t('faq.title') }}
    </h2>
    <div class="mt-6 flex flex-col gap-3">
      <details
        v-for="index in itemCount"
        :key="index"
        class="group rounded-2xl border border-brand-border bg-brand-surface p-4"
      >
        <summary class="cursor-pointer list-none font-medium text-brand-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent">
          {{ t(`faq.items.${index - 1}.q`) }}
        </summary>
        <p class="mt-2 text-sm text-brand-text-muted">{{ t(`faq.items.${index - 1}.a`) }}</p>
      </details>
    </div>
  </section>
</template>
