import { parsePhoneNumberFromString } from 'libphonenumber-js'
import type { LeadPayload } from '~~/shared/schemas/lead'
import { getRecommendation } from '~~/shared/utils/recommend'
// usePrisma, CONSENT_VERSION, PRIVACY_VERSION are auto-imported from server/utils/*

export class LeadValidationError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

export interface LeadMeta {
  landingPath?: string
  referrerOrigin?: string
  experimentVariant?: string
}

export async function createOrGetLead(payload: LeadPayload, meta: LeadMeta) {
  const prisma = usePrisma()

  // Idempotency: a retry with the same clientRequestId returns the original
  // success without a public lookup by phone — see section 8.
  const existing = await prisma.lead.findUnique({
    where: { clientRequestId: payload.clientRequestId },
    select: { id: true },
  })
  if (existing) {
    return { leadId: existing.id, alreadyExisted: true }
  }

  const parsedPhone = parsePhoneNumberFromString(payload.phoneRaw, 'GE')
  if (!parsedPhone?.isValid()) {
    throw new LeadValidationError('invalid_phone', 'Phone number failed validation')
  }

  const recommendation = getRecommendation({
    species: payload.species,
    excludedProteins: payload.excludedProteins,
    specialDiet: payload.specialDiet,
    preferredRecipeIds: payload.preferredRecipeIds,
  })

  const now = new Date()

  try {
    const lead = await prisma.lead.create({
      data: {
        locale: payload.locale,
        species: payload.species,
        petName: payload.petName || null,
        cityId: payload.cityId,
        otherCity: payload.cityId === 'other' ? payload.otherCity || null : null,
        ageBand: payload.ageBand,
        weightKg: payload.weightKg,
        breed: payload.breed || null,
        activity: payload.activity,
        currentFood: payload.currentFood,
        excludedProteins: payload.excludedProteins,
        otherReaction: payload.otherReaction || null,
        specialDiet: payload.specialDiet,
        preferredRecipeIds: payload.preferredRecipeIds,
        planType: payload.planType,
        frequencyPreference: payload.frequencyPreference,
        monthlyBudgetGel: payload.monthlyBudgetGel ?? null,
        subscriptionInterest: payload.subscriptionInterest,
        priceExperimentId: null,
        offeredMonthlyPriceGel: null,
        priceInterest: payload.priceInterest ?? null,
        recommendedRecipeIds: recommendation.recommendedRecipeIds,
        needsConsultation: recommendation.needsConsultation,
        ownerName: payload.ownerName || null,
        phoneE164: parsedPhone.number,
        preferredChannel: payload.preferredChannel,
        telegramUsername: payload.telegramUsername || null,
        contactConsentAt: now,
        marketingConsentAt: payload.marketingConsent ? now : null,
        consentVersion: CONSENT_VERSION,
        privacyVersion: PRIVACY_VERSION,
        utmSource: payload.utmSource || null,
        utmMedium: payload.utmMedium || null,
        utmCampaign: payload.utmCampaign || null,
        utmContent: payload.utmContent || null,
        utmTerm: payload.utmTerm || null,
        landingPath: meta.landingPath || null,
        referrerOrigin: meta.referrerOrigin || null,
        experimentVariant: meta.experimentVariant || null,
        clientRequestId: payload.clientRequestId,
      },
      select: { id: true },
    })
    return { leadId: lead.id, alreadyExisted: false }
  } catch (err) {
    // Unique constraint race: two near-simultaneous retries with the same
    // clientRequestId. Whoever lost the race just reads back the winner.
    if (isUniqueConstraintError(err)) {
      const raceWinner = await prisma.lead.findUnique({
        where: { clientRequestId: payload.clientRequestId },
        select: { id: true },
      })
      if (raceWinner) {
        return { leadId: raceWinner.id, alreadyExisted: true }
      }
    }
    throw err
  }
}

function isUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: string }).code === 'P2002'
  )
}
