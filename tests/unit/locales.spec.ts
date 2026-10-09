import { describe, expect, it } from 'vitest'
import en from '../../locales/en.json'
import ka from '../../locales/ka.json'
import ru from '../../locales/ru.json'

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return value && typeof value === 'object'
      ? flattenKeys(value as Record<string, unknown>, path)
      : [path]
  })
}

describe('locale files', () => {
  const locales = { ka, ru, en }

  it('expose the same set of translation keys in ka, ru and en', () => {
    const [firstName, ...rest] = Object.keys(locales)
    const baseline = flattenKeys(locales[firstName as keyof typeof locales]).sort()

    for (const name of rest) {
      const keys = flattenKeys(locales[name as keyof typeof locales]).sort()
      expect(keys, `${name}.json should match ${firstName}.json key set`).toEqual(baseline)
    }
  })

  it('has no empty translation values', () => {
    for (const [name, dict] of Object.entries(locales)) {
      for (const key of flattenKeys(dict)) {
        const value = key.split('.').reduce<unknown>((acc, part) => {
          if (acc && typeof acc === 'object' && part in acc) {
            return (acc as Record<string, unknown>)[part]
          }
          return undefined
        }, dict)
        expect(String(value).trim(), `${name}.json -> ${key} should not be empty`).not.toBe('')
      }
    }
  })
})
