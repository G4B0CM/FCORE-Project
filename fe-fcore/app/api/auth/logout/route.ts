// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/services/auth.service';

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
