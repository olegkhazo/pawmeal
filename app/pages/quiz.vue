<script setup lang="ts">
import { cities } from '~~/data/cities'
import { step1Schema, step2Schema, step3Schema } from '~~/shared/schemas/quiz'
import { QUIZ_STEP_COUNT } from '~~/shared/types/quiz'

definePageMeta({ ssr: false })

const { t, locale } = useI18n()
useHead({ title: `${t('quiz.title')} — ${t('meta.defaultTitle')}` })
useSeoMeta({ robots: 'noindex, nofollow' })

const route = useRoute()
const { step, answers, hydrateFromStorageOrQuery, persist, goNext, goBack } = useQuiz()
const { track } = useTracking()

onMounted(() => {
  const isFreshStart = hydrateFromStorageOrQuery(route.query)
  if (isFreshStart) {
    track({ name: 'quiz_started', species: answers.value.species, locale: locale.value })
  }
})

watch(answers, () => persist(), { deep: true })

watch(step, (newStep, oldStep) => {
  if (newStep > oldStep) {
    track({ name: 'quiz_step_completed', stepId: oldStep, locale: locale.value })
    if (newStep === QUIZ_STEP_COUNT) {
      track({
        name: 'quiz_completed',
        species: answers.value.species,
        cityId: answers.value.cityId,
        planType: answers.value.planType,
        locale: locale.value,
      })
    }
  }
})

// --- step 1 ---
const step1Valid = computed(
  () => step1Schema.safeParse({ species: answers.value.species, petName: answers.value.petName }).success,
)

// --- step 2 ---
const step2Valid = computed(
  () => step2Schema.safeParse({ cityId: answers.value.cityId, otherCity: answers.value.otherCity }).success,
)
const step2Errors = computed(
  () => step2Schema.safeParse({ cityId: answers.value.cityId, otherCity: answers.value.otherCity }).error?.issues ?? [],
)
function fieldError(issues: { path: PropertyKey[]; message: string }[], field: string) {
  const issue = issues.find((i) => i.path[0] === field)
  return issue ? t(issue.message) : null
}

// --- step 3 (also carries the delivery frequency) ---
const step3Result = computed(() =>
  step3Schema.safeParse({
    ageBand: answers.value.ageBand,
    weightKg: answers.value.weightKg,
    breed: answers.value.breed,
    species: answers.value.species,
  }),
)
const step3Valid = computed(() => step3Result.value.success && answers.value.frequencyPreference !== null)
const step3Errors = computed(() => (step3Result.value.success ? [] : step3Result.value.error.issues))

function handleNext() {
  goNext()
}

const currentStepValid = computed(() => {
  switch (step.value) {
    case 1:
      return step1Valid.value
    case 2:
      return step2Valid.value
    case 3:
      return step3Valid.value
    default:
      return false
  }
})
</script>

