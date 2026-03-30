// src/app/(protected)/dashboard/components/FraudMoneyChart.tsx
'use client';

import AppChart from '@/components/ui/AppChart';

type Props = {
  fraudAmount: number;
  totalAmount: number;
};

export default function FraudMoneyChart({ fraudAmount, totalAmount }: Props) {
  const safeTotal = Math.max(totalAmount, 0.00001);
  const data = {
    labels: ['Fraude', 'No fraude'],
    datasets: [
      {
        data: [fraudAmount, Math.max(safeTotal - fraudAmount, 0)],
        backgroundColor: ['#EF4444', '#10B981'],
        borderWidth: 0,
      },
    ],
  };
  const options = { cutout: '65%', plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false };
  const ratio = fraudAmount / safeTotal;

  return (
    <div className="surface-card p-4 border-round shadow-1" style={{ height: 360 }}>
      <div className="flex align-items-center justify-content-between mb-2">
        <h3 className="m-0 text-600">Dinero confirmado como fraude</h3>
        <div className="text-600">Fraude / Total: {(ratio * 100).toFixed(2)}%</div>
      </div>
      <AppChart type="doughnut" data={data} options={options} />
    </div>
  );
}
