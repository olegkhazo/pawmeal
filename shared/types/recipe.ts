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
