// src/app/api/consultations/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

async function nextCode() {
  const count = await db.consultation.count();
  return `C-${String(count + 1001).padStart(4, '0')}`;
}

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const consultations = await db.consultation.findMany({
    orderBy: { createdAt: 'desc' },
    include: { patient: { select: { firstName: true, lastName: true, patientCode: true } } },
  });
  return Response.json({ consultations });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const body = await req.json();
  const { patientId, doctorName, dept, complaint, priority } = body;

  if (!patientId || !doctorName || !dept || !complaint) {
    return Response.json({ error: 'Required fields missing' }, { status: 400 });
  }

  const consultation = await db.consultation.create({
    data: {
      consultCode: await nextCode(),
      patientId,
      doctorId: auth.userId,
      doctorName,
      dept,
      complaint,
      diagnosis: body.diagnosis || '',
      notes: body.notes || '',
      priority: priority || 'Normal',
      status: 'Waiting',
    },
    include: { patient: { select: { firstName: true, lastName: true } } },
  });
  return Response.json({ consultation }, { status: 201 });
}
