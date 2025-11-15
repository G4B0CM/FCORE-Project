// src/app/api/oficials/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function POST(req: NextRequest) {
    const { q_code, name, lastname, password, rolId } = await req.json();
    const store = await cookies();
    const token = store.get('token')?.value;

    if (!q_code || !name || !lastname || !password || !rolId) {
        return NextResponse.json({ detail: 'Datos incompletos' }, { status: 400 });
    }
    if (!token) {
        return NextResponse.json({ detail: 'No autenticado' }, { status: 401 });
    }

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const createRes = await fetch(`${BASE_URL}/oficial/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ q_code, name, lastname, password }),
    });

    const isJsonCreate = createRes.headers.get('content-type')?.includes('application/json');
    const created = isJsonCreate ? await createRes.json() : null;

    if (!createRes.ok) {
        const detail = created?.detail ?? createRes.statusText;
        return NextResponse.json({ detail }, { status: createRes.status });
    }

    const id = created?.id ?? created?._id;
    if (!id) {
        return NextResponse.json({ detail: 'No se obtuvo ID del oficial creado' }, { status: 500 });
    }

    const assignRes = await fetch(`${BASE_URL}/oficial/${id}/roles/${rolId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
    });

    const isJsonAssign = assignRes.headers.get('content-type')?.includes('application/json');
    const assigned = isJsonAssign ? await assignRes.json() : null;

    if (!assignRes.ok) {
        const detail = assigned?.detail ?? assignRes.statusText;
        return NextResponse.json({ detail: `Rol no asignado: ${detail}` }, { status: assignRes.status });
    }

    return NextResponse.json({ created, assigned });
}
