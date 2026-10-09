export interface City {
  id: string
  labelKey: string
}

// Stable ids — never rename these, only the translated labels change.
// "other" always lets the visitor submit a request; see .cursorrules.txt section 4.2.
export const cities: City[] = [
  { id: 'tbilisi', labelKey: 'cities.tbilisi' },
  { id: 'batumi', labelKey: 'cities.batumi' },
  { id: 'kutaisi', labelKey: 'cities.kutaisi' },
  { id: 'rustavi', labelKey: 'cities.rustavi' },
  { id: 'gori', labelKey: 'cities.gori' },
  { id: 'zugdidi', labelKey: 'cities.zugdidi' },
  { id: 'poti', labelKey: 'cities.poti' },
  { id: 'telavi', labelKey: 'cities.telavi' },
  { id: 'akhaltsikhe', labelKey: 'cities.akhaltsikhe' },
  { id: 'other', labelKey: 'cities.other' },
]

export const CITY_IDS = cities.map((c) => c.id) as [string, ...string[]]
