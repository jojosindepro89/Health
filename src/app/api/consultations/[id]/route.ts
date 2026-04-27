// src/app/api/consultations/[id]/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  const { id } = await params;

  const body = await req.json();
  const consultation = await db.consultation.update({
    where: { id },
    data: {
      status: body.status,
      diagnosis: body.diagnosis,
      notes: body.notes,
      priority: body.priority,
      doctorName: body.doctorName,
    },
  });
  return Response.json({ consultation });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  const { id } = await params;
  await db.consultation.delete({ where: { id } });
  return Response.json({ success: true });
}
