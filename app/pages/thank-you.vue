<script setup lang="ts">
const { t } = useI18n()
useHead({ title: `${t('thankYou.title')} — ${t('meta.defaultTitle')}` })

const route = useRoute()
const leadId = computed(() => {
  const v = route.query.leadId
  return typeof v === 'string' && v ? v : null
})
const channel = computed(() => {
  const v = route.query.channel
  return v === 'whatsapp' || v === 'telegram' || v === 'call' ? v : null
})
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-16 text-center">
    <template v-if="leadId">
      <h1 class="text-2xl font-semibold text-brand-text">{{ t('thankYou.title') }}</h1>
      <p class="mt-4 text-brand-text-muted">{{ t('thankYou.saved') }}</p>
      <p class="mt-2 text-sm text-brand-text-muted">{{ t('thankYou.reference', { id: leadId }) }}</p>

      <div class="mt-8">
        <MessengerButtons :lead-id="leadId" />
      </div>

      <p v-if="channel === 'call'" class="mt-6 text-sm text-brand-text-muted">{{ t('messenger.callNote') }}</p>

      <p class="mt-8 text-xs text-brand-text-muted">{{ t('thankYou.validWithoutClick') }}</p>
    </template>
    <template v-else>
      <h1 class="text-2xl font-semibold text-brand-text">{{ t('notFound.title') }}</h1>
      <p class="mt-4 text-brand-text-muted">{{ t('thankYou.noReference') }}</p>
    </template>
  </section>
</template>
