<script setup lang="ts">
import type { Species } from '~~/data/recipes'

const { t } = useI18n()
const localePath = useLocalePath()

function quizLink(species: Species) {
  return { path: localePath('/quiz'), query: { species } }
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
    <NuxtLink
      :to="quizLink('dog')"
      class="rounded-full bg-brand-accent px-6 py-3 text-center text-sm font-medium text-white hover:bg-brand-accent-strong"
    >
      {{ t('home.hero.speciesDog') }}
    </NuxtLink>
    <NuxtLink
      :to="quizLink('cat')"
      class="rounded-full border border-brand-accent px-6 py-3 text-center text-sm font-medium text-brand-accent hover:bg-brand-accent hover:text-white"
    >
      {{ t('home.hero.speciesCat') }}
    </NuxtLink>
  </div>
</template>
