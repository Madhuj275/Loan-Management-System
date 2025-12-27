import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Ts4KZfrOb3Wl@ep-shiny-block-adq81ttt-pooler.c-2.us-east-1.aws.neon.tech/ai_support_db?sslmode=require"
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma