// src/app/api/auth/me/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const user = await db.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, name: true, email: true, role: true, hospital: true, createdAt: true },
  });
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  return Response.json({ user });
}
