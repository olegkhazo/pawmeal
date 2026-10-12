<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <footer class="border-t border-brand-border bg-brand-surface">
    <div class="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-brand-text-muted">
      <NuxtLink :to="localePath('/privacy')" class="text-brand-accent hover:text-brand-accent-strong">
        {{ t('footer.privacyLink') }}
      </NuxtLink>
      <p class="text-xs">{{ t('footer.photoCredits') }}</p>
    </div>
  </footer>
</template>
