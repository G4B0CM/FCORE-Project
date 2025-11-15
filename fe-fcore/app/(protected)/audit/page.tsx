// src/app/(protected)/audit/page.tsx
import { requireRole } from '@/lib/auth/server';

export default async function AuditPage() {
    await requireRole(['analyst', 'admin']);
    return (
        <div className="surface-card p-4 border-round shadow-1">
            <h2 className="text-2xl mb-2">Auditoría</h2>
            <p>Base de auditoría de decisiones.</p>
        </div>
    );
}
