import { parsePhoneNumberFromString } from 'libphonenumber-js'
import type { QuizContactAnswers } from '~~/shared/types/quiz'

const telegramUsernamePattern = /^@?[A-Za-z0-9_]{5,32}$/

export function isContactValid(contact: QuizContactAnswers): boolean {
  if (!contact.phoneRaw.trim()) return false
  const parsed = parsePhoneNumberFromString(contact.phoneRaw, 'GE')
  if (!parsed?.isValid()) return false
  if (!contact.preferredChannel) return false
  if (contact.telegramUsername.trim() && !telegramUsernamePattern.test(contact.telegramUsername.trim())) return false
  return contact.contactConsent
}
