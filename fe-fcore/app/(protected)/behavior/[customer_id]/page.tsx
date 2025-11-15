// src/app/(protected)/behavior/[customer_id]/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import BehaviorProfileCard from '../components/BehaviorProfileCard';
import { useBehaviorProfile } from '../hooks/useBehaviorProfile';

export default function BehaviorByCustomerPage({ params }: { params: { customer_id: string } }) {
  const toast = useRef<Toast>(null);
  const { profile, loading, fetchProfile } = useBehaviorProfile(params.customer_id);

  useEffect(() => {
    fetchProfile().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchProfile]);

  return (
    <div className="p-3">
      <Toast ref={toast} position="bottom-right" />
      {loading && <div className="text-600">Cargando perfil…</div>}
      {profile && <BehaviorProfileCard data={profile} />}
    </div>
  );
}