<template>
  <QuizShell :step="step" :total-steps="QUIZ_STEP_COUNT">
    <QuizStep
      v-if="step === 1"
      :title="t('quiz.step1.title')"
      :show-back="false"
      :can-go-next="currentStepValid"
      @next="handleNext"
    >
      <div class="flex gap-3">
        <button
          v-for="sp in (['dog', 'cat'] as const)"
          :key="sp"
          type="button"
          class="flex-1 rounded-xl border px-4 py-3 text-sm font-medium"
          :class="
            answers.species === sp
              ? 'border-brand-accent bg-brand-accent text-white'
              : 'border-brand-border bg-brand-surface text-brand-text'
          "
          @click="answers.species = sp"
        >
          {{ t(`quiz.step1.species.${sp}`) }}
        </button>
      </div>
      <label class="flex flex-col gap-1 text-sm text-brand-text">
        {{ t('quiz.step1.petName') }}
        <input v-model="answers.petName" type="text" maxlength="50" class="rounded-lg border border-brand-border px-3 py-2" >
      </label>
    </QuizStep>

    <QuizStep
      v-else-if="step === 2"
      :title="t('quiz.step2.title')"
      :can-go-next="currentStepValid"
      @back="goBack"
      @next="handleNext"
    >
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          v-for="city in cities"
          :key="city.id"
          type="button"
          class="rounded-lg border px-3 py-2 text-sm"
          :class="
            answers.cityId === city.id
              ? 'border-brand-accent bg-brand-accent text-white'
              : 'border-brand-border bg-brand-surface text-brand-text'
          "
          @click="answers.cityId = city.id"
        >
          {{ t(city.labelKey) }}
        </button>
      </div>
      <label v-if="answers.cityId === 'other'" class="flex flex-col gap-1 text-sm text-brand-text">
        {{ t('quiz.step2.otherCityLabel') }}
        <input v-model="answers.otherCity" type="text" maxlength="80" class="rounded-lg border border-brand-border px-3 py-2" >
        <span v-if="fieldError(step2Errors, 'otherCity')" class="text-xs text-red-600">{{ fieldError(step2Errors, 'otherCity') }}</span>
      </label>
    </QuizStep>

    <QuizStep
      v-else-if="step === 3"
      :title="t('quiz.step3.title')"
      :can-go-next="currentStepValid"
      @back="goBack"
      @next="handleNext"
    >
      <div class="flex flex-wrap gap-2">
        <button
          v-for="band in (['under1', '1to7', 'over7'] as const)"
          :key="band"
          type="button"
          class="rounded-full border px-4 py-2 text-sm"
          :class="
            answers.ageBand === band
              ? 'border-brand-accent bg-brand-accent text-white'
              : 'border-brand-border bg-brand-surface text-brand-text'
          "
          @click="answers.ageBand = band"
        >
          {{ t(`quiz.step3.ageBand.${band}`) }}
        </button>
      </div>
      <label class="flex flex-col gap-1 text-sm text-brand-text">
        {{ t('quiz.step3.weight') }}
        <input
          v-model="answers.weightKg"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.1"
          class="rounded-lg border px-3 py-2"
          :class="fieldError(step3Errors, 'weightKg') ? 'border-red-500' : 'border-brand-border'"
        >
        <span v-if="fieldError(step3Errors, 'weightKg')" class="text-xs text-red-600">{{ fieldError(step3Errors, 'weightKg') }}</span>
      </label>
      <label class="flex flex-col gap-1 text-sm text-brand-text">
        {{ t('quiz.step3.breed') }}
        <input v-model="answers.breed" type="text" maxlength="80" class="rounded-lg border border-brand-border px-3 py-2" >
      </label>
      <div class="flex gap-2">
        <button type="button" class="rounded-full border border-brand-border px-3 py-1 text-xs text-brand-text" @click="answers.breed = t('quiz.step3.breedMixed')">
          {{ t('quiz.step3.breedMixed') }}
        </button>
        <button type="button" class="rounded-full border border-brand-border px-3 py-1 text-xs text-brand-text" @click="answers.breed = t('quiz.step3.breedUnknown')">
          {{ t('quiz.step3.breedUnknown') }}
        </button>
      </div>

      <fieldset class="flex flex-col gap-2">
        <legend class="text-sm text-brand-text">{{ t('quiz.step3.frequencyLabel') }}</legend>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="freq in (['weekly', 'biweekly', 'monthly', 'unsure'] as const)"
            :key="freq"
            type="button"
            :aria-pressed="answers.frequencyPreference === freq"
            class="rounded-full border px-4 py-2 text-sm"
            :class="
              answers.frequencyPreference === freq
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-brand-border bg-brand-surface text-brand-text'
            "
            @click="answers.frequencyPreference = freq"
          >
            {{ t(`quiz.step3.frequency.${freq}`) }}
          </button>
        </div>
      </fieldset>
    </QuizStep>

    <QuizStep
      v-else-if="step === 4"
      :title="t('quiz.handoff.title')"
      :show-next="false"
      @back="goBack"
    >
      <QuizHandoff :answers="answers" />
    </QuizStep>
  </QuizShell>
</template>
