// src/lib/auth/guards.ts
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE } from './cookies';
export function requireToken(req: NextRequest) {
  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.redirect(new URL('/login?redirectTo=' + encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search), req.url));
  return null;
}
