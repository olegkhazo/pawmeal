<script setup lang="ts">
const props = defineProps<{ leadId: string }>()

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const { track } = useTracking()

const message = computed(() => t('messenger.message', { id: props.leadId }))

const whatsappConfigured = computed(() => config.public.businessWhatsappNumber.replace(/\D/g, '').length > 0)
const whatsappHref = computed(() => buildWhatsappHref(config.public.businessWhatsappNumber, message.value))

const telegramConfigured = computed(() => config.public.businessTelegramUsername.replace(/^@/, '').length > 0)
const telegramHref = computed(() => buildTelegramHref(config.public.businessTelegramUsername))

const copied = ref(false)
async function copyMessage() {
  try {
    await navigator.clipboard.writeText(message.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard API can be unavailable (older browsers, insecure context) —
    // the message text is still visible on screen to copy by hand.
  }
}

function onMessengerClick(channel: 'whatsapp' | 'telegram') {
  track({ name: 'messenger_clicked', channel, locale: locale.value })
}
</script>

<template>
  <div v-if="whatsappConfigured || telegramConfigured" class="flex flex-col items-center gap-3">
    <a
      v-if="whatsappConfigured"
      :href="whatsappHref"
      target="_blank"
      rel="noopener noreferrer"
      class="w-full max-w-xs rounded-full bg-brand-accent px-6 py-3 text-center text-sm font-medium text-white hover:bg-brand-accent-strong"
      @click="onMessengerClick('whatsapp')"
    >
      {{ t('messenger.whatsappButton') }}
    </a>

    <template v-if="telegramConfigured">
      <a
        :href="telegramHref"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full max-w-xs rounded-full border border-brand-accent px-6 py-3 text-center text-sm font-medium text-brand-accent hover:bg-brand-accent hover:text-white"
        @click="onMessengerClick('telegram')"
      >
        {{ t('messenger.telegramButton') }}
      </a>
      <p class="max-w-xs text-xs text-brand-text-muted">{{ t('messenger.telegramNote') }}</p>
      <button
        type="button"
        class="text-sm text-brand-accent underline hover:text-brand-accent-strong"
        @click="copyMessage"
      >
        {{ copied ? t('messenger.copied') : t('messenger.copyMessage') }}
      </button>
    </template>
  </div>
</template>
