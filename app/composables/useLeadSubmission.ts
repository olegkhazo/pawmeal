import type { QuizContactAnswers, QuizDraftAnswers } from '~~/shared/types/quiz'

interface SubmitResult {
  success: boolean
  leadId?: string
  errorCode?: string
}

type QueryValue = string | null | undefined | (string | null)[]

export interface LeadSubmissionContext {
  locale: string
  landingPath: string
  utmSource?: QueryValue
  utmMedium?: QueryValue
  utmCampaign?: QueryValue
  utmContent?: QueryValue
  utmTerm?: QueryValue
  experimentVariant?: QueryValue
}

export function useLeadSubmission() {
  const submitting = useState<boolean>('lead-submitting', () => false)
  const errorCode = useState<string | null>('lead-error-code', () => null)

  async function submit(
    answers: QuizDraftAnswers,
    contact: QuizContactAnswers,
    clientRequestId: string,
    context: LeadSubmissionContext,
  ): Promise<SubmitResult> {
    submitting.value = true
    errorCode.value = null

    const payload = {
      locale: context.locale,
      species: answers.species,
      petName: answers.petName,
      cityId: answers.cityId,
      otherCity: answers.otherCity,
      ageBand: answers.ageBand,
      weightKg: answers.weightKg,
      breed: answers.breed,
      activity: answers.activity,
      currentFood: answers.currentFood,
      excludedProteins: answers.excludedProteins,
      otherReaction: answers.otherReaction,
      specialDiet: answers.specialDiet,
      preferredRecipeIds: answers.preferredRecipeIds,
      planType: answers.planType,
      frequencyPreference: answers.frequencyPreference,
      monthlyBudgetGel: answers.monthlyBudgetUnknown ? null : answers.monthlyBudgetGel || null,
      subscriptionInterest: answers.subscriptionInterest,
      priceInterest: answers.priceInterest,
      ownerName: contact.ownerName,
      phoneRaw: contact.phoneRaw,
      preferredChannel: contact.preferredChannel,
      telegramUsername: contact.telegramUsername,
      contactConsent: contact.contactConsent,
      marketingConsent: contact.marketingConsent,
      utmSource: context.utmSource,
      utmMedium: context.utmMedium,
      utmCampaign: context.utmCampaign,
      utmContent: context.utmContent,
      utmTerm: context.utmTerm,
      landingPath: context.landingPath,
      referrerOrigin: getReferrerOrigin(),
      experimentVariant: context.experimentVariant,
      clientRequestId,
      website: contact.website,
    }

    try {
      const response = await $fetch<{ leadId: string; success: true }>('/api/leads', {
        method: 'POST',
        body: payload,
      })
      submitting.value = false
      return { success: true, leadId: response.leadId }
    } catch (err) {
      submitting.value = false
      const code = extractErrorCode(err)
      errorCode.value = code
      return { success: false, errorCode: code }
    }
  }

  return { submitting, errorCode, submit }
}

function getReferrerOrigin(): string | undefined {
  if (typeof document === 'undefined' || !document.referrer) return undefined
  try {
    return new URL(document.referrer).origin
  } catch {
    return undefined
  }
}

function extractErrorCode(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'data' in err) {
    const data = (err as { data?: { data?: { errorCode?: string } } }).data
    if (data?.data?.errorCode) return data.data.errorCode
  }
  return 'network_error'
}
