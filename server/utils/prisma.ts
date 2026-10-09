import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

let instance: PrismaClient | undefined

export function usePrisma(): PrismaClient {
  if (!instance) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
    instance = new PrismaClient({ adapter })
  }
  return instance
}
