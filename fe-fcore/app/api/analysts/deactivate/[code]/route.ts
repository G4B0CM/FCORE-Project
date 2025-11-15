import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

type Ctx = { params: Promise<{ code: string }> };

export async function POST(_: Request, ctx: Ctx) {
  const { code } = await ctx.params;
  const cookieStore = await cookies();
  const at = cookieStore.get('fcore.at')?.value ?? '';

  const r = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/analysts/deactivate/${encodeURIComponent(code)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${at}` },
      cache: 'no-store',
    }
  );

  const body = await r.text();
  return new NextResponse(body, {
    status: r.status,
    headers: { 'content-type': r.headers.get('content-type') || 'application/json' },
  });
}
