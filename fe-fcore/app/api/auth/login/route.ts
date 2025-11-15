// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { loginBackend, setAuthCookies } from '@/services/auth.service';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const tokens = await loginBackend(username, password);
    await setAuthCookies(tokens);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = typeof e?.status === 'number' ? e.status : 500;
    const msg = e?.message || 'Error de autenticación';
    return NextResponse.json({ detail: msg }, { status });
  }
}
