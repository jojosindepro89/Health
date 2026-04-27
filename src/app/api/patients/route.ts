// src/app/api/patients/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

async function nextCode() {
  const count = await db.patient.count();
  return `P-${String(count + 1).padStart(5, '0')}`;
}

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const patients = await db.patient.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return Response.json({ patients });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const body = await req.json();
  const { firstName, lastName, age, gender, phone, email, hmo, dept, address, bloodGroup, status } = body;

  if (!firstName || !lastName || !phone || !dept) {
    return Response.json({ error: 'Required fields missing' }, { status: 400 });
  }

  const patient = await db.patient.create({
    data: {
      patientCode: await nextCode(),
      firstName,
      lastName,
      age: Number(age) || 0,
      gender: gender || 'M',
      phone,
      email: email || '',
      hmo: hmo || 'Self Pay',
      dept,
      address: address || '',
      bloodGroup: bloodGroup || 'O+',
      status: status || 'Active',
    },
  });

  return Response.json({ patient }, { status: 201 });
}
