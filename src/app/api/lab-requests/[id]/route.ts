// src/app/api/lab-requests/[id]/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();
  const { id } = await params;

  const body = await req.json();
  const labRequest = await db.labRequest.update({
    where: { id },
    data: {
      status: body.status,
      result: body.result,
      priority: body.priority,
    },
  });
  return Response.json({ labRequest });
}
