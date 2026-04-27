// src/app/api/admissions/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

async function nextCode() {
  const count = await db.admission.count();
  return `ADM-${String(count + 501).padStart(3, '0')}`;
}

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const admissions = await db.admission.findMany({
    where: { dischargedAt: null },
    orderBy: { admittedAt: 'desc' },
    include: { patient: { select: { firstName: true, lastName: true, patientCode: true } } },
  });
  return Response.json({ admissions });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const body = await req.json();
  const { patientId, ward, bed, doctorName, diagnosis } = body;

  if (!patientId || !ward || !bed) {
    return Response.json({ error: 'Patient, ward, and bed are required' }, { status: 400 });
  }

  const [admission] = await db.$transaction([
    db.admission.create({
      data: {
        admCode: await nextCode(),
        patientId,
        ward,
        bed,
        doctorName: doctorName || auth.name,
        diagnosis: diagnosis || '',
      },
      include: { patient: { select: { firstName: true, lastName: true } } },
    }),
    db.patient.update({
      where: { id: patientId },
      data: { status: 'Admitted' },
    }),
  ]);

  return Response.json({ admission }, { status: 201 });
}
