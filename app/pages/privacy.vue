<script setup lang="ts">
const { t } = useI18n()
useHead({ title: `${t('privacy.title')} — ${t('meta.defaultTitle')}` })

const config = useRuntimeConfig()
const operatorEmail = computed(() => config.public.operatorContactEmail)
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-16">
    <h1 class="text-center text-2xl font-semibold text-brand-text">{{ t('privacy.title') }}</h1>
    <p class="mt-4 text-brand-text-muted">{{ t('privacy.intro') }}</p>

    <div class="mt-8 flex flex-col gap-6">
      <section>
        <h2 class="font-semibold text-brand-text">{{ t('privacy.collectedTitle') }}</h2>
        <p class="mt-1 text-sm text-brand-text-muted">{{ t('privacy.collectedBody') }}</p>
      </section>
      <section>
        <h2 class="font-semibold text-brand-text">{{ t('privacy.purposeTitle') }}</h2>
        <p class="mt-1 text-sm text-brand-text-muted">{{ t('privacy.purposeBody') }}</p>
      </section>
      <section>
        <h2 class="font-semibold text-brand-text">{{ t('privacy.operatorTitle') }}</h2>
        <p class="mt-1 text-sm text-brand-text-muted">{{ t('privacy.operatorBody') }}</p>
      </section>
      <section>
        <h2 class="font-semibold text-brand-text">{{ t('privacy.recipientsTitle') }}</h2>
        <p class="mt-1 text-sm text-brand-text-muted">{{ t('privacy.recipientsBody') }}</p>
      </section>
      <section>
        <h2 class="font-semibold text-brand-text">{{ t('privacy.securityTitle') }}</h2>
        <p class="mt-1 text-sm text-brand-text-muted">{{ t('privacy.securityBody') }}</p>
      </section>
      <section>
        <h2 class="font-semibold text-brand-text">{{ t('privacy.retentionTitle') }}</h2>
        <p class="mt-1 text-sm text-brand-text-muted">
          {{ t('privacy.retentionBody', { days: config.public.dataRetentionDays }) }}
        </p>
      </section>
      <section>
        <h2 class="font-semibold text-brand-text">{{ t('privacy.marketingTitle') }}</h2>
        <p class="mt-1 text-sm text-brand-text-muted">{{ t('privacy.marketingBody') }}</p>
      </section>
      <section>
        <h2 class="font-semibold text-brand-text">{{ t('privacy.contactTitle') }}</h2>
        <p class="mt-1 text-sm text-brand-text-muted">
          <template v-if="operatorEmail">{{ t('privacy.contactBodyConfigured', { email: operatorEmail }) }}</template>
          <template v-else>{{ t('privacy.contactBodyMissing') }}</template>
        </p>
      </section>
    </div>
  </section>
</template>
