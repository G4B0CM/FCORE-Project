// src/app/api/auth/refresh/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { REFRESH_COOKIE } from '@/lib/auth/cookies';
import { apiClient } from '@/services/apiClient';
import { setAuthCookies } from '@/services/auth.service';
import type { TokenResponse } from '@/types/auth';

export async function POST() {
  const rt = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (!rt) return NextResponse.json({ detail: 'missing refresh token' }, { status: 401 });
  const tokens = await apiClient.post<TokenResponse, { refresh_token: string }>('/auth/refresh', { refresh_token: rt });
  await setAuthCookies(tokens);
  return NextResponse.json({ ok: true });
}
