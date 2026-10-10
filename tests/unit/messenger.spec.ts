import { describe, expect, it } from 'vitest'
import { buildTelegramHref, buildWhatsappHref } from '../../app/utils/messenger'

describe('buildWhatsappHref', () => {
  it('strips non-digit characters from the configured number', () => {
    const href = buildWhatsappHref('+995 555 12 34 56', 'hello')
    expect(href).toBe('https://wa.me/995555123456?text=hello')
  })

  it('URL-encodes the message, including the lead reference', () => {
    const href = buildWhatsappHref('995555123456', 'Hi! Request reference: abc-123')
    expect(href).toBe('https://wa.me/995555123456?text=Hi!%20Request%20reference%3A%20abc-123')
  })
})

describe('buildTelegramHref', () => {
  it('strips a leading @ from the configured username', () => {
    expect(buildTelegramHref('@pawmeal_support')).toBe('https://t.me/pawmeal_support')
  })

  it('leaves a username without a leading @ unchanged', () => {
    expect(buildTelegramHref('pawmeal_support')).toBe('https://t.me/pawmeal_support')
  })
})
