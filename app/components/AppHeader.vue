<script setup lang="ts">
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const config = useRuntimeConfig()

const availableLocales = computed(() => locales.value.filter((l) => l.code !== locale.value))

const homeAnchor = (hash: string) => `${localePath('/')}#${hash}`
</script>

<template>
  <header class="border-b border-brand-border bg-brand-surface">
    <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 gap-x-3 px-4 py-3">
      <NuxtLink :to="localePath('/')" class="font-logo text-xl font-semibold text-brand-text sm:text-2xl">
        {{ config.public.brandName }}
      </NuxtLink>

      <nav class="hidden items-center gap-6 text-sm text-brand-text sm:flex" aria-label="primary">
        <a :href="homeAnchor('how-it-works')" class="hover:text-brand-terracotta">{{ t('nav.howItWorks') }}</a>
        <a :href="homeAnchor('menu')" class="hover:text-brand-terracotta">{{ t('nav.menu') }}</a>
        <a :href="homeAnchor('faq')" class="hover:text-brand-terracotta">{{ t('nav.faq') }}</a>
      </nav>

      <div class="flex flex-wrap items-center gap-2">
        <nav class="flex items-center gap-1 text-sm" aria-label="language">
          <NuxtLink
            v-for="l in availableLocales"
            :key="l.code"
            :to="switchLocalePath(l.code)"
            class="rounded px-1.5 py-1 text-brand-text-muted hover:text-brand-text"
          >
            {{ l.name }}
          </NuxtLink>
        </nav>

        <NuxtLink
          :to="localePath('/quiz')"
          class="rounded-full bg-brand-cta px-4 py-1.5 text-sm font-semibold text-brand-text shadow-[0_2px_0_#183f37] transition hover:-translate-y-0.5 hover:bg-brand-cta-strong"
        >
          {{ t('nav.cta') }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
