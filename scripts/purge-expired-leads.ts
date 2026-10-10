// Server-side only — run with: npm run purge-expired-leads
// Intended to run on a schedule (cron). Deletes leads older than
// DATA_RETENTION_DAYS (see .env.example) and prunes stale rate-limit rows.
import { createScriptPrismaClient } from './db'

const RATE_LIMIT_HIT_MAX_AGE_MS = 24 * 60 * 60 * 1000 // generous vs. the 10-minute window

async function main() {
  const retentionDays = Number(process.env.DATA_RETENTION_DAYS ?? '90')
  if (!Number.isFinite(retentionDays) || retentionDays <= 0) {
    console.error(`Invalid DATA_RETENTION_DAYS: ${process.env.DATA_RETENTION_DAYS}`)
    process.exit(1)
  }

  const prisma = createScriptPrismaClient()
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

  const deletedLeads = await prisma.lead.deleteMany({ where: { createdAt: { lt: cutoff } } })
  console.log(`Purged ${deletedLeads.count} lead(s) older than ${retentionDays} days`)

  const rateLimitCutoff = new Date(Date.now() - RATE_LIMIT_HIT_MAX_AGE_MS)
  const deletedHits = await prisma.rateLimitHit.deleteMany({ where: { createdAt: { lt: rateLimitCutoff } } })
  console.log(`Pruned ${deletedHits.count} stale rate-limit row(s)`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('purge-expired-leads failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
