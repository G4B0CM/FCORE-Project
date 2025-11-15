import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
        const detail = (data as any)?.detail ?? res.statusText;
        return NextResponse.json({ detail }, { status: res.status });
    }

    const token =
        (data as any)?.Result?.token ??
        (data as any)?.token ??
        null;

    if (!token) {
        return NextResponse.json({ detail: 'Token no encontrado en la respuesta del backend.' }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true, username: (data as any)?.Result?.username ?? username });
    response.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60,
    });
    return response;
}
