// src/lib/auth/server.ts
import { cookies } from 'next/headers';
import { ACCESS_COOKIE } from './cookies';
import type { TokenPayload } from '@/types/auth';

export async function requireAuth() {
  const at = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!at) {
    return { ok: false as const, payload: null, redirectTo: '/login' };
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${at}` },
    cache: 'no-store',
  });
  if (!res.ok) return { ok: false as const, payload: null, redirectTo: '/login' };
  const payload = (await res.json()) as TokenPayload;
  return { ok: true as const, payload };
}

export async function requireRole(role: 'admin' | 'analyst') {
  const auth = await requireAuth();
  if (!auth.ok || !auth.payload) return { ok: false as const, redirectTo: '/login' };
  const r = (auth.payload.role || '').toLowerCase();
  if (role === 'admin' && r !== 'admin') return { ok: false as const, redirectTo: '/(protected)/acceso-denegado' };
  return { ok: true as const, payload: auth.payload };
}
