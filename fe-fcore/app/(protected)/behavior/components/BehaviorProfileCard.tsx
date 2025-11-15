// src/app/(protected)/behavior/components/BehaviorProfileCard.tsx
'use client';

import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

type Props = {
  data: {
    avg_amount_24h: number;
    tx_count_10m: number;
    tx_count_30m: number;
    tx_count_24h: number;
    usual_country?: string | null;
    usual_ip?: string | null;
    usual_hour_band?: string | null;
    customer?: { full_name: string; document_number: string } | null;
    updated_at: string;
  };
};

export default function BehaviorProfileCard({ data }: Props) {
  return (
    <Card className="border-round-2xl shadow-2">
      <div className="flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="m-0">{data.customer?.full_name ?? 'Cliente'}</h3>
          <small className="text-600">Doc: {data.customer?.document_number ?? '—'}</small>
        </div>
        <Tag value={new Date(data.updated_at).toLocaleString()} severity="secondary" />
      </div>
      <div className="grid">
        <div className="col-12 md:col-3">
          <div className="surface-card p-3 border-round shadow-1">
            <div className="text-600 mb-1">Promedio 24h</div>
            <div className="text-2xl font-bold">${Number(data.avg_amount_24h).toFixed(2)}</div>
          </div>
        </div>
        <div className="col-12 md:col-3">
          <div className="surface-card p-3 border-round shadow-1">
            <div className="text-600 mb-1">TX 10m</div>
            <div className="text-2xl font-bold">{data.tx_count_10m}</div>
          </div>
        </div>
        <div className="col-12 md:col-3">
          <div className="surface-card p-3 border-round shadow-1">
            <div className="text-600 mb-1">TX 30m</div>
            <div className="text-2xl font-bold">{data.tx_count_30m}</div>
          </div>
        </div>
        <div className="col-12 md:col-3">
          <div className="surface-card p-3 border-round shadow-1">
            <div className="text-600 mb-1">TX 24h</div>
            <div className="text-2xl font-bold">{data.tx_count_24h}</div>
          </div>
        </div>
      </div>
      <div className="grid mt-2">
        <div className="col-12 md:col-4">
          <div className="surface-card p-3 border-round shadow-1">
            <div className="text-600 mb-1">País usual</div>
            <div className="text-xl">{data.usual_country ?? '—'}</div>
          </div>
        </div>
        <div className="col-12 md:col-4">
          <div className="surface-card p-3 border-round shadow-1">
            <div className="text-600 mb-1">IP usual</div>
            <div className="text-xl">{data.usual_ip ?? '—'}</div>
          </div>
        </div>
        <div className="col-12 md:col-4">
          <div className="surface-card p-3 border-round shadow-1">
            <div className="text-600 mb-1">Franja horaria usual</div>
            <div className="text-xl">{data.usual_hour_band ?? '—'}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
