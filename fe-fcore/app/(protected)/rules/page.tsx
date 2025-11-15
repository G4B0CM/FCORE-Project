// src/app/(protected)/rules/page.tsx
import { requireRole } from '@/lib/auth/server';

export default async function RulesPage() {
    await requireRole(['analyst', 'admin']);
    return (
        <div className="surface-card p-4 border-round shadow-1">
            <h2 className="text-2xl mb-2">Reglas</h2>
            <p>Base de gestión de reglas.</p>
        </div>
    );
}
