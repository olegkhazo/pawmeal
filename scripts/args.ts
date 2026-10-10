export function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const arg of argv) {
    const match = /^--(?<key>[a-zA-Z]+)=(?<value>.*)$/.exec(arg)
    const key = match?.groups?.key
    const value = match?.groups?.value
    if (key !== undefined && value !== undefined) {
      out[key] = value
    }
  }
  return out
}
