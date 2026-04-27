// src/app/api/admissions/[id]/discharge/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  const { id } = await params;

  const admission = await db.admission.findUnique({ where: { id } });
  if (!admission) return Response.json({ error: 'Admission not found' }, { status: 404 });

  await db.$transaction([
    db.admission.update({
      where: { id },
      data: { dischargedAt: new Date() },
    }),
    db.patient.update({
      where: { id: admission.patientId },
      data: { status: 'Discharged' },
    }),
  ]);

  return Response.json({ success: true });
}
