// src/app/(protected)/dashboard/components/MerchantsDeclinedChart.tsx
'use client';

import AppChart from '@/components/ui/AppChart';

type Item = { merchant: string; count: number };

export default function MerchantsDeclinedChart({ items }: { items: Item[] }) {
  const top = items.slice(0, 10);
  const data = {
    labels: top.map(i => i.merchant),
    datasets: [
      {
        label: 'Denegadas',
        data: top.map(i => i.count),
        backgroundColor: '#F59E0B',
        borderRadius: 12,
      },
    ],
  };
  const options = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
    maintainAspectRatio: false,
  };

  return (
    <div className="surface-card p-4 border-round shadow-1" style={{ height: 360 }}>
      <h3 className="m-0 mb-2 text-600">Comercios con más transacciones denegadas</h3>
      <AppChart type="bar" data={data} options={options} />
    </div>
  );
}
