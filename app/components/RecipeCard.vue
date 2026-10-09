<script setup lang="ts">
import type { Recipe } from '~~/data/recipes'

const props = defineProps<{ recipe: Recipe }>()

const { t } = useI18n()
const localePath = useLocalePath()

const quizLink = computed(() => ({
  path: localePath('/quiz'),
  query: { species: props.recipe.species, recipeId: props.recipe.id },
}))
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface">
    <img
      :src="recipe.image"
      :alt="t(recipe.imageAltKey)"
      loading="lazy"
      width="600"
      height="600"
      class="aspect-square w-full object-cover"
    >
    <div class="flex flex-1 flex-col gap-2 p-4">
      <h3 class="font-semibold text-brand-text">{{ t(`recipes.${recipe.translationKey}.title`) }}</h3>
      <p class="text-sm text-brand-text-muted">{{ t(`recipes.${recipe.translationKey}.description`) }}</p>
      <p class="text-xs italic text-brand-text-muted">{{ t('home.catalog.conceptNote') }}</p>
      <p class="text-xs text-brand-text-muted">{{ t('home.catalog.galleryNote') }}</p>
      <NuxtLink
        :to="quizLink"
        class="mt-auto inline-block rounded-full bg-brand-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-accent-strong"
      >
        {{ t('home.catalog.productCta') }}
      </NuxtLink>
    </div>
  </article>
</template>
