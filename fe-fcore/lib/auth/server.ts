import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authService } from '@/services/auth.service';
import type { TokenPayload } from '@/types/auth';

export async function getServerToken(): Promise<string | null> {
    const store = await cookies();
    const token = store.get('token')?.value ?? null;
    return token;
}

export async function requireAuth(): Promise<{ token: string; payload: TokenPayload | null }> {
    const token = await getServerToken();
    if (!token) redirect('/login');
    try {
        const validated = await authService.validate(token);
        if ((validated as any)?.status !== 'ok') redirect('/login');
        return { token: token as string, payload: (validated as any).payload ?? null };
    } catch {
        redirect('/login');
    }
}

export async function requireRole(roles: string[]) {
    const { payload } = await requireAuth();
    const userRoles = payload?.roles ?? (payload?.role ? [payload.role] : []);
    const allowed = roles.length === 0 || userRoles.some((r) => roles.includes(r));
    if (!allowed) redirect('/acceso-denegado');
}
