<script setup lang="ts">
import { cities } from '~~/data/cities'
import { recipes } from '~~/data/recipes'
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
} from '~~/shared/schemas/quiz'
import { QUIZ_STEP_COUNT, type ExcludedProtein } from '~~/shared/types/quiz'
import { getRecommendation } from '~~/shared/utils/recommend'
import { isContactValid } from '~/utils/contactValidation'

definePageMeta({ ssr: false })

const { t, locale } = useI18n()
useHead({ title: `${t('quiz.title')} — ${t('meta.defaultTitle')}` })
useSeoMeta({ robots: 'noindex, nofollow' })

const route = useRoute()
const localePath = useLocalePath()
const { step, answers, contact, clientRequestId, hydrateFromStorageOrQuery, persist, goNext, goBack, clearDraft } =
  useQuiz()
const { submitting, submit } = useLeadSubmission()
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
    if (newStep === 8) {
      track({
        name: 'recommendation_viewed',
        species: answers.value.species,
        needsConsultation: recommendation.value.needsConsultation,
        locale: locale.value,
      })
    }
    if (newStep === 9) {
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

const ownRecipes = computed(() => recipes.filter((r) => r.species === answers.value.species))

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

// --- step 3 ---
const step3Result = computed(() =>
  step3Schema.safeParse({
    ageBand: answers.value.ageBand,
    weightKg: answers.value.weightKg,
    breed: answers.value.breed,
    species: answers.value.species,
  }),
)
const step3Valid = computed(() => step3Result.value.success)
const step3Errors = computed(() => (step3Result.value.success ? [] : step3Result.value.error.issues))

// --- step 4 ---
const step4Valid = computed(
  () => step4Schema.safeParse({ activity: answers.value.activity, currentFood: answers.value.currentFood }).success,
)

// --- step 5 ---
const EXCLUDED_OPTIONS: ExcludedProtein[] = ['chicken', 'turkey', 'beef', 'fish', 'other', 'none', 'unknown']
function toggleExcluded(option: ExcludedProtein) {
  const current = answers.value.excludedProteins
  const isActive = current.includes(option)
  if (isActive) {
    answers.value.excludedProteins = current.filter((p) => p !== option)
    return
  }
  if (option === 'none' || option === 'unknown') {
    answers.value.excludedProteins = [option]
  } else {
    answers.value.excludedProteins = [...current.filter((p) => p !== 'none' && p !== 'unknown'), option]
  }
}
const step5Result = computed(() =>
  step5Schema.safeParse({
    excludedProteins: answers.value.excludedProteins,
    otherReaction: answers.value.otherReaction,
    specialDiet: answers.value.specialDiet,
  }),
)
const step5Valid = computed(() => step5Result.value.success)
const step5Errors = computed(() => (step5Result.value.success ? [] : step5Result.value.error.issues))

// --- step 6 ---
function toggleRecipe(id: string) {
  const current = answers.value.preferredRecipeIds
  answers.value.preferredRecipeIds = current.includes(id) ? current.filter((r) => r !== id) : [...current, id]
}
const step6Valid = computed(
  () =>
    step6Schema.safeParse({
      preferredRecipeIds: answers.value.preferredRecipeIds,
      planType: answers.value.planType,
      frequencyPreference: answers.value.frequencyPreference,
    }).success,
)

// --- step 7 ---
const step7Result = computed(() =>
  step7Schema.safeParse({
    monthlyBudgetGel: answers.value.monthlyBudgetGel,
    monthlyBudgetUnknown: answers.value.monthlyBudgetUnknown,
    subscriptionInterest: answers.value.subscriptionInterest,
  }),
)
const step7Valid = computed(() => step7Result.value.success)
const step7Errors = computed(() => (step7Result.value.success ? [] : step7Result.value.error.issues))

// --- step 8 (always completable) ---
const recommendation = computed(() => {
  if (!answers.value.species) return { recommendedRecipeIds: [], needsConsultation: false }
  return getRecommendation({
    species: answers.value.species,
    excludedProteins: answers.value.excludedProteins,
    specialDiet: answers.value.specialDiet,
    preferredRecipeIds: answers.value.preferredRecipeIds,
  })
})
const recommendedRecipes = computed(() =>
  recommendation.value.recommendedRecipeIds.map((id) => recipes.find((r) => r.id === id)).filter(Boolean),
)
const cityLabel = computed(() => {
  if (answers.value.cityId === 'other') return answers.value.otherCity
  const city = cities.find((c) => c.id === answers.value.cityId)
  return city ? t(city.labelKey) : ''
})

// --- step 9 ---
const step9Valid = computed(() => isContactValid(contact.value))
const submitErrorCode = ref<string | null>(null)

async function handleNext() {
  if (step.value === QUIZ_STEP_COUNT) {
    // Synchronous re-entrancy guard: a double-click fires two click events in
    // the same tick, before Vue's reactive `disabled` binding can repaint.
    if (submitting.value) return
    submitErrorCode.value = null
    const result = await submit(answers.value, contact.value, clientRequestId.value, {
      locale: locale.value,
      landingPath: route.path,
      utmSource: route.query.utm_source,
      utmMedium: route.query.utm_medium,
      utmCampaign: route.query.utm_campaign,
      utmContent: route.query.utm_content,
      utmTerm: route.query.utm_term,
      experimentVariant: route.query.experimentVariant,
    })
    if (result.success && result.leadId) {
      track({
        name: 'lead_submit_success',
        cityId: answers.value.cityId,
        planType: answers.value.planType,
        locale: locale.value,
      })
      const preferredChannel = contact.value.preferredChannel
      clearDraft()
      await navigateTo({
        path: localePath('/thank-you'),
        query: { leadId: result.leadId, channel: preferredChannel ?? undefined },
      })
    } else {
      const errorCode = result.errorCode ?? 'network_error'
      track({ name: 'lead_submit_error', errorCode, locale: locale.value })
      submitErrorCode.value = errorCode
    }
    return
  }
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
    case 4:
      return step4Valid.value
    case 5:
      return step5Valid.value
    case 6:
      return step6Valid.value
    case 7:
      return step7Valid.value
    case 8:
      return true
    case 9:
      return step9Valid.value
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
    </QuizStep>

    <QuizStep
      v-else-if="step === 4"
      :title="t('quiz.step4.title')"
      :can-go-next="currentStepValid"
      @back="goBack"
      @next="handleNext"
    >
      <div class="flex flex-wrap gap-2">
        <button
          v-for="level in (['low', 'medium', 'high'] as const)"
          :key="level"
          type="button"
          class="rounded-full border px-4 py-2 text-sm"
          :class="
            answers.activity === level
              ? 'border-brand-accent bg-brand-accent text-white'
              : 'border-brand-border bg-brand-surface text-brand-text'
          "
          @click="answers.activity = level"
        >
          {{ t(`quiz.step4.activity.${level}`) }}
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="food in (['dry', 'wet', 'homeCooked', 'mixed', 'other'] as const)"
          :key="food"
          type="button"
          class="rounded-full border px-4 py-2 text-sm"
          :class="
            answers.currentFood === food
              ? 'border-brand-accent bg-brand-accent text-white'
              : 'border-brand-border bg-brand-surface text-brand-text'
          "
          @click="answers.currentFood = food"
        >
          {{ t(`quiz.step4.currentFood.${food}`) }}
        </button>
      </div>
    </QuizStep>

    <QuizStep
      v-else-if="step === 5"
      :title="t('quiz.step5.title')"
      :can-go-next="currentStepValid"
      @back="goBack"
      @next="handleNext"
    >
      <fieldset class="flex flex-col gap-2">
        <legend class="text-sm text-brand-text">{{ t('quiz.step5.excludedLabel') }}</legend>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in EXCLUDED_OPTIONS"
            :key="opt"
            type="button"
            :aria-pressed="answers.excludedProteins.includes(opt)"
            class="rounded-full border px-4 py-2 text-sm"
            :class="
              answers.excludedProteins.includes(opt)
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-brand-border bg-brand-surface text-brand-text'
            "
            @click="toggleExcluded(opt)"
          >
            {{ t(`quiz.step5.excluded.${opt}`) }}
          </button>
        </div>
        <span v-if="fieldError(step5Errors, 'excludedProteins')" class="text-xs text-red-600">{{ fieldError(step5Errors, 'excludedProteins') }}</span>
      </fieldset>

      <label v-if="answers.excludedProteins.includes('other')" class="flex flex-col gap-1 text-sm text-brand-text">
        {{ t('quiz.step5.otherReaction') }}
        <textarea v-model="answers.otherReaction" maxlength="300" rows="3" class="rounded-lg border border-brand-border px-3 py-2"/>
        <span v-if="fieldError(step5Errors, 'otherReaction')" class="text-xs text-red-600">{{ fieldError(step5Errors, 'otherReaction') }}</span>
      </label>

      <fieldset class="flex flex-col gap-2">
        <legend class="text-sm text-brand-text">{{ t('quiz.step5.specialDietQuestion') }}</legend>
        <div class="flex gap-2">
          <button
            v-for="opt in (['yes', 'no', 'unknown'] as const)"
            :key="opt"
            type="button"
            class="rounded-full border px-4 py-2 text-sm"
            :class="
              answers.specialDiet === opt
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-brand-border bg-brand-surface text-brand-text'
            "
            @click="answers.specialDiet = opt"
          >
            {{ t(`quiz.step5.specialDiet.${opt}`) }}
          </button>
        </div>
      </fieldset>
    </QuizStep>

    <QuizStep
      v-else-if="step === 6"
      :title="t('quiz.step6.title')"
      :can-go-next="currentStepValid"
      @back="goBack"
      @next="handleNext"
    >
      <fieldset class="flex flex-col gap-2">
        <legend class="text-sm text-brand-text">{{ t('quiz.step6.recipesLabel') }}</legend>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="recipe in ownRecipes"
            :key="recipe.id"
            type="button"
            :aria-pressed="answers.preferredRecipeIds.includes(recipe.id)"
            class="rounded-full border px-3 py-1.5 text-sm"
            :class="
              answers.preferredRecipeIds.includes(recipe.id)
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-brand-border bg-brand-surface text-brand-text'
            "
            @click="toggleRecipe(recipe.id)"
          >
            {{ t(`recipes.${recipe.translationKey}.title`) }}
          </button>
        </div>
      </fieldset>

      <fieldset class="flex flex-col gap-2">
        <legend class="text-sm text-brand-text">{{ t('quiz.step6.planTypeLabel') }}</legend>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="plan in (['full', 'supplement', 'help'] as const)"
            :key="plan"
            type="button"
            class="rounded-full border px-4 py-2 text-sm"
            :class="
              answers.planType === plan
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-brand-border bg-brand-surface text-brand-text'
            "
            @click="answers.planType = plan"
          >
            {{ t(`quiz.step6.planType.${plan}`) }}
          </button>
        </div>
      </fieldset>

      <fieldset class="flex flex-col gap-2">
        <legend class="text-sm text-brand-text">{{ t('quiz.step6.frequencyLabel') }}</legend>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="freq in (['weekly', 'biweekly', 'monthly', 'unsure'] as const)"
            :key="freq"
            type="button"
            class="rounded-full border px-4 py-2 text-sm"
            :class="
              answers.frequencyPreference === freq
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-brand-border bg-brand-surface text-brand-text'
            "
            @click="answers.frequencyPreference = freq"
          >
            {{ t(`quiz.step6.frequency.${freq}`) }}
          </button>
        </div>
      </fieldset>
    </QuizStep>

    <QuizStep
      v-else-if="step === 7"
      :title="t('quiz.step7.title')"
      :can-go-next="currentStepValid"
      @back="goBack"
      @next="handleNext"
    >
      <label class="flex flex-col gap-1 text-sm text-brand-text">
        {{ t('quiz.step7.budgetLabel') }}
        <input
          v-model="answers.monthlyBudgetGel"
          type="number"
          inputmode="decimal"
          min="0"
          :disabled="answers.monthlyBudgetUnknown"
          class="rounded-lg border border-brand-border px-3 py-2 disabled:opacity-50"
        >
        <span v-if="fieldError(step7Errors, 'monthlyBudgetGel')" class="text-xs text-red-600">{{ fieldError(step7Errors, 'monthlyBudgetGel') }}</span>
      </label>
      <label class="flex items-center gap-2 text-sm text-brand-text">
        <input v-model="answers.monthlyBudgetUnknown" type="checkbox" >
        {{ t('quiz.step7.budgetUnknown') }}
      </label>

      <fieldset class="flex flex-col gap-2">
        <legend class="text-sm text-brand-text">{{ t('quiz.step7.subscriptionQuestion') }}</legend>
        <div class="flex gap-2">
          <button
            v-for="opt in (['yes', 'maybe', 'no'] as const)"
            :key="opt"
            type="button"
            class="rounded-full border px-4 py-2 text-sm"
            :class="
              answers.subscriptionInterest === opt
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-brand-border bg-brand-surface text-brand-text'
            "
            @click="answers.subscriptionInterest = opt"
          >
            {{ t(`quiz.step7.subscription.${opt}`) }}
          </button>
        </div>
      </fieldset>
    </QuizStep>

    <QuizStep
      v-else-if="step === 8"
      :title="t('quiz.step8.title')"
      :can-go-next="true"
      @back="goBack"
      @next="handleNext"
    >
      <p class="text-sm text-brand-text">{{ t('quiz.progress', { step: 8, total: QUIZ_STEP_COUNT }) }} — {{ cityLabel }}</p>

      <div v-if="recommendation.needsConsultation" class="rounded-xl border border-brand-accent bg-brand-surface p-4">
        <p class="font-semibold text-brand-text">{{ t('quiz.step8.consultationNeeded') }}</p>
        <p class="mt-2 text-sm text-brand-text-muted">{{ t('quiz.step8.consultationBody') }}</p>
      </div>

      <div v-if="recommendedRecipes.length > 0">
        <p class="font-medium text-brand-text">
          {{ recommendation.needsConsultation ? t('quiz.step8.possibleOptions') : t('quiz.step8.recommendedTitle') }}
        </p>
        <ul class="mt-2 flex flex-wrap gap-2">
          <li
            v-for="recipe in recommendedRecipes"
            :key="recipe!.id"
            class="rounded-full border border-brand-border bg-brand-surface px-3 py-1.5 text-sm text-brand-text"
          >
            {{ t(`recipes.${recipe!.translationKey}.title`) }}
          </li>
        </ul>
      </div>
      <p v-else class="text-sm text-brand-text-muted">{{ t('quiz.step8.noMatches') }}</p>

      <p class="text-xs italic text-brand-text-muted">{{ t('quiz.step8.conceptCaveat') }}</p>
      <p class="text-sm text-brand-text-muted">{{ t('quiz.step8.noPriceYet') }}</p>
    </QuizStep>

    <QuizStep
      v-else-if="step === 9"
      :title="t('quiz.step9.title')"
      :can-go-next="currentStepValid && !submitting"
      :next-label="submitting ? t('quiz.step9.submitting') : t('quiz.step9.submit')"
      @back="goBack"
      @next="handleNext"
    >
      <ContactForm v-model="contact" />
      <p v-if="submitErrorCode" class="text-sm text-red-600" role="alert">
        {{ t(`quiz.step9.errors.${submitErrorCode}`, t('quiz.step9.errors.network_error')) }}
      </p>
    </QuizStep>
  </QuizShell>
</template>
