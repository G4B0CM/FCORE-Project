// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireToken } from './lib/auth/guards';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/(protected)') || req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/transactions') || req.nextUrl.pathname.startsWith('/rules') || req.nextUrl.pathname.startsWith('/customers') || req.nextUrl.pathname.startsWith('/cards') || req.nextUrl.pathname.startsWith('/analysts')) {
    const redirect = requireToken(req);
    if (redirect) return redirect;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|static|images|favicon.ico).*)'],
};
