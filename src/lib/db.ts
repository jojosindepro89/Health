// src/lib/db.ts
// Singleton Prisma client with better-sqlite3 driver adapter (Prisma v7)
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  // DATABASE_URL should be file:./dev.db (relative to project root, set in .env)
  const url = process.env.DATABASE_URL || 'file:./dev.db';
  const adapter = new PrismaBetterSqlite3({ url } as any);
  return new PrismaClient({ adapter } as any);
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
