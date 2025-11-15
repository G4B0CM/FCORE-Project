// src/app/(protected)/layout.tsx
import ClientShell from '@/components/layout/ClientShell';
import { requireAuth } from '@/lib/auth/server';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { payload } = await requireAuth();
    const rolesRaw = (payload?.roles ?? (payload?.role ? [payload.role] : [])) as string[];
    const roles = rolesRaw && rolesRaw.length > 0 ? rolesRaw : []; // fallback vacío: sidebar mostrará todo
    const username = (payload?.username ?? payload?.sub ?? '') as string;

    return (
        <ClientShell roles={roles} username={username || null}>
            {children}
        </ClientShell>
    );
}
