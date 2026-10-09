import { recipes } from '~~/data/recipes'
import type { ExcludedProtein, SpecialDiet } from '~~/shared/types/quiz'
import type { Species } from '~~/shared/types/recipe'

export interface RecommendationInput {
  species: Species
  excludedProteins: ExcludedProtein[]
  specialDiet: SpecialDiet | null
  preferredRecipeIds: string[]
}

export interface RecommendationResult {
  recommendedRecipeIds: string[]
  needsConsultation: boolean
}

// Deterministic, non-clinical filter — see .cursorrules.txt section 7.
// species -> drop excluded proteins -> boost preferred picks. specialDiet
// "yes"/"unknown" or an "other"/unknown allergen never produces a suitability
// claim: the caller must show the consultation message, and an empty result
// must never fall back to an excluded product.
export function getRecommendation(input: RecommendationInput): RecommendationResult {
  const bySpecies = recipes.filter((r) => r.species === input.species)
  const problematic = new Set(
    input.excludedProteins.filter(
      (p): p is Extract<ExcludedProtein, 'chicken' | 'turkey' | 'beef' | 'fish'> =>
        p !== 'none' && p !== 'unknown' && p !== 'other',
    ),
  )
  const candidates = bySpecies.filter((r) => !problematic.has(r.conceptProtein))

  const preferredSet = new Set(input.preferredRecipeIds)
  const sorted = [...candidates].sort((a, b) => {
    const aPreferred = preferredSet.has(a.id) ? 1 : 0
    const bPreferred = preferredSet.has(b.id) ? 1 : 0
    return bPreferred - aPreferred
  })

  const unknownOrOtherAllergen = input.excludedProteins.includes('other') || input.excludedProteins.includes('unknown')
  const needsConsultation = input.specialDiet === 'yes' || input.specialDiet === 'unknown' || unknownOrOtherAllergen

  if (sorted.length === 0) {
    return { recommendedRecipeIds: [], needsConsultation: true }
  }

  return { recommendedRecipeIds: sorted.map((r) => r.id), needsConsultation }
}
