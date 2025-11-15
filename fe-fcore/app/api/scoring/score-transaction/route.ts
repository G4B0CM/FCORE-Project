// src/app/api/scoring/score-transaction/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const dto = await req.json();
  const cookieStore = await cookies();
  const at = cookieStore.get('fcore.at')?.value ?? '';
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/scoring/score-transaction`, {
    method: 'POST',
    headers: { ...(at ? { Authorization: `Bearer ${at}` } : {}), 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    cache: 'no-store',
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
