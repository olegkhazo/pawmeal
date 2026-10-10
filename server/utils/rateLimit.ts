const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_HITS_PER_WINDOW = 5

export class RateLimitedError extends Error {}

// Backed by the RateLimitHit table (not process memory) so limits survive a
// restart/redeploy and work across multiple server instances — see
// .cursorrules.txt section 8. Throws RateLimitedError when the bucket is over
// its quota; any other failure (e.g. the DB is unreachable) propagates as a
// plain error for the caller to map to a generic "service unavailable".
export async function enforceRateLimit(bucketKey: string): Promise<void> {
  const prisma = usePrisma()
  const since = new Date(Date.now() - WINDOW_MS)

  const recentHits = await prisma.rateLimitHit.count({
    where: { bucketKey, createdAt: { gte: since } },
  })
  if (recentHits >= MAX_HITS_PER_WINDOW) {
    throw new RateLimitedError('Rate limit exceeded')
  }

  await prisma.rateLimitHit.create({ data: { bucketKey } })
}
