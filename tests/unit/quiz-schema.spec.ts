import { describe, expect, it } from 'vitest'
import { step7Schema } from '../../shared/schemas/quiz'

function step7(monthlyBudgetGel: string | number) {
  return { monthlyBudgetGel, monthlyBudgetUnknown: false, subscriptionInterest: 'yes' as const }
}

describe('step7Schema', () => {
  it('accepts a budget typed into the number input (v-model yields a number)', () => {
    expect(step7Schema.safeParse(step7(70)).success).toBe(true)
  })

  it('accepts a cleared or string budget', () => {
    expect(step7Schema.safeParse(step7('')).success).toBe(true)
    expect(step7Schema.safeParse(step7('70')).success).toBe(true)
  })

  it('rejects a negative budget with the translated message key', () => {
    const result = step7Schema.safeParse(step7(-5))
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('validation.budgetNumber')
  })
})
