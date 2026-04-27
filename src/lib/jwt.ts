// src/lib/jwt.ts
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dhs-secret-fallback';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/** Extract and verify the Bearer token from an Authorization header or cookie */
export function getAuthUser(request: Request): JwtPayload | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return verifyToken(authHeader.slice(7));
  }
  // Try cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/dhs_token=([^;]+)/);
    if (match) return verifyToken(match[1]);
  }
  return null;
}

export function unauthorised() {
  return Response.json({ error: 'Unauthorised' }, { status: 401 });
}
