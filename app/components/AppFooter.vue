<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
</script>

<template>
  <footer class="border-t-4 border-brand-cta bg-brand-accent-strong text-white/75">
    <div class="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm">
      <p class="font-logo text-2xl font-semibold text-white">{{ config.public.brandName }}</p>
      <NuxtLink :to="localePath('/privacy')" class="text-brand-cta underline-offset-4 hover:underline">
        {{ t('footer.privacyLink') }}
      </NuxtLink>
      <p class="text-xs">{{ t('footer.photoCredits') }}</p>
    </div>
  </footer>
</template>
