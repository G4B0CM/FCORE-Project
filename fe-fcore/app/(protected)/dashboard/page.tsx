// src/app/(protected)/dashboard/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import DashboardKpis from './components/DashboardKpis';
import FraudMoneyChart from './components/FraudMoneyChart';
import TopRulesChart from './components/TopRulesChart';
import MerchantsDeclinedChart from './components/MerchantsDeclinedChart';
import AppButton from '@/components/ui/AppButton';
import { useRouter } from 'next/navigation';
import { useDashboard } from './hooks/useDashboard';

export default function DashboardPage() {
  const router = useRouter()
  const toast = useRef<Toast>(null);
  const {loadData, txs, alerts,rules,merchants, loading} = useDashboard()

  

  useEffect(() => {
    loadData().catch((e: any) => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2600 });
    });
  }, [loadData]);

  const totalAmount = useMemo(
    () => txs.reduce((acc, t) => acc + Number(t.amount || 0), 0),
    [txs]
  );

  const fraudAmount = useMemo(() => {
    return alerts
      .filter(a => String(a.action).toUpperCase() === 'DECLINE')
      .reduce((acc, a) => acc + Number(a.transaction?.amount || 0), 0);
  }, [alerts]);

  const approvalRate = useMemo(() => {
    const denied = alerts.filter(a => String(a.action).toUpperCase() === 'DECLINE').length;
    const decided = alerts.length;
    if (!decided) return 1;
    return Math.max(0, 1 - denied / decided);
  }, [alerts]);

  const last7dAmount = useMemo(() => {
    const now = Date.now();
    const seven = 7 * 24 * 60 * 60 * 1000;
    return txs
      .filter(t => (t.occurred_at ? now - new Date(t.occurred_at).getTime() <= seven : false))
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  }, [txs]);

  const ruleAgg = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of alerts) {
      const rh = Array.isArray(a.rule_hits) ? a.rule_hits : a.rule_hits?.hits;
      if (!rh || !Array.isArray(rh)) continue;
      for (const h of rh) {
        const key = String(h.rule_name || h.rule_id || 'desconocida');
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    const arr = Array.from(counts.entries()).map(([rule, count]) => ({ rule, count }));
    const nameMap = new Map(rules.map(r => [r.id, r.name]));
    return arr.map(x => ({ rule: nameMap.get(x.rule) || x.rule, count: x.count })).sort((a, b) => b.count - a.count);
  }, [alerts, rules]);

  const merchDeclined = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of alerts) {
      if (String(a.action).toUpperCase() !== 'DECLINE') continue;
      const id = a.transaction?.merchant_id || 'desconocido';
      counts.set(String(id), (counts.get(String(id)) || 0) + 1);
    }
    const nameMap = new Map(merchants.map(m => [m.id, m.name]));
    return Array.from(counts.entries())
      .map(([id, count]) => ({ merchant: nameMap.get(id) || id, count }))
      .sort((a, b) => b.count - a.count);
  }, [alerts, merchants]);

  return (
    <div className="grid nested-grid">
      <Toast ref={toast} position="bottom-right" />

      <div className="col-12">
        <div className="flex align-items-center justify-content-between mb-3">
          <h2 className="m-0 text-600">Dashboard</h2>
          <div className="flex gap-2">
            <AppButton label="Refrescar" icon="pi pi-refresh" onClick={loadData} loading={loading} />
          </div>
        </div>
      </div>
      <div className='col-8'>
        <div className='grid'>
          <div className="col-12">
            
            <DashboardKpis approvalRate={approvalRate} last7dAmount={last7dAmount} />
          </div>
          <div className="col-12 flex w-full gap-4 p-4">
            <AppButton isOutlined icon="pi pi-send" onClick={() => router.push("/rules")} loading={loading} />
            <TopRulesChart items={ruleAgg} />
          </div>
          
        </div>
      </div>
        <div className="col-4 ">
              <FraudMoneyChart fraudAmount={fraudAmount} totalAmount={totalAmount} />
        </div>
        <div className="col-12 ">
          <MerchantsDeclinedChart items={merchDeclined} />
        </div>
    </div>
  );
}
