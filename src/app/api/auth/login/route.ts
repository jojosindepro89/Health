// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signToken } from '@/lib/jwt';

function makeCode(name: string) {
  return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
    const { password: _, ...safeUser } = user;
    const initials = makeCode(user.name);

    return Response.json({ user: { ...safeUser, initials }, token });
  } catch (err) {
    console.error('[login]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
