// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { loginBackend, setAuthCookies } from '@/services/auth.service';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const tokens = await loginBackend(username, password);
  await setAuthCookies(tokens);
  return NextResponse.json({ ok: true });
}
