<script setup lang="ts">
const { t, tm } = useI18n()
const itemCount = (tm('faq.items') as unknown[]).length
</script>

<template>
  <section id="faq" class="mx-auto max-w-3xl px-4 py-14">
    <h2 class="squiggle text-center text-3xl text-brand-text sm:text-4xl">
      {{ t('faq.title') }}
    </h2>
    <div class="mt-8 flex flex-col gap-3">
      <details
        v-for="index in itemCount"
        :key="index"
        class="group rounded-2xl border-2 border-brand-border bg-brand-surface p-5 transition open:border-brand-accent"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent [&::-webkit-details-marker]:hidden">
          {{ t(`faq.items.${index - 1}.q`) }}
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cta text-xl leading-none text-brand-text transition group-open:rotate-45"
            aria-hidden="true"
          >+</span>
        </summary>
        <p class="mt-3 whitespace-pre-line text-sm text-brand-text-muted">{{ t(`faq.items.${index - 1}.a`) }}</p>
      </details>
    </div>
  </section>
</template>
