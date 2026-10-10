<script setup lang="ts">
const { t, tm } = useI18n()
const itemCount = (tm('home.testimonials.items') as unknown[]).length

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase()
}
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-12">
    <h2 class="text-center text-2xl font-semibold text-brand-text sm:text-3xl">
      {{ t('home.testimonials.title') }}
    </h2>
    <p class="mx-auto mt-2 max-w-xl text-center text-xs italic text-brand-text-muted">
      {{ t('home.testimonials.draftNote') }}
    </p>

    <div class="mt-8 grid gap-6 sm:grid-cols-3">
      <figure
        v-for="index in itemCount"
        :key="index"
        class="flex flex-col gap-4 rounded-2xl border border-brand-border bg-brand-surface p-6"
      >
        <blockquote class="text-sm text-brand-text">
          {{ t(`home.testimonials.items.${index - 1}.quote`) }}
        </blockquote>
        <figcaption class="mt-auto flex items-center gap-3">
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-accent text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {{ initials(t(`home.testimonials.items.${index - 1}.name`)) }}
          </span>
          <span class="text-sm text-brand-text-muted">
            <span class="font-medium text-brand-text">{{ t(`home.testimonials.items.${index - 1}.name`) }}</span>,
            {{ t(`home.testimonials.items.${index - 1}.city`) }}
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
