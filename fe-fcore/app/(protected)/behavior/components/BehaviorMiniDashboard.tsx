// src/app/(protected)/behavior/components/BehaviorMiniDashboard.tsx
'use client';

import AppChart from '@/components/ui/AppChart';

type Props = {
  avg_amount_24h: number;
  tx_count_10m: number;
  tx_count_30m: number;
  tx_count_24h: number;
  amount_ratio_vs_avg?: number;
};

export default function BehaviorMiniDashboard({ avg_amount_24h, tx_count_10m, tx_count_30m, tx_count_24h, amount_ratio_vs_avg }: Props) {
  const barData = {
    labels: ['10m', '30m', '24h'],
    datasets: [
      {
        label: 'TX',
        backgroundColor: '#3B82F6',
        data: [tx_count_10m, tx_count_30m, tx_count_24h],
        borderRadius: 12,
      },
    ],
  };

  const barOptions = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
    maintainAspectRatio: false,
  };

  const ratio = typeof amount_ratio_vs_avg === 'number' ? amount_ratio_vs_avg : 1;
  const doughnutData = {
    labels: ['Promedio 24h', 'Monto actual vs prom.'],
    datasets: [
      {
        data: [1, ratio],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '60%',
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-8">
        <div className="surface-card p-3 border-round shadow-1" style={{ height: 260 }}>
          <div className="text-600 mb-2">Actividad</div>
          <AppChart type="bar" data={barData} options={barOptions} />
        </div>
      </div>
      <div className="col-12 md:col-4">
        <div className="surface-card p-3 border-round shadow-1" style={{ height: 260 }}>
          <div className="text-600 mb-2">Ratio monto/prom.</div>
          <AppChart type="doughnut" data={doughnutData} options={doughnutOptions} />
          <div className="mt-2 text-center">
            <span className="text-600">Promedio 24h: </span>
            <span className="font-semibold">${Number(avg_amount_24h).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
