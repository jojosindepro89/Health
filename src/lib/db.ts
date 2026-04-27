// src/lib/db.ts
// Singleton Prisma client with better-sqlite3 driver adapter (Prisma v7)
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

import path from 'path';
import fs from 'fs';

function createClient() {
  let dbPath = './dev.db';

  if (process.env.VERCEL) {
    dbPath = '/tmp/dev.db';
    if (!fs.existsSync(dbPath)) {
      try {
        const sourcePath = path.join(process.cwd(), 'dev.db');
        if (fs.existsSync(sourcePath)) fs.copyFileSync(sourcePath, dbPath);
      } catch (e) {
        console.error('Failed to copy db to tmp:', e);
      }
    }
  }

  const url = process.env.DATABASE_URL || `file:${dbPath}`;
  const adapter = new PrismaBetterSqlite3({ url } as any);
  return new PrismaClient({ adapter } as any);
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
