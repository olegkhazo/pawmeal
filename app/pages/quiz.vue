<script setup lang="ts">
const { t } = useI18n()
useHead({ title: `${t('quiz.title')} — ${t('meta.defaultTitle')}` })
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-16 text-center">
    <h1 class="text-2xl font-semibold text-brand-text">{{ t('quiz.title') }}</h1>
    <p class="mt-4 text-brand-text-muted">{{ t('quiz.stageNote') }}</p>
  </section>
</template>
