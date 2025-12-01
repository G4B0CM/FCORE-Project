// src/app/(protected)/dashboard/components/TopRulesChart.tsx
'use client';

import AppChart from '@/components/ui/AppChart';

type RuleHitAgg = { rule: string; count: number };

export default function TopRulesChart({ items }: { items: RuleHitAgg[] }) {
  const top = items.slice(0, 10);
  const data = {
    labels: top.map(i => i.rule),
    datasets: [
      {
        label: 'Disparos',
        data: top.map(i => i.count),
        backgroundColor: '#6366F1',
        borderRadius: 12,
      },
    ],
  };
  const options = {
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } },
    maintainAspectRatio: false,
  };

  return (
    <div className="surface-card p-4 border-round shadow-1" >
      <h3 className="m-0 mb-2 text-600">Reglas que más se dispararon</h3>
      <AppChart type="bar" data={data} options={options} />
    </div>
  );
}
