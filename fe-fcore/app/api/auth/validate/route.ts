// src/app/api/auth/validate/route.ts
import { NextResponse } from 'next/server';
import { validateToken } from '@/services/auth.service';

export async function GET() {
  try {
    const payload = await validateToken();
    return NextResponse.json({ status: 'ok', payload });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', detail: e?.message ?? 'unauthorized' }, { status: 401 });
  }
}
