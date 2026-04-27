// src/app/api/print-logs/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

async function nextCode() {
  const count = await db.printLog.count();
  return `PRN-${String(count + 1).padStart(4, '0')}`;
}

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  if (auth.role !== 'super_admin') return Response.json({ error: 'Admin only' }, { status: 403 });

  const logs = await db.printLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      printedBy: { select: { name: true } },
      invoice: { select: { invCode: true } },
    },
  });
  return Response.json({ logs });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const { invoiceId } = await req.json();
  if (!invoiceId) return Response.json({ error: 'invoiceId is required' }, { status: 400 });

  const log = await db.printLog.create({
    data: {
      logCode: await nextCode(),
      invoiceId,
      printedById: auth.userId,
    },
  });
  return Response.json({ log }, { status: 201 });
}
