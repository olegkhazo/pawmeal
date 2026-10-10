// Server-side only — run with: npm run delete-lead -- --id=<leadId>
import { parseArgs } from './args'
import { createScriptPrismaClient } from './db'

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.id) {
    console.error('Usage: npm run delete-lead -- --id=<leadId>')
    process.exit(1)
  }

  const prisma = createScriptPrismaClient()
  const deleted = await prisma.lead.deleteMany({ where: { id: args.id } })
  console.log(deleted.count > 0 ? `Deleted lead ${args.id}` : `No lead found with id ${args.id}`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('delete-lead failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
