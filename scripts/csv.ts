// Prevents CSV formula injection: a cell that starts with =,+,-,@ gets a
// leading apostrophe so spreadsheet apps treat it as text, not a formula.
// See .cursorrules.txt section 8.
const DANGEROUS_PREFIXES = ['=', '+', '-', '@']

function sanitizeCell(value: string): string {
  const needsGuard = DANGEROUS_PREFIXES.some((p) => value.startsWith(p))
  const guarded = needsGuard ? `'${value}` : value
  const escaped = guarded.replace(/"/g, '""')
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const header = columns.join(',')
  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const value = row[col]
        if (value === null || value === undefined) return ''
        if (value instanceof Date) return value.toISOString()
        return sanitizeCell(String(value))
      })
      .join(','),
  )
  return [header, ...lines].join('\n')
}
