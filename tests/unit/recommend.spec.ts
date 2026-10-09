import { describe, expect, it } from 'vitest'
import { getRecommendation } from '../../shared/utils/recommend'

describe('getRecommendation', () => {
  it('only returns recipes for the given species', () => {
    const result = getRecommendation({
      species: 'dog',
      excludedProteins: [],
      specialDiet: 'no',
      preferredRecipeIds: [],
    })
    expect(result.recommendedRecipeIds).toEqual(
      expect.arrayContaining(['dog-chicken', 'dog-turkey', 'dog-beef']),
    )
    expect(result.recommendedRecipeIds).not.toEqual(expect.arrayContaining(['cat-chicken']))
    expect(result.needsConsultation).toBe(false)
  })

  it('excludes recipes with a problem protein', () => {
    const result = getRecommendation({
      species: 'cat',
      excludedProteins: ['chicken'],
      specialDiet: 'no',
      preferredRecipeIds: [],
    })
    expect(result.recommendedRecipeIds).not.toContain('cat-chicken')
    expect(result.recommendedRecipeIds).toEqual(expect.arrayContaining(['cat-turkey', 'cat-fish']))
  })

  it('never falls back to an excluded product when nothing is left', () => {
    const result = getRecommendation({
      species: 'cat',
      excludedProteins: ['chicken', 'turkey', 'fish'],
      specialDiet: 'no',
      preferredRecipeIds: [],
    })
    expect(result.recommendedRecipeIds).toEqual([])
    expect(result.needsConsultation).toBe(true)
  })

  it('boosts preferred recipes to the front without dropping the rest', () => {
    const result = getRecommendation({
      species: 'dog',
      excludedProteins: [],
      specialDiet: 'no',
      preferredRecipeIds: ['dog-beef'],
    })
    expect(result.recommendedRecipeIds[0]).toBe('dog-beef')
    expect(result.recommendedRecipeIds).toHaveLength(3)
  })

  it('requires consultation when the owner says the pet has a special diet', () => {
    const result = getRecommendation({
      species: 'dog',
      excludedProteins: [],
      specialDiet: 'yes',
      preferredRecipeIds: [],
    })
    expect(result.needsConsultation).toBe(true)
    expect(result.recommendedRecipeIds.length).toBeGreaterThan(0)
  })

  it('requires consultation when the special diet status is unknown', () => {
    const result = getRecommendation({
      species: 'dog',
      excludedProteins: [],
      specialDiet: 'unknown',
      preferredRecipeIds: [],
    })
    expect(result.needsConsultation).toBe(true)
  })

  it('requires consultation for an "other" or "unknown" allergen, but not for "none"', () => {
    const other = getRecommendation({
      species: 'dog',
      excludedProteins: ['other'],
      specialDiet: 'no',
      preferredRecipeIds: [],
    })
    expect(other.needsConsultation).toBe(true)

    const unknown = getRecommendation({
      species: 'dog',
      excludedProteins: ['unknown'],
      specialDiet: 'no',
      preferredRecipeIds: [],
    })
    expect(unknown.needsConsultation).toBe(true)

    const none = getRecommendation({
      species: 'dog',
      excludedProteins: ['none'],
      specialDiet: 'no',
      preferredRecipeIds: [],
    })
    expect(none.needsConsultation).toBe(false)
    expect(none.recommendedRecipeIds).toHaveLength(3)
  })
})
