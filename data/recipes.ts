export type Species = 'dog' | 'cat'
export type ConceptProtein = 'chicken' | 'turkey' | 'beef' | 'fish'

export interface Recipe {
  id: string
  species: Species
  translationKey: string
  conceptProtein: ConceptProtein
  image: string
  imageAltKey: string
  status: 'concept'
}

// Six marketing concepts, not production formulas — see .cursorrules.txt section 5.
// Content (title/description/alt) lives in locales/*.json under `recipes.<id>`.
export const recipes: Recipe[] = [
  {
    id: 'dog-chicken',
    species: 'dog',
    translationKey: 'dog-chicken',
    conceptProtein: 'chicken',
    image: '/images/products/dog-chicken.svg',
    imageAltKey: 'recipes.dog-chicken.alt',
    status: 'concept',
  },
  {
    id: 'dog-turkey',
    species: 'dog',
    translationKey: 'dog-turkey',
    conceptProtein: 'turkey',
    image: '/images/products/dog-turkey.svg',
    imageAltKey: 'recipes.dog-turkey.alt',
    status: 'concept',
  },
  {
    id: 'dog-beef',
    species: 'dog',
    translationKey: 'dog-beef',
    conceptProtein: 'beef',
    image: '/images/products/dog-beef.svg',
    imageAltKey: 'recipes.dog-beef.alt',
    status: 'concept',
  },
  {
    id: 'cat-chicken',
    species: 'cat',
    translationKey: 'cat-chicken',
    conceptProtein: 'chicken',
    image: '/images/products/cat-chicken.svg',
    imageAltKey: 'recipes.cat-chicken.alt',
    status: 'concept',
  },
  {
    id: 'cat-turkey',
    species: 'cat',
    translationKey: 'cat-turkey',
    conceptProtein: 'turkey',
    image: '/images/products/cat-turkey.svg',
    imageAltKey: 'recipes.cat-turkey.alt',
    status: 'concept',
  },
  {
    id: 'cat-fish',
    species: 'cat',
    translationKey: 'cat-fish',
    conceptProtein: 'fish',
    image: '/images/products/cat-fish.svg',
    imageAltKey: 'recipes.cat-fish.alt',
    status: 'concept',
  },
]
