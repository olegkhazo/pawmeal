import type { Species } from './recipe'

// Every payload below is restricted, on purpose, to fields section 12 of
// .cursorrules.txt allows for analytics grouping. Phone, owner/pet name,
// Telegram username, weight, free-text answers, and full quiz answers must
// never appear here — the type system is the enforcement, not a runtime
// filter, so a caller literally cannot attach them.
interface BaseFields {
  locale: string
  experimentVariant?: string
}

export type TrackingEvent =
  | ({ name: 'landing_view' } & BaseFields)
  | ({ name: 'species_selected'; species: Species } & BaseFields)
  | ({ name: 'quiz_started'; species: Species | null } & BaseFields)
  | ({ name: 'quiz_step_completed'; stepId: number } & BaseFields)
  | ({ name: 'quiz_completed'; species: Species | null; cityId: string | null; planType: string | null } & BaseFields)
  | ({ name: 'recommendation_viewed'; species: Species | null; needsConsultation: boolean } & BaseFields)
  | ({ name: 'price_offer_viewed'; experimentVariant: string } & BaseFields)
  | ({ name: 'price_interest_selected'; priceInterest: 'yes' | 'maybe' | 'no'; experimentVariant: string } & BaseFields)
  | ({ name: 'lead_submit_success'; cityId: string | null; planType: string | null } & BaseFields)
  | ({ name: 'lead_submit_error'; errorCode: string } & BaseFields)
  | ({ name: 'messenger_clicked'; channel: 'whatsapp' | 'telegram' | 'email' } & BaseFields)
