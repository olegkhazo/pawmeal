import { describe, expect, it } from 'vitest'
import { toCsv } from '../../scripts/csv'

describe('toCsv', () => {
  it('guards cells starting with =,+,-,@ against formula injection', () => {
    const csv = toCsv(
      [
        { a: '=SUM(A1:A9)' },
        { a: '+1234' },
        { a: '-1234' },
        { a: '@mention' },
        { a: 'plain text' },
      ],
      ['a'],
    )
    const lines = csv.split('\n')
    expect(lines[1]).toBe("'=SUM(A1:A9)")
    expect(lines[2]).toBe("'+1234")
    expect(lines[3]).toBe("'-1234")
    expect(lines[4]).toBe("'@mention")
    expect(lines[5]).toBe('plain text')
  })

  it('quotes cells containing commas, quotes, or newlines', () => {
    const csv = toCsv([{ a: 'has,comma' }, { a: 'has"quote' }], ['a'])
    const lines = csv.split('\n')
    expect(lines[1]).toBe('"has,comma"')
    expect(lines[2]).toBe('"has""quote"')
  })

  it('renders null/undefined as an empty cell', () => {
    const csv = toCsv([{ a: null }, { a: undefined }], ['a'])
    const lines = csv.split('\n')
    expect(lines[1]).toBe('')
    expect(lines[2]).toBe('')
  })
})
