// ============================================================
// Authentication Utilities
// JWT-based session with HTTP-only cookies
// ============================================================

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './data/users';
import { UserPublic } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'kua-sampaga-secret-key-change-in-production-2026'
);

const COOKIE_NAME = 'kua-session';

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: UserPublic): Promise<string> {
  const payload: SessionPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserPublic }> {
  const user = await getUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Email atau password salah.' };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: 'Email atau password salah.' };
  }

  const userPublic: UserPublic = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  await createSession(userPublic);
  return { success: true, user: userPublic };
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return session;
}
