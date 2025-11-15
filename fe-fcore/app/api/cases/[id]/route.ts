// src/app/api/cases/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const cookieStore = await cookies();
  const at = cookieStore.get('fcore.at')?.value ?? '';
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cases/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${at}` },
    cache: 'no-store',
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
