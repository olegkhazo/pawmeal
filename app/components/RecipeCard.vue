<script setup lang="ts">
import type { Recipe } from '~~/data/recipes'

const props = defineProps<{ recipe: Recipe }>()

const { t } = useI18n()
const localePath = useLocalePath()

const quizLink = computed(() => ({
  path: localePath('/quiz'),
  query: { species: props.recipe.species, recipeId: props.recipe.id },
}))

// Each protein gets its own pastel ground so the cards read as a colourful family.
const proteinTint: Record<string, string> = {
  chicken: 'bg-brand-cream',
  turkey: 'bg-brand-blush',
  beef: 'bg-[#f6d9cc]',
  fish: 'bg-brand-sky',
}
const tint = computed(() => proteinTint[props.recipe.conceptProtein] ?? 'bg-brand-cream')
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-[1.75rem] border-2 border-brand-border bg-brand-surface transition hover:-translate-y-1 hover:border-brand-accent hover:shadow-[6px_6px_0_#183f37]"
  >
    <div class="p-3 pb-0" :class="tint">
      <img
        :src="recipe.image"
        :alt="t(recipe.imageAltKey)"
        loading="lazy"
        width="600"
        height="600"
        class="aspect-square w-full rounded-t-[1.25rem] object-cover"
      >
    </div>
    <div class="flex flex-1 flex-col gap-2 p-5">
      <h3 class="text-xl text-brand-text">{{ t(`recipes.${recipe.translationKey}.title`) }}</h3>
      <p class="text-sm text-brand-text-muted">{{ t(`recipes.${recipe.translationKey}.description`) }}</p>
      <p class="text-sm text-brand-text">{{ t(`recipes.${recipe.translationKey}.benefit`) }}</p>
      <NuxtLink :to="quizLink" class="btn-cta mt-auto px-5 py-2.5 text-sm">
        {{ t('home.catalog.productCta') }}
      </NuxtLink>
    </div>
  </article>
</template>
