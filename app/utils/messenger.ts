export function buildWhatsappHref(configuredNumber: string, message: string): string {
  const digits = configuredNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function buildTelegramHref(configuredUsername: string): string {
  const handle = configuredUsername.replace(/^@/, '')
  return `https://t.me/${handle}`
}
