<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-bg text-brand-text">
    <AppHeader />
    <main class="flex flex-1 items-center justify-center px-4 py-16 text-center">
      <div>
        <h1 class="text-2xl font-semibold">{{ t('notFound.title') }}</h1>
        <p class="mt-4 text-brand-text-muted">{{ t('notFound.message') }}</p>
        <NuxtLink
          :to="localePath('/')"
          class="mt-6 inline-block rounded-full bg-brand-accent px-5 py-2 text-sm font-medium text-white hover:bg-brand-accent-strong"
        >
          {{ t('notFound.backHome') }}
        </NuxtLink>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
