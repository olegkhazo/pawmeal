<script setup lang="ts">
import { recipes, type Species } from '~~/data/recipes'

const { t, tm, locale } = useI18n()
const localePath = useLocalePath()
useHead({ title: t('meta.defaultTitle') })
useSeoMeta({ description: t('meta.defaultDescription') })

const { track } = useTracking()
onMounted(() => track({ name: 'landing_view', locale: locale.value }))

const valueItemCount = (tm('home.value.items') as unknown[]).length

type Filter = 'all' | Species
const filter = ref<Filter>('all')

const filteredRecipes = computed(() =>
  filter.value === 'all' ? recipes : recipes.filter((r) => r.species === filter.value),
)

const filters: { value: Filter; labelKey: string }[] = [
  { value: 'all', labelKey: 'home.catalog.filterAll' },
  { value: 'dog', labelKey: 'home.catalog.filterDog' },
  { value: 'cat', labelKey: 'home.catalog.filterCat' },
]
</script>

<template>
  <div>
    <HeroSection />

    <section class="mx-auto max-w-5xl px-4 py-10">
      <ul class="grid gap-4 sm:grid-cols-3">
        <li
          v-for="index in valueItemCount"
          :key="index"
          class="rounded-2xl border border-brand-border bg-brand-surface p-5 text-center text-sm text-brand-text"
        >
          {{ t(`home.value.items.${index - 1}`) }}
        </li>
      </ul>
    </section>

    <HowItWorks />

    <section id="menu" class="mx-auto max-w-5xl px-4 py-12">
      <h2 class="text-center text-2xl font-semibold text-brand-text sm:text-3xl">
        {{ t('home.catalog.title') }}
      </h2>
      <div class="mt-6 flex flex-wrap justify-center gap-2" role="group" :aria-label="t('home.catalog.title')">
        <button
          v-for="f in filters"
          :key="f.value"
          type="button"
          :data-testid="`filter-${f.value}`"
          :aria-pressed="filter === f.value"
          class="rounded-full border px-4 py-2 text-sm font-medium"
          :class="
            filter === f.value
              ? 'border-brand-accent bg-brand-accent text-white'
              : 'border-brand-border bg-brand-surface text-brand-text hover:border-brand-accent'
          "
          @click="filter = f.value"
        >
          {{ t(f.labelKey) }}
        </button>
      </div>

      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <RecipeCard v-for="recipe in filteredRecipes" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-12 text-center">
      <h2 class="text-2xl font-semibold text-brand-text sm:text-3xl">
        {{ t('home.subscription.title') }}
      </h2>
      <p class="mt-4 text-brand-text-muted">{{ t('home.subscription.body') }}</p>
      <p class="mt-2 text-sm text-brand-text-muted">{{ t('home.subscription.note') }}</p>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-12 text-center">
      <h2 class="text-2xl font-semibold text-brand-text sm:text-3xl">
        {{ t('home.packaging.title') }}
      </h2>
      <p class="mt-4 text-brand-text-muted">{{ t('home.packaging.body') }}</p>
    </section>

    <FaqSection />

    <TestimonialsSection />

    <section class="mx-auto max-w-2xl px-4 py-16 text-center">
      <h2 class="text-2xl font-semibold text-brand-text sm:text-3xl">
        {{ t('home.finalCta.title') }}
      </h2>
      <NuxtLink
        :to="localePath('/quiz')"
        class="mt-6 inline-block rounded-full bg-brand-accent px-6 py-3 text-sm font-medium text-white hover:bg-brand-accent-strong"
      >
        {{ t('home.finalCta.button') }}
      </NuxtLink>
      <p class="mt-6 text-sm text-brand-text-muted">{{ t('disclaimer') }}</p>
    </section>
  </div>
</template>
