<script setup lang="ts">
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const config = useRuntimeConfig()

const availableLocales = computed(() => locales.value.filter((l) => l.code !== locale.value))
</script>

<template>
  <header class="border-b border-brand-border bg-brand-surface">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <NuxtLink :to="localePath('/')" class="text-lg font-semibold text-brand-text">
        {{ config.public.brandName }}
      </NuxtLink>

      <nav class="hidden items-center gap-6 text-sm text-brand-text sm:flex" aria-label="primary">
        <a href="#how-it-works">{{ t('nav.howItWorks') }}</a>
        <a href="#menu">{{ t('nav.menu') }}</a>
        <a href="#faq">{{ t('nav.faq') }}</a>
      </nav>

      <div class="flex items-center gap-3">
        <nav class="flex items-center gap-2 text-sm" aria-label="language">
          <NuxtLink
            v-for="l in availableLocales"
            :key="l.code"
            :to="switchLocalePath(l.code)"
            class="rounded px-2 py-1 text-brand-text-muted hover:text-brand-text"
          >
            {{ l.name }}
          </NuxtLink>
        </nav>

        <NuxtLink
          :to="localePath('/quiz')"
          class="rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent-strong"
        >
          {{ t('nav.cta') }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
