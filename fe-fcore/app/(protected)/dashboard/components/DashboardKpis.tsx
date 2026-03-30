// src/app/(protected)/dashboard/components/DashboardKpis.tsx
'use client';

type Props = {
  approvalRate: number;
  last7dAmount: number;
};

export default function DashboardKpis({ approvalRate, last7dAmount }: Props) {
  return (
    <div className="grid">
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-card p-4 border-round shadow-1">
          <div className="text-600 mb-2">Tasa de aprobación</div>
          <div className="text-2xl font-semibold">{(approvalRate * 100).toFixed(1)}%</div>
        </div>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-card p-4 border-round shadow-1">
          <div className="text-600 mb-2">Volumen últimos 7 días</div>
          <div className="text-2xl font-semibold">${last7dAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  );
}
