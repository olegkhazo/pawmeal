import { z } from 'zod'
import { CITY_IDS } from '~~/data/cities'

const cityIdSchema = z.enum(CITY_IDS)

export const step1Schema = z.object({
  species: z.enum(['dog', 'cat'], { error: 'validation.required' }),
  petName: z.string().max(50, { error: 'validation.maxLength' }).optional().or(z.literal('')),
})

export const step2Schema = z
  .object({
    cityId: cityIdSchema,
    otherCity: z.string().optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (val.cityId === 'other') {
      const len = (val.otherCity ?? '').trim().length
      if (len < 2 || len > 80) {
        ctx.addIssue({ code: 'custom', path: ['otherCity'], message: 'validation.otherCity' })
      }
    }
  })

// Sanity bounds only — a segmentation guardrail, not a clinical/veterinary limit.
const WEIGHT_BOUNDS: Record<'dog' | 'cat', { min: number; max: number }> = {
  dog: { min: 0.5, max: 90 },
  cat: { min: 0.5, max: 15 },
}

export const step3Schema = z
  .object({
    ageBand: z.enum(['under1', '1to7', 'over7'], { error: 'validation.required' }),
    weightKg: z.coerce
      .number({ error: 'validation.weightNumber' })
      .positive({ error: 'validation.weightNumber' }),
    breed: z.string().max(80, { error: 'validation.maxLength' }).optional().or(z.literal('')),
  })
  .and(z.object({ species: z.enum(['dog', 'cat']) }))
  .superRefine((val, ctx) => {
    const bounds = WEIGHT_BOUNDS[val.species]
    if (val.weightKg < bounds.min || val.weightKg > bounds.max) {
      ctx.addIssue({ code: 'custom', path: ['weightKg'], message: 'validation.weightRange' })
    }
  })

export const step4Schema = z.object({
  activity: z.enum(['low', 'medium', 'high'], { error: 'validation.required' }),
  currentFood: z.enum(['dry', 'wet', 'homeCooked', 'mixed', 'other'], { error: 'validation.required' }),
})

const excludedProteinSchema = z.enum(['chicken', 'turkey', 'beef', 'fish', 'other', 'none', 'unknown'])

export const step5Schema = z
  .object({
    excludedProteins: z.array(excludedProteinSchema).min(1, { error: 'validation.required' }),
    otherReaction: z.string().max(300, { error: 'validation.maxLength' }).optional().or(z.literal('')),
    specialDiet: z.enum(['yes', 'no', 'unknown'], { error: 'validation.required' }),
  })
  .superRefine((val, ctx) => {
    const exclusive = val.excludedProteins.filter((p) => p === 'none' || p === 'unknown')
    if (exclusive.length > 0 && val.excludedProteins.length > exclusive.length) {
      ctx.addIssue({ code: 'custom', path: ['excludedProteins'], message: 'validation.excludedExclusive' })
    }
    if (val.excludedProteins.includes('other') && (val.otherReaction ?? '').trim().length === 0) {
      ctx.addIssue({ code: 'custom', path: ['otherReaction'], message: 'validation.required' })
    }
  })

export const step6Schema = z.object({
  preferredRecipeIds: z.array(z.string()),
  planType: z.enum(['full', 'supplement', 'help'], { error: 'validation.required' }),
  frequencyPreference: z.enum(['weekly', 'biweekly', 'monthly', 'unsure'], { error: 'validation.required' }),
})

export const step7Schema = z
  .object({
    monthlyBudgetGel: z.string().optional().or(z.literal('')),
    monthlyBudgetUnknown: z.boolean(),
    subscriptionInterest: z.enum(['yes', 'maybe', 'no'], { error: 'validation.required' }),
  })
  .superRefine((val, ctx) => {
    if (!val.monthlyBudgetUnknown && val.monthlyBudgetGel) {
      const n = Number(val.monthlyBudgetGel)
      if (!Number.isFinite(n) || n < 0) {
        ctx.addIssue({ code: 'custom', path: ['monthlyBudgetGel'], message: 'validation.budgetNumber' })
      }
    }
  })

// Step 8 (preliminary offer) never blocks completion — priceInterest is optional.
export const step8Schema = z.object({
  priceInterest: z.enum(['yes', 'maybe', 'no']).nullable(),
})

const telegramUsernamePattern = /^@?[A-Za-z0-9_]{5,32}$/

export const contactSchema = z.object({
  ownerName: z.string().max(80, { error: 'validation.maxLength' }).optional().or(z.literal('')),
  phoneRaw: z.string().min(1, { error: 'validation.required' }),
  preferredChannel: z.enum(['whatsapp', 'telegram', 'call'], { error: 'validation.required' }),
  telegramUsername: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || telegramUsernamePattern.test(v), { error: 'validation.telegramUsername' }),
  contactConsent: z.literal(true, { error: 'validation.consentRequired' }),
  marketingConsent: z.boolean(),
})
