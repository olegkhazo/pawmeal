<script setup lang="ts">
const props = defineProps<{ step: number; totalSteps: number }>()
const { t } = useI18n()

const progressLabel = computed(() => t('quiz.progress', { step: props.step, total: props.totalSteps }))
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-10">
    <div
      class="h-2 w-full overflow-hidden rounded-full bg-brand-border"
      role="progressbar"
      :aria-valuemin="1"
      :aria-valuemax="totalSteps"
      :aria-valuenow="step"
      :aria-valuetext="progressLabel"
    >
      <div
        class="h-full rounded-full bg-brand-accent transition-[width]"
        :style="{ width: `${(step / totalSteps) * 100}%` }"
      />
    </div>
    <p class="mt-2 text-center text-xs text-brand-text-muted">{{ progressLabel }}</p>

    <div class="mt-6">
      <slot />
    </div>
  </div>
</template>
