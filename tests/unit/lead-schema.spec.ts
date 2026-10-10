import { describe, expect, it } from 'vitest'
import { leadPayloadSchema } from '../../shared/schemas/lead'

function basePayload() {
  return {
    locale: 'ru' as const,
    species: 'dog' as const,
    petName: 'Rex',
    cityId: 'tbilisi',
    otherCity: '',
    ageBand: '1to7' as const,
    weightKg: 18,
    breed: '',
    activity: 'medium' as const,
    currentFood: 'dry' as const,
    excludedProteins: ['none'] as const,
    otherReaction: '',
    specialDiet: 'no' as const,
    preferredRecipeIds: ['dog-chicken'],
    planType: 'full' as const,
    frequencyPreference: 'weekly' as const,
    monthlyBudgetGel: 100,
    subscriptionInterest: 'yes' as const,
    priceInterest: null,
    ownerName: 'Иван',
    phoneRaw: '+995555123456',
    preferredChannel: 'whatsapp' as const,
    telegramUsername: '',
    contactConsent: true as const,
    marketingConsent: false,
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmContent: '',
    utmTerm: '',
    landingPath: '/ru',
    referrerOrigin: '',
    experimentVariant: '',
    clientRequestId: 'a-valid-client-request-id-123',
    website: '',
  }
}

describe('leadPayloadSchema', () => {
  it('accepts a well-formed payload', () => {
    expect(leadPayloadSchema.safeParse(basePayload()).success).toBe(true)
  })

  it('rejects a weight outside the species sanity bounds', () => {
    const result = leadPayloadSchema.safeParse({ ...basePayload(), weightKg: 500 })
    expect(result.success).toBe(false)
  })

  it('rejects "other" city without a valid otherCity', () => {
    const result = leadPayloadSchema.safeParse({ ...basePayload(), cityId: 'other', otherCity: 'X' })
    expect(result.success).toBe(false)
  })

  it('accepts "other" city with a valid otherCity', () => {
    const result = leadPayloadSchema.safeParse({ ...basePayload(), cityId: 'other', otherCity: 'Marneuli' })
    expect(result.success).toBe(true)
  })

  it('rejects combining "none" with a specific excluded protein', () => {
    const result = leadPayloadSchema.safeParse({
      ...basePayload(),
      excludedProteins: ['none', 'chicken'],
    })
    expect(result.success).toBe(false)
  })

  it('rejects "other" allergen without a description', () => {
    const result = leadPayloadSchema.safeParse({
      ...basePayload(),
      excludedProteins: ['other'],
      otherReaction: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a missing contact consent', () => {
    const result = leadPayloadSchema.safeParse({ ...basePayload(), contactConsent: false })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid Telegram username format', () => {
    const result = leadPayloadSchema.safeParse({ ...basePayload(), telegramUsername: '#!' })
    expect(result.success).toBe(false)
  })

  it('rejects an oversized UTM field', () => {
    const result = leadPayloadSchema.safeParse({ ...basePayload(), utmSource: 'x'.repeat(200) })
    expect(result.success).toBe(false)
  })

  it('rejects a missing clientRequestId', () => {
    const { clientRequestId: _omit, ...rest } = basePayload()
    const result = leadPayloadSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })
})
