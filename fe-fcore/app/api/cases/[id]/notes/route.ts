// src/app/api/cases/[id]/notes/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const dto = await req.json();
  const cookieStore = await cookies();
  const at = cookieStore.get('fcore.at')?.value ?? '';
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cases/${encodeURIComponent(id)}/notes`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${at}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    cache: 'no-store',
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}
