// src/app/api/lab-requests/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

async function nextCode() {
  const count = await db.labRequest.count();
  return `LR-${String(count + 2001).padStart(4, '0')}`;
}

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const labRequests = await db.labRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: { patient: { select: { firstName: true, lastName: true, patientCode: true } } },
  });
  return Response.json({ labRequests });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const body = await req.json();
  const { patientId, test, dept, priority } = body;

  if (!patientId || !test || !dept) {
    return Response.json({ error: 'Required fields missing' }, { status: 400 });
  }

  const labRequest = await db.labRequest.create({
    data: {
      labCode: await nextCode(),
      patientId,
      requestedById: auth.userId,
      requestedByName: body.requestedByName || auth.name,
      test,
      dept,
      priority: priority || 'Routine',
      status: 'Pending',
    },
    include: { patient: { select: { firstName: true, lastName: true } } },
  });
  return Response.json({ labRequest }, { status: 201 });
}
