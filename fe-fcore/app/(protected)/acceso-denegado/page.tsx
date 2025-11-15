// src/app/(protected)/acceso-denegado/page.tsx
export default function AccessDeniedPage() {
    return (
        <div className="flex min-h-screen align-items-center justify-content-center p-6">
            <div className="surface-card p-5 border-round shadow-2 text-center">
                <i className="pi pi-lock text-4xl mb-3" />
                <h2 className="text-2xl mb-2">Acceso denegado</h2>
                <p>No tienes permisos para esta sección.</p>
            </div>
        </div>
    );
}
