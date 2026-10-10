import { leadPayloadSchema } from '~~/shared/schemas/lead'
import { createOrGetLead, LeadValidationError } from '../services/leads'
import { RateLimitedError } from '../utils/rateLimit'

const MAX_BODY_BYTES = 20_000

export default defineEventHandler(async (event) => {
  // --- checks that never touch the database ---
  const contentLength = Number(getRequestHeader(event, 'content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    throw createError({ statusCode: 413, data: { errorCode: 'payload_too_large' } })
  }

  const siteUrl = useRuntimeConfig().public.siteUrl
  const origin = getRequestHeader(event, 'origin')
  if (origin && siteUrl) {
    try {
      if (new URL(origin).host !== new URL(siteUrl).host) {
        throw createError({ statusCode: 403, data: { errorCode: 'origin_rejected' } })
      }
    } catch {
      throw createError({ statusCode: 403, data: { errorCode: 'origin_rejected' } })
    }
  }

  const body = await readBody(event).catch(() => null)
  if (!body) {
    throw createError({ statusCode: 400, data: { errorCode: 'invalid_payload' } })
  }

  const result = leadPayloadSchema.safeParse(body)
  if (!result.success) {
    // Never log the raw body — it may contain phone numbers or free-text answers.
    console.warn('[leads] validation failed', { errorCount: result.error.issues.length })
    throw createError({ statusCode: 400, data: { errorCode: 'validation_error' } })
  }

  const payload = result.data
  if (payload.website) {
    // Honeypot tripped — respond exactly like a validation error, no extra signal.
    throw createError({ statusCode: 400, data: { errorCode: 'validation_error' } })
  }

  // --- everything below touches Postgres; any unexpected failure here (the
  // DB being unreachable included) must surface as a clean db_unavailable,
  // never a raw 500 or a leak of internal details. ---
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  try {
    await enforceRateLimit(`leads:${ip}`)

    const { leadId } = await createOrGetLead(payload, {
      landingPath: payload.landingPath,
      referrerOrigin: payload.referrerOrigin,
      experimentVariant: payload.experimentVariant,
    })
    setResponseStatus(event, 201)
    return { leadId, success: true as const }
  } catch (err) {
    if (err instanceof RateLimitedError) {
      throw createError({ statusCode: 429, data: { errorCode: 'rate_limited' } })
    }
    if (err instanceof LeadValidationError) {
      throw createError({ statusCode: 400, data: { errorCode: err.code } })
    }
    console.error('[leads] failed to save lead', { errorCode: 'db_unavailable' })
    throw createError({ statusCode: 503, data: { errorCode: 'db_unavailable' } })
  }
})
