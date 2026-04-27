// src/app/api/invoices/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

async function nextCode() {
  const count = await db.invoice.count();
  return `INV-${String(count + 3001).padStart(4, '0')}`;
}

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const invoices = await db.invoice.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      patient: { select: { firstName: true, lastName: true, patientCode: true } },
      printLogs: { orderBy: { createdAt: 'desc' } },
    },
  });
  return Response.json({ invoices });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const body = await req.json();
  const { patientId, services, amount, hmo, status, paid } = body;

  if (!patientId || !services || amount === undefined) {
    return Response.json({ error: 'Required fields missing' }, { status: 400 });
  }

  const invoice = await db.invoice.create({
    data: {
      invCode: await nextCode(),
      patientId,
      services,
      amount: Number(amount),
      hmo: hmo || 'Self Pay',
      status: status || 'Pending',
      paid: Number(paid) || 0,
    },
    include: { patient: { select: { firstName: true, lastName: true } } },
  });
  return Response.json({ invoice }, { status: 201 });
}
