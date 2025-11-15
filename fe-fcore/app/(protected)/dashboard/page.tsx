// src/app/(protected)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="grid">
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-card p-4 border-round shadow-1">
          <div className="text-600 mb-2">Volumen mensual</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-card p-4 border-round shadow-1">
          <div className="text-600 mb-2">Aprobación</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
      </div>
    </div>
  );
}
