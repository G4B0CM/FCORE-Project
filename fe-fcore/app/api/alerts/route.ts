// src/app/api/alerts/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = url.searchParams.get('limit') ?? '100';
  const offset = url.searchParams.get('offset') ?? '0';
  const cookieStore = await cookies();
  const at = cookieStore.get('fcore.at')?.value ?? '';
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/alerts?limit=${limit}&offset=${offset}`, {
    headers: { Authorization: `Bearer ${at}` },
    cache: 'no-store',
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
