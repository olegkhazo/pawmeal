<script setup lang="ts">
import type { Species } from '~~/data/recipes'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { track } = useTracking()

function quizLink(species: Species) {
  return { path: localePath('/quiz'), query: { species } }
}

function onSelect(species: Species) {
  track({ name: 'species_selected', species, locale: locale.value })
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
    <NuxtLink
      :to="quizLink('dog')"
      class="rounded-full bg-brand-accent px-6 py-3 text-center text-sm font-medium text-white hover:bg-brand-accent-strong"
      @click="onSelect('dog')"
    >
      {{ t('home.hero.speciesDog') }}
    </NuxtLink>
    <NuxtLink
      :to="quizLink('cat')"
      class="rounded-full border border-brand-accent px-6 py-3 text-center text-sm font-medium text-brand-accent hover:bg-brand-accent hover:text-white"
      @click="onSelect('cat')"
    >
      {{ t('home.hero.speciesCat') }}
    </NuxtLink>
  </div>
</template>
