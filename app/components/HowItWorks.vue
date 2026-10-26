<script setup lang="ts">
import type { DoodleIcon } from './DoodleBadge.vue'

const { t, tm } = useI18n()
const stepCount = (tm('home.howItWorks.steps') as unknown[]).length

const stepIcons: { icon: DoodleIcon; tint: string }[] = [
  { icon: 'clipboard', tint: '#fdf3de' },
  { icon: 'bowl', tint: '#ffdfd8' },
  { icon: 'chat', tint: '#e0edf5' },
  { icon: 'truck', tint: '#eef0c6' },
]
</script>

<template>
  <section id="how-it-works" class="bg-brand-surface py-14">
    <div class="mx-auto max-w-5xl px-4">
      <h2 class="squiggle text-center text-3xl text-brand-text sm:text-4xl">
        {{ t('home.howItWorks.title') }}
      </h2>
      <div class="relative mt-10">
        <!-- Dashed path linking the steps on wide screens -->
        <div aria-hidden="true" class="pointer-events-none absolute left-[12%] right-[12%] top-12 hidden border-t-[3px] border-dashed border-brand-sand lg:block" />
        <ol class="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <li v-for="index in stepCount" :key="index" class="relative flex flex-col items-center text-center">
            <span class="relative block h-24 w-24">
              <DoodleBadge v-bind="stepIcons[(index - 1) % stepIcons.length]!" />
              <span
                class="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-accent bg-brand-cta font-heading text-sm font-bold text-brand-text"
                aria-hidden="true"
              >
                {{ index }}
              </span>
            </span>
            <h3 class="mt-4 text-lg text-brand-text">{{ t(`home.howItWorks.steps.${index - 1}.title`) }}</h3>
            <p class="mt-2 max-w-xs text-sm text-brand-text-muted">{{ t(`home.howItWorks.steps.${index - 1}.description`) }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
