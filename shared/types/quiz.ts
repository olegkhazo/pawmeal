import type { Species } from './recipe'

export type AgeBand = 'under1' | '1to7' | 'over7'
export type ActivityLevel = 'low' | 'medium' | 'high'
export type CurrentFood = 'dry' | 'wet' | 'homeCooked' | 'mixed' | 'other'
export type ProteinTag = 'chicken' | 'turkey' | 'beef' | 'fish'
export type ExcludedProtein = ProteinTag | 'other' | 'none' | 'unknown'
export type SpecialDiet = 'yes' | 'no' | 'unknown'
export type PlanType = 'full' | 'supplement' | 'help'
export type FrequencyPreference = 'weekly' | 'biweekly' | 'monthly' | 'unsure'
export type SubscriptionInterest = 'yes' | 'maybe' | 'no'
export type PriceInterest = 'yes' | 'maybe' | 'no'
export type PreferredChannel = 'whatsapp' | 'telegram' | 'call'

export const QUIZ_STEP_COUNT = 9

// Everything here is non-personal and safe to persist in sessionStorage.
// Contact-form fields (step 9) are intentionally a separate type — see
// QuizContactAnswers — and must never be written to browser storage.
export interface QuizDraftAnswers {
  species: Species | null
  petName: string

  cityId: string | null
  otherCity: string

  ageBand: AgeBand | null
  weightKg: string
  breed: string

  activity: ActivityLevel | null
  currentFood: CurrentFood | null

  excludedProteins: ExcludedProtein[]
  otherReaction: string
  specialDiet: SpecialDiet | null

  preferredRecipeIds: string[]
  planType: PlanType | null
  frequencyPreference: FrequencyPreference | null

  monthlyBudgetGel: string
  monthlyBudgetUnknown: boolean
  subscriptionInterest: SubscriptionInterest | null

  priceInterest: PriceInterest | null
}

export function createEmptyDraftAnswers(): QuizDraftAnswers {
  return {
    species: null,
    petName: '',
    cityId: null,
    otherCity: '',
    ageBand: null,
    weightKg: '',
    breed: '',
    activity: null,
    currentFood: null,
    excludedProteins: [],
    otherReaction: '',
    specialDiet: null,
    preferredRecipeIds: [],
    planType: null,
    frequencyPreference: null,
    monthlyBudgetGel: '',
    monthlyBudgetUnknown: false,
    subscriptionInterest: null,
    priceInterest: null,
  }
}

// Never persisted to sessionStorage — kept in memory only, cleared on reload.
export interface QuizContactAnswers {
  ownerName: string
  phoneRaw: string
  preferredChannel: PreferredChannel | null
  telegramUsername: string
  contactConsent: boolean
  marketingConsent: boolean
}

export function createEmptyContactAnswers(): QuizContactAnswers {
  return {
    ownerName: '',
    phoneRaw: '',
    preferredChannel: null,
    telegramUsername: '',
    contactConsent: false,
    marketingConsent: false,
  }
}

export interface QuizDraft {
  version: number
  savedAt: number
  step: number
  answers: QuizDraftAnswers
}

export const QUIZ_DRAFT_STORAGE_KEY = 'pawmeal:quiz-draft'
export const QUIZ_DRAFT_VERSION = 1
export const QUIZ_DRAFT_TTL_MS = 60 * 60 * 1000 // 60 minutes
