<script setup lang="ts">
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { cities } from '~~/data/cities'
import type { QuizDraftAnswers } from '~~/shared/types/quiz'

// Lead capture without a database. The visitor either opens a Telegram or
// WhatsApp chat with the operator with a summary of their answers already in
// the message input, or leaves a name + phone, which opens their own mail
// client with the summary addressed to the operator. Nothing is sent from the
// site itself — every channel still needs the visitor to press Send.
const props = defineProps<{ answers: QuizDraftAnswers }>()

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const { track } = useTracking()

const summaryLines = computed(() => {
  const a = props.answers
  const s = (key: string) => t(`quiz.handoff.summary.${key}`)
  const city =
    a.cityId === 'other' ? a.otherCity : t(cities.find((c) => c.id === a.cityId)?.labelKey ?? '')

  const lines: [string, string][] = [
    [s('pet'), [a.species ? t(`quiz.step1.species.${a.species}`) : '', a.petName].filter(Boolean).join(', ')],
    [s('city'), city],
    [s('age'), a.ageBand ? t(`quiz.step3.ageBand.${a.ageBand}`) : ''],
    [s('weight'), a.weightKg ? `${a.weightKg} ${s('kg')}` : ''],
    [s('breed'), a.breed],
    [s('frequency'), a.frequencyPreference ? t(`quiz.step3.frequency.${a.frequencyPreference}`) : ''],
  ]
  return lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)
})

const chatMessage = computed(() => [t('quiz.handoff.greeting'), ...summaryLines.value].join('\n'))

const telegramConfigured = computed(() => config.public.businessTelegramUsername.replace(/^@/, '').length > 0)
const telegramHref = computed(() => buildTelegramHref(config.public.businessTelegramUsername, chatMessage.value))
const whatsappConfigured = computed(() => config.public.businessWhatsappNumber.replace(/\D/g, '').length > 0)
const whatsappHref = computed(() => buildWhatsappHref(config.public.businessWhatsappNumber, chatMessage.value))

const copied = ref(false)
async function copyMessage() {
  try {
    await navigator.clipboard.writeText(chatMessage.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 3000)
  } catch {
    // Clipboard API can be unavailable (older browsers, insecure context).
  }
}

function onChatClick(channel: 'whatsapp' | 'telegram') {
  // Fallback for clients that don't apply the prefilled text.
  void copyMessage()
  track({ name: 'messenger_clicked', channel, locale: locale.value })
}

// --- name + phone → visitor's mail client ---
const operatorEmail = computed(() => config.public.operatorContactEmail)
const ownerName = ref('')
const phone = ref('')
const triedSubmit = ref(false)
const mailOpened = ref(false)

const nameValid = computed(() => ownerName.value.trim().length > 0)
const phoneValid = computed(() => parsePhoneNumberFromString(phone.value, 'GE')?.isValid() ?? false)

function submitByEmail() {
  triedSubmit.value = true
  if (!nameValid.value || !phoneValid.value || !operatorEmail.value) return

  const petName = props.answers.petName.trim()
  const subject = petName
    ? t('quiz.handoff.emailSubjectWithName', { name: petName })
    : t('quiz.handoff.emailSubject')
  const body = [
    ...summaryLines.value,
    '',
    `${t('quiz.handoff.summary.name')}: ${ownerName.value.trim()}`,
    `${t('quiz.handoff.summary.phone')}: ${phone.value.trim()}`,
  ].join('\n')

  track({ name: 'messenger_clicked', channel: 'email', locale: locale.value })
  mailOpened.value = true
  window.location.href = `mailto:${operatorEmail.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-brand-text">{{ t('quiz.handoff.body') }}</p>

    <a
      v-if="telegramConfigured"
      :href="telegramHref"
      target="_blank"
      rel="noopener noreferrer"
      class="btn-cta"
      @click="onChatClick('telegram')"
    >
      {{ t('quiz.handoff.telegramButton') }}
    </a>
    <a
      v-if="whatsappConfigured"
      :href="whatsappHref"
      target="_blank"
      rel="noopener noreferrer"
      class="rounded-full bg-brand-accent px-7 py-3.5 text-center text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-accent-strong"
      @click="onChatClick('whatsapp')"
    >
      {{ t('quiz.handoff.whatsappButton') }}
    </a>
    <button
      type="button"
      class="text-sm text-brand-accent underline hover:text-brand-accent-strong"
      @click="copyMessage"
    >
      {{ copied ? t('quiz.handoff.copied') : t('quiz.handoff.copy') }}
    </button>
    <p class="text-xs text-brand-text-muted">{{ t('quiz.handoff.note') }}</p>

    <form
      v-if="operatorEmail"
      class="mt-4 flex flex-col gap-3 border-t-2 border-dashed border-brand-border pt-6"
      novalidate
      @submit.prevent="submitByEmail"
    >
      <h3 class="text-lg text-brand-text">{{ t('quiz.handoff.orLeaveContacts') }}</h3>
      <label class="flex flex-col gap-1 text-sm text-brand-text">
        {{ t('quiz.handoff.name') }}
        <input
          v-model="ownerName"
          type="text"
          autocomplete="name"
          maxlength="80"
          class="rounded-lg border px-3 py-2"
          :class="triedSubmit && !nameValid ? 'border-red-500' : 'border-brand-border'"
        >
        <span v-if="triedSubmit && !nameValid" class="text-xs text-red-600">{{ t('validation.required') }}</span>
      </label>
      <label class="flex flex-col gap-1 text-sm text-brand-text">
        {{ t('quiz.handoff.phone') }}
        <input
          v-model="phone"
          type="tel"
          autocomplete="tel"
          inputmode="tel"
          placeholder="+995 5XX XX XX XX"
          class="rounded-lg border px-3 py-2"
          :class="triedSubmit && !phoneValid ? 'border-red-500' : 'border-brand-border'"
        >
        <span v-if="triedSubmit && !phoneValid" class="text-xs text-red-600">{{ t('quiz.handoff.phoneInvalid') }}</span>
      </label>
      <button
        type="submit"
        class="rounded-full border-2 border-brand-accent px-6 py-3 text-sm font-semibold text-brand-accent transition hover:bg-brand-accent hover:text-white"
      >
        {{ t('quiz.handoff.submit') }}
      </button>
      <p class="text-xs text-brand-text-muted">
        {{ mailOpened ? t('quiz.handoff.mailFallback', { email: operatorEmail }) : t('quiz.handoff.mailNote') }}
      </p>
    </form>
  </div>
</template>
