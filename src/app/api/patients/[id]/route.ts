// src/app/api/patients/[id]/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  const { id } = await params;

  const patient = await db.patient.findUnique({ where: { id } });
  if (!patient) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ patient });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  const { id } = await params;

  const body = await req.json();
  const patient = await db.patient.update({
    where: { id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age !== undefined ? Number(body.age) : undefined,
      gender: body.gender,
      phone: body.phone,
      email: body.email,
      hmo: body.hmo,
      dept: body.dept,
      address: body.address,
      bloodGroup: body.bloodGroup,
      status: body.status,
    },
  });
  return Response.json({ patient });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  if (auth.role !== 'super_admin') {
    return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }
  const { id } = await params;
  await db.patient.delete({ where: { id } });
  return Response.json({ success: true });
}
