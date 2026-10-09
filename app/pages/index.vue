<script setup lang="ts">
const { t } = useI18n()
useHead({ title: t('meta.defaultTitle') })
useSeoMeta({ description: t('meta.defaultDescription') })
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 class="text-3xl font-semibold text-brand-text sm:text-4xl">
      {{ t('home.title') }}
    </h1>
    <p class="mt-4 text-brand-text-muted">
      {{ t('disclaimer') }}
    </p>
    <p class="mt-8 text-sm text-brand-text-muted">
      {{ t('home.stageNote') }}
    </p>
  </section>
</template>
