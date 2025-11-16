// src/services/auth.service.ts
'use server';

import { cookies, headers } from 'next/headers';
import { apiClient } from './apiClient';
import { ACCESS_COOKIE, REFRESH_COOKIE, TOKEN_HEADER, cookieOpts } from '@/lib/auth/cookies';
import type { TokenResponse, TokenPayload } from '@/types/auth';

export async function loginBackend(username: string, password: string): Promise<TokenResponse> {
  const qs = new URLSearchParams({ username, password }).toString();
  const path = `/auth/login?${qs}`;
  const res = await apiClient.post<TokenResponse, undefined>(path, undefined as unknown as undefined, { credentials: 'include' });
  return res;
}

export async function setAuthCookies(tokens: TokenResponse) {
  const cs = await cookies();
  const opts = cookieOpts();
  cs.set(ACCESS_COOKIE, tokens.access_token, opts);
  cs.set(REFRESH_COOKIE, tokens.refresh_token, opts);
}

export async function clearAuthCookies() {
  const cs = await cookies();
  cs.delete(ACCESS_COOKIE);
  cs.delete(REFRESH_COOKIE);
}

export async function validateToken(): Promise<TokenPayload> {
  const cs = await cookies();
  const at = cs.get(ACCESS_COOKIE)?.value ?? '';
  const h = new Headers(await headers());
  h.set(TOKEN_HEADER, `Bearer ${at}`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate`, {
    method: 'GET',
    headers: h,
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Token inválido');
  }
  return (await res.json()) as TokenPayload;
}
