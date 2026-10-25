<script setup lang="ts">
import { cities } from '~~/data/cities'
import { recipes } from '~~/data/recipes'
import type { QuizDraftAnswers } from '~~/shared/types/quiz'

// Lead capture without a database: instead of the contact form, the visitor
// copies a summary of their answers and pastes it into a Telegram chat with
// the operator. t.me links can't prefill a message to a specific user, so the
// summary goes through the clipboard (and stays visible to copy by hand).
const props = defineProps<{ answers: QuizDraftAnswers; recommendedRecipeIds: string[] }>()

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const { track } = useTracking()

const telegramHref = computed(() => buildTelegramHref(config.public.businessTelegramUsername))

const summary = computed(() => {
  const a = props.answers
  const s = (key: string) => t(`quiz.telegram.summary.${key}`)
  const recipeTitles = (ids: string[]) =>
    ids
      .map((id) => recipes.find((r) => r.id === id))
      .filter((r) => r !== undefined)
      .map((r) => t(`recipes.${r.translationKey}.title`))
      .join(', ')

  const city =
    a.cityId === 'other' ? a.otherCity : t(cities.find((c) => c.id === a.cityId)?.labelKey ?? '')
  const reactions = a.excludedProteins
    .map((p) => (p === 'other' && a.otherReaction ? a.otherReaction : t(`quiz.step5.excluded.${p}`)))
    .join(', ')
  const budget = a.monthlyBudgetUnknown || a.monthlyBudgetGel === '' ? t('quiz.step7.budgetUnknown') : `${a.monthlyBudgetGel} GEL`

  const lines: [string, string][] = [
    [s('pet'), [a.species ? t(`quiz.step1.species.${a.species}`) : '', a.petName].filter(Boolean).join(', ')],
    [s('city'), city],
    [s('age'), a.ageBand ? t(`quiz.step3.ageBand.${a.ageBand}`) : ''],
    [s('weight'), a.weightKg ? `${a.weightKg} ${s('kg')}` : ''],
    [s('breed'), a.breed],
    [s('activity'), a.activity ? t(`quiz.step4.activity.${a.activity}`) : ''],
    [s('currentFood'), a.currentFood ? t(`quiz.step4.currentFood.${a.currentFood}`) : ''],
    [s('reactions'), reactions],
    [s('specialDiet'), a.specialDiet ? t(`quiz.step5.specialDiet.${a.specialDiet}`) : ''],
    [s('preferred'), recipeTitles(a.preferredRecipeIds)],
    [s('recommended'), recipeTitles(props.recommendedRecipeIds)],
    [s('plan'), a.planType ? t(`quiz.step6.planType.${a.planType}`) : ''],
    [s('frequency'), a.frequencyPreference ? t(`quiz.step6.frequency.${a.frequencyPreference}`) : ''],
    [s('budget'), budget],
    [s('subscription'), a.subscriptionInterest ? t(`quiz.step7.subscription.${a.subscriptionInterest}`) : ''],
  ]

  return [t('quiz.telegram.greeting'), ...lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join('\n')
})

const copied = ref(false)
async function copySummary() {
  try {
    await navigator.clipboard.writeText(summary.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 3000)
  } catch {
    // Clipboard API can be unavailable (older browsers, insecure context) —
    // the summary is still on screen to copy by hand.
  }
}

function onTelegramClick() {
  // Copy first, inside the same click, so the text is ready to paste when Telegram opens.
  void copySummary()
  track({ name: 'messenger_clicked', channel: 'telegram', locale: locale.value })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-brand-text">{{ t('quiz.telegram.body') }}</p>

    <pre
      class="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-brand-border bg-brand-surface p-4 font-sans text-sm text-brand-text"
    >{{ summary }}</pre>

    <a
      :href="telegramHref"
      target="_blank"
      rel="noopener noreferrer"
      class="rounded-full bg-brand-accent px-6 py-3 text-center text-sm font-medium text-white hover:bg-brand-accent-strong"
      @click="onTelegramClick"
    >
      {{ t('quiz.telegram.button') }}
    </a>
    <button
      type="button"
      class="text-sm text-brand-accent underline hover:text-brand-accent-strong"
      @click="copySummary"
    >
      {{ copied ? t('quiz.telegram.copied') : t('quiz.telegram.copy') }}
    </button>
    <p class="text-xs text-brand-text-muted">{{ t('quiz.telegram.note') }}</p>
  </div>
</template>
