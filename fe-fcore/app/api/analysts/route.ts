// src/app/api/analysts/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const at = (await cookies()).get('fcore.at')?.value || '';
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analysts`, {
    headers: { Authorization: `Bearer ${at}` },
    cache: 'no-store',
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}

export async function POST(req: Request) {
  const at = (await cookies()).get('fcore.at')?.value || '';
  const dto = await req.json();
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analysts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${at}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
