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
  <div class="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
    <NuxtLink
      :to="quizLink('dog')"
      class="btn-cta"
      @click="onSelect('dog')"
    >
      {{ t('home.hero.speciesDog') }}
    </NuxtLink>
    <NuxtLink
      :to="quizLink('cat')"
      class="rounded-full border-2 border-brand-accent bg-brand-surface px-7 py-3.5 text-center text-base font-semibold text-brand-accent transition hover:-translate-y-0.5 hover:bg-brand-accent hover:text-white"
      @click="onSelect('cat')"
    >
      {{ t('home.hero.speciesCat') }}
    </NuxtLink>
  </div>
</template>
