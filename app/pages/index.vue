<script setup lang="ts">
import { recipes, type Species } from '~~/data/recipes'

const { t, tm, locale } = useI18n()
const localePath = useLocalePath()
useHead({ title: t('meta.defaultTitle') })
useSeoMeta({ description: t('meta.defaultDescription') })

const { track } = useTracking()
onMounted(() => track({ name: 'landing_view', locale: locale.value }))

const valueItemCount = (tm('home.value.items') as unknown[]).length
const valueIcons = [
  { icon: 'pouch', tint: '#fdf3de' },
  { icon: 'bowl', tint: '#ffdfd8' },
  { icon: 'truck', tint: '#e0edf5' },
] as const

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

    <section class="bg-brand-accent py-12 text-white">
      <ul class="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3">
        <li v-for="index in valueItemCount" :key="index" class="flex flex-col items-center gap-4 text-center">
          <span class="block h-24 w-24 transition hover:rotate-6">
            <DoodleBadge v-bind="valueIcons[(index - 1) % valueIcons.length]!" />
          </span>
          <span class="max-w-xs text-sm leading-relaxed text-white/90">{{ t(`home.value.items.${index - 1}`) }}</span>
        </li>
      </ul>
    </section>

    <HowItWorks />

    <section id="menu" class="mx-auto max-w-5xl px-4 py-14">
      <h2 class="squiggle text-center text-3xl text-brand-text sm:text-4xl">
        {{ t('home.catalog.title') }}
      </h2>
      <div class="mt-6 flex flex-wrap justify-center gap-2" role="group" :aria-label="t('home.catalog.title')">
        <button
          v-for="f in filters"
          :key="f.value"
          type="button"
          :data-testid="`filter-${f.value}`"
          :aria-pressed="filter === f.value"
          class="rounded-full border-2 px-5 py-2 text-sm font-semibold transition"
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

    <section class="bg-brand-cream py-14">
      <div class="relative mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[2rem] border-2 border-brand-accent bg-brand-surface p-8 text-center shadow-[6px_6px_0_#183f37] sm:p-10">
        <span class="absolute -top-10 left-1/2 block h-20 w-20 -translate-x-1/2 rotate-[-8deg]">
          <DoodleBadge icon="paw" tint="#d2da78" />
        </span>
        <h2 class="mt-6 text-3xl text-brand-text sm:text-4xl">
          {{ t('home.subscription.title') }}
        </h2>
        <p class="text-brand-text-muted">{{ t('home.subscription.body') }}</p>
        <p class="text-brand-text-muted">{{ t('home.subscription.body2') }}</p>
        <NuxtLink
          :to="localePath('/quiz')"
          class="btn-cta mt-2"
        >
          {{ t('home.subscription.button') }}
        </NuxtLink>
      </div>
    </section>

    <PackagingSection />

    <FaqSection />

    <TestimonialsSection />

    <section class="bg-brand-accent px-4 py-16 text-center text-white">
      <div class="mx-auto flex max-w-2xl flex-col items-center">
        <span class="block h-20 w-20 rotate-6">
          <DoodleBadge icon="bowl" tint="#fdf3de" />
        </span>
        <h2 class="mt-4 text-3xl sm:text-4xl">
          {{ t('home.finalCta.title') }}
        </h2>
        <NuxtLink
          :to="localePath('/quiz')"
          class="btn-cta mt-8"
        >
          {{ t('home.finalCta.button') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
