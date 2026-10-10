import { z } from 'zod'
import { cityIdSchema, excludedProteinSchema, telegramUsernamePattern, WEIGHT_BOUNDS } from './quiz'

// Capped so a handful of UTM/analytics fields can't be abused to smuggle
// large arbitrary text into the database — see .cursorrules.txt section 8.
const utmField = z.string().max(100).optional().or(z.literal(''))

export const leadPayloadSchema = z
  .object({
    locale: z.enum(['ka', 'ru', 'en'], { error: 'validation.required' }),

    species: z.enum(['dog', 'cat'], { error: 'validation.required' }),
    petName: z.string().max(50).optional().or(z.literal('')),

    cityId: cityIdSchema,
    otherCity: z.string().optional().or(z.literal('')),

    ageBand: z.enum(['under1', '1to7', 'over7'], { error: 'validation.required' }),
    weightKg: z.coerce.number({ error: 'validation.weightNumber' }).positive({ error: 'validation.weightNumber' }),
    breed: z.string().max(80).optional().or(z.literal('')),

    activity: z.enum(['low', 'medium', 'high'], { error: 'validation.required' }),
    currentFood: z.enum(['dry', 'wet', 'homeCooked', 'mixed', 'other'], { error: 'validation.required' }),

    excludedProteins: z.array(excludedProteinSchema).min(1, { error: 'validation.required' }),
    otherReaction: z.string().max(300).optional().or(z.literal('')),
    specialDiet: z.enum(['yes', 'no', 'unknown'], { error: 'validation.required' }),

    preferredRecipeIds: z.array(z.string().max(50)).max(6),
    planType: z.enum(['full', 'supplement', 'help'], { error: 'validation.required' }),
    frequencyPreference: z.enum(['weekly', 'biweekly', 'monthly', 'unsure'], { error: 'validation.required' }),

    monthlyBudgetGel: z.coerce.number().nonnegative().nullable().optional(),
    subscriptionInterest: z.enum(['yes', 'maybe', 'no'], { error: 'validation.required' }),

    priceInterest: z.enum(['yes', 'maybe', 'no']).nullable().optional(),

    ownerName: z.string().max(80).optional().or(z.literal('')),
    phoneRaw: z.string().min(1, { error: 'validation.required' }).max(32),
    preferredChannel: z.enum(['whatsapp', 'telegram', 'call'], { error: 'validation.required' }),
    telegramUsername: z
      .string()
      .max(33)
      .optional()
      .or(z.literal(''))
      .refine((v) => !v || telegramUsernamePattern.test(v), { error: 'validation.telegramUsername' }),

    contactConsent: z.literal(true, { error: 'validation.consentRequired' }),
    marketingConsent: z.boolean(),

    utmSource: utmField,
    utmMedium: utmField,
    utmCampaign: utmField,
    utmContent: utmField,
    utmTerm: utmField,
    landingPath: z.string().max(200).optional().or(z.literal('')),
    referrerOrigin: z.string().max(200).optional().or(z.literal('')),
    experimentVariant: z.string().max(50).optional().or(z.literal('')),

    // One per submission attempt — see Lead.clientRequestId in prisma/schema.prisma.
    clientRequestId: z.string().min(8).max(100),

    // Honeypot: a real visitor never sees or fills this field (see
    // ContactForm.vue). Deliberately NOT constrained to empty here — the route
    // handler checks it explicitly so a filled value gets the same generic
    // "validation_error" response as any other bad payload, not a schema-shape
    // error that would hint at the honeypot's existence.
    website: z.string().max(200).optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (val.cityId === 'other') {
      const len = (val.otherCity ?? '').trim().length
      if (len < 2 || len > 80) {
        ctx.addIssue({ code: 'custom', path: ['otherCity'], message: 'validation.otherCity' })
      }
    }

    const bounds = WEIGHT_BOUNDS[val.species]
    if (val.weightKg < bounds.min || val.weightKg > bounds.max) {
      ctx.addIssue({ code: 'custom', path: ['weightKg'], message: 'validation.weightRange' })
    }

    const exclusive = val.excludedProteins.filter((p) => p === 'none' || p === 'unknown')
    if (exclusive.length > 0 && val.excludedProteins.length > exclusive.length) {
      ctx.addIssue({ code: 'custom', path: ['excludedProteins'], message: 'validation.excludedExclusive' })
    }
    if (val.excludedProteins.includes('other') && (val.otherReaction ?? '').trim().length === 0) {
      ctx.addIssue({ code: 'custom', path: ['otherReaction'], message: 'validation.required' })
    }
  })

export type LeadPayload = z.infer<typeof leadPayloadSchema>
