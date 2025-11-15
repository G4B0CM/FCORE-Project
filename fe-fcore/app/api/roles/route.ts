// src/app/api/roles/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const at = (await cookies()).get('fcore.at')?.value || '';
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/roles`, {
    headers: { Authorization: `Bearer ${at}` },
    cache: 'no-store',
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
