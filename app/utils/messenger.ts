export function buildWhatsappHref(configuredNumber: string, message: string): string {
  const digits = configuredNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

// `text` prefills the chat's message input (t.me/<username>?text=…, see
// core.telegram.org/api/links); the visitor still has to press Send.
export function buildTelegramHref(configuredUsername: string, text?: string): string {
  const handle = configuredUsername.replace(/^@/, '')
  return text ? `https://t.me/${handle}?text=${encodeURIComponent(text)}` : `https://t.me/${handle}`
}
