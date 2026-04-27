// src/app/api/invoices/[id]/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  const { id } = await params;

  const body = await req.json();
  const invoice = await db.invoice.update({
    where: { id },
    data: {
      status: body.status,
      paid: body.paid !== undefined ? Number(body.paid) : undefined,
      services: body.services,
      amount: body.amount !== undefined ? Number(body.amount) : undefined,
    },
  });
  return Response.json({ invoice });
}
