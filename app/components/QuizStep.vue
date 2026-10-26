<script setup lang="ts">
// Vue defaults an absent Boolean-typed prop to `false` (not `undefined`), so these
// need explicit defaults — without them, every step but the one that sets
// showBack={false} would still resolve showBack to false and hide its back button.
withDefaults(
  defineProps<{
    title: string
    showBack?: boolean
    nextLabel?: string
    canGoNext?: boolean
    showNext?: boolean
  }>(),
  { showBack: true, canGoNext: true, nextLabel: '', showNext: true },
)

const emit = defineEmits<{ back: []; next: [] }>()
const { t } = useI18n()
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold text-brand-text">{{ title }}</h2>
    <div class="mt-4 flex flex-col gap-4">
      <slot />
    </div>

    <div class="mt-8 flex items-center justify-between gap-3">
      <button
        v-if="showBack"
        type="button"
        class="rounded-full border border-brand-border px-5 py-2 text-sm font-medium text-brand-text hover:border-brand-accent"
        @click="emit('back')"
      >
        {{ t('quiz.back') }}
      </button>
      <span v-else />

      <button
        v-if="showNext"
        type="button"
        :disabled="!canGoNext"
        class="btn-cta px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        @click="emit('next')"
      >
        {{ nextLabel || t('quiz.next') }}
      </button>
    </div>
  </section>
</template>
