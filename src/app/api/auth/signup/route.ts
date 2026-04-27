// src/app/api/auth/signup/route.ts
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signToken } from '@/lib/jwt';

function makeCode(name: string) {
  return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function makePatientCode(count: number) {
  return `P-${String(count + 1).padStart(5, '0')}`;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, hospital, role } = await req.json();

    if (!name || !email || !password || !hospital) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed,
        hospital,
        role: role || 'front_desk',
      },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
    const { password: _, ...safeUser } = user;
    const initials = makeCode(user.name);

    const response = Response.json({ user: { ...safeUser, initials }, token }, { status: 201 });
    return response;
  } catch (err) {
    console.error('[signup]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
