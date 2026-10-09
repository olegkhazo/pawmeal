<script setup lang="ts">
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import type { QuizContactAnswers } from '~~/shared/types/quiz'

const contact = defineModel<QuizContactAnswers>({ required: true })

const { t } = useI18n()

const phoneError = computed(() => {
  if (!contact.value.phoneRaw.trim()) return null
  const parsed = parsePhoneNumberFromString(contact.value.phoneRaw, 'GE')
  return parsed?.isValid() ? null : t('quiz.step9.phoneInvalid')
})

const telegramError = computed(() => {
  const v = contact.value.telegramUsername.trim()
  if (!v) return null
  return /^@?[A-Za-z0-9_]{5,32}$/.test(v) ? null : t('quiz.step9.telegramInvalid')
})


</script>

<template>
  <div class="flex flex-col gap-4">
    <label class="flex flex-col gap-1 text-sm text-brand-text">
      {{ t('quiz.step9.ownerName') }}
      <input
        v-model="contact.ownerName"
        type="text"
        maxlength="80"
        class="rounded-lg border border-brand-border px-3 py-2"
      >
    </label>

    <label class="flex flex-col gap-1 text-sm text-brand-text">
      {{ t('quiz.step9.phone') }} *
      <input
        v-model="contact.phoneRaw"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        placeholder="+995 5xx xxx xxx"
        class="rounded-lg border px-3 py-2"
        :class="phoneError ? 'border-red-500' : 'border-brand-border'"
        :aria-invalid="!!phoneError"
      >
      <span v-if="phoneError" class="text-xs text-red-600">{{ phoneError }}</span>
    </label>

    <fieldset class="flex flex-col gap-2">
      <legend class="text-sm text-brand-text">{{ t('quiz.step9.channel') }} *</legend>
      <label v-for="ch in (['whatsapp', 'telegram', 'call'] as const)" :key="ch" class="flex items-center gap-2 text-sm text-brand-text">
        <input v-model="contact.preferredChannel" type="radio" :value="ch" name="preferredChannel" >
        {{ t(`quiz.step9.channels.${ch}`) }}
      </label>
    </fieldset>

    <label v-if="contact.preferredChannel === 'telegram'" class="flex flex-col gap-1 text-sm text-brand-text">
      {{ t('quiz.step9.telegramUsername') }}
      <input
        v-model="contact.telegramUsername"
        type="text"
        placeholder="@username"
        class="rounded-lg border px-3 py-2"
        :class="telegramError ? 'border-red-500' : 'border-brand-border'"
      >
      <span v-if="telegramError" class="text-xs text-red-600">{{ telegramError }}</span>
    </label>

    <label class="flex items-start gap-2 text-sm text-brand-text">
      <input v-model="contact.contactConsent" type="checkbox" class="mt-1" >
      <span>{{ t('quiz.step9.contactConsent') }} *</span>
    </label>

    <label class="flex items-start gap-2 text-sm text-brand-text">
      <input v-model="contact.marketingConsent" type="checkbox" class="mt-1" >
      <span>{{ t('quiz.step9.marketingConsent') }}</span>
    </label>
  </div>
</template>
