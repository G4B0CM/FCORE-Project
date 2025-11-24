'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import AppButton from '@/components/ui/AppButton';
import BehaviorProfileCard from '../components/BehaviorProfileCard';
import BehaviorMiniDashboard from '../components/BehaviorMiniDashboard';

type Profile = {
  customer_id: string;
  avg_amount_24h: number | string;
  tx_count_10m: number;
  tx_count_30m: number;
  tx_count_24h: number;
  usual_country?: string | null;
  usual_ip?: string | null;
  usual_hour_band?: string | null;
  updated_at: string;
  customer?: { full_name: string; document_number: string } | null;
};

export default function BehaviorByCustomerClient({ customerId }: { customerId: string }) {
  const toast = useRef<Toast>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const ratio = useMemo(() => {
    if (!profile) return 1;
    const avg = Number(profile.avg_amount_24h || 0);
    if (!avg) return 1;
    return 1;
  }, [profile]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/behavior/${encodeURIComponent(customerId)}`, { cache: 'no-store' });
        if (!r.ok) {
          const maybe = await r.json().catch(() => ({}));
          throw new Error(maybe?.detail ?? 'No se encontró el perfil');
        }
        const data = (await r.json()) as Profile;
        setProfile(data);
      } catch (e: any) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [customerId]);

  return (
    <div className="p-3">
      <Toast ref={toast} position="bottom-right" />
      <div className="flex align-items-center justify-content-between mb-3">
        <h2 className="m-0 text-600">Perfil de comportamiento</h2>
        <div className="flex gap-2">
          <AppButton label="Refrescar" icon="pi pi-refresh" onClick={() => location.reload()} />
        </div>
      </div>

      {loading && <div className="text-600">Cargando…</div>}

      {profile && (
        <div className="flex flex-column gap-3">
          <BehaviorProfileCard data={{ ...profile, avg_amount_24h: Number(profile.avg_amount_24h) }} />
          <BehaviorMiniDashboard
            avg_amount_24h={Number(profile.avg_amount_24h || 0)}
            tx_count_10m={profile.tx_count_10m}
            tx_count_30m={profile.tx_count_30m}
            tx_count_24h={profile.tx_count_24h}
            amount_ratio_vs_avg={ratio}
          />
        </div>
      )}
    </div>
  );
}
