// src/app/api/prescriptions/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

async function nextCode() {
  const count = await db.prescription.count();
  return `RX-${String(count + 8001).padStart(4, '0')}`;
}

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const prescriptions = await db.prescription.findMany({
    orderBy: { createdAt: 'desc' },
    include: { patient: { select: { firstName: true, lastName: true, patientCode: true } } },
  });
  return Response.json({ prescriptions });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const body = await req.json();
  const { patientId, drugs, doctorName, notes } = body;

  if (!patientId || !drugs) {
    return Response.json({ error: 'Patient and drugs are required' }, { status: 400 });
  }

  const prescription = await db.prescription.create({
    data: {
      rxCode: await nextCode(),
      patientId,
      prescribedById: auth.userId,
      doctorName: doctorName || auth.name,
      drugs,
      notes: notes || '',
      status: 'Pending',
    },
    include: { patient: { select: { firstName: true, lastName: true } } },
  });
  return Response.json({ prescription }, { status: 201 });
}
