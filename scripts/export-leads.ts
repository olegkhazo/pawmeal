// Server-side only — run with: npm run export-leads -- --from=2026-01-01 --to=2026-12-31 --city=tbilisi --locale=ru --out=leads.csv
// Not reachable from any public route; requires direct server/CLI access.
import { writeFileSync } from 'node:fs'
import { parseArgs } from './args'
import { createScriptPrismaClient } from './db'
import { toCsv } from './csv'

const COLUMNS = [
  'id',
  'createdAt',
  'locale',
  'species',
  'petName',
  'cityId',
  'otherCity',
  'ageBand',
  'weightKg',
  'breed',
  'activity',
  'currentFood',
  'excludedProteins',
  'otherReaction',
  'specialDiet',
  'preferredRecipeIds',
  'planType',
  'frequencyPreference',
  'monthlyBudgetGel',
  'subscriptionInterest',
  'priceInterest',
  'recommendedRecipeIds',
  'needsConsultation',
  'ownerName',
  'phoneE164',
  'preferredChannel',
  'telegramUsername',
  'contactConsentAt',
  'marketingConsentAt',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'landingPath',
  'experimentVariant',
]

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const prisma = createScriptPrismaClient()

  const where: Record<string, unknown> = {}
  if (args.from || args.to) {
    where.createdAt = {
      ...(args.from ? { gte: new Date(args.from) } : {}),
      ...(args.to ? { lte: new Date(args.to) } : {}),
    }
  }
  if (args.city) where.cityId = args.city
  if (args.locale) where.locale = args.locale

  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } })
  const csv = toCsv(
    leads.map((l) => ({ ...l, excludedProteins: l.excludedProteins.join('|'), preferredRecipeIds: l.preferredRecipeIds.join('|'), recommendedRecipeIds: l.recommendedRecipeIds.join('|') })),
    COLUMNS,
  )

  const outPath = args.out ?? `leads-export-${Date.now()}.csv`
  writeFileSync(outPath, csv, 'utf8')
  console.log(`Exported ${leads.length} lead(s) to ${outPath}`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('export-leads failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
