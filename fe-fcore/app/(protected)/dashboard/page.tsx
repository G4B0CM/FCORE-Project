// src/app/(protected)/dashboard/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import DashboardKpis from './components/DashboardKpis';
import FraudMoneyChart from './components/FraudMoneyChart';
import TopRulesChart from './components/TopRulesChart';
import MerchantsDeclinedChart from './components/MerchantsDeclinedChart';
import AppButton from '@/components/ui/AppButton';

type Tx = {
  id: string;
  amount: number;
  occurred_at?: string;
  merchant_id?: string;
  status?: string;      // opcional si tu schema lo expone
  decision?: string;    // opcional
};

type Alert = {
  id: string;
  action: 'ALLOW' | 'CHALLENGE' | 'DENY' | 'REVIEW' | string;
  final_score?: number | null;
  created_at?: string;
  transaction?: {
    id?: string;
    merchant_id?: string;
    amount?: number;
  } | null;
  rule_hits?: any;
};

type Rule = { id: string; name: string; severity: string };
type Merchant = { id: string; name: string };

export default function DashboardPage() {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  async function loadAll() {
    setLoading(true);
    try {
      const [txRes, alertRes, rulesRes, merchRes] = await Promise.all([
        fetch('/api/transactions?limit=100&offset=0', { cache: 'no-store' }),
        fetch('/api/alerts?limit=500&offset=0', { cache: 'no-store' }),
        fetch('/api/rules', { cache: 'no-store' }),
        fetch('/api/merchants', { cache: 'no-store' }),
      ]);
      if (!txRes.ok) throw new Error('No se pudieron cargar transacciones');
      if (!alertRes.ok) throw new Error('No se pudieron cargar alertas');
      if (!rulesRes.ok) throw new Error('No se pudieron cargar reglas');
      if (!merchRes.ok) throw new Error('No se pudieron cargar comercios');
      setTxs(await txRes.json());
      setAlerts(await alertRes.json());
      setRules(await rulesRes.json());
      setMerchants(await merchRes.json());
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2600 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const totalAmount = useMemo(
    () => txs.reduce((acc, t) => acc + Number(t.amount || 0), 0),
    [txs]
  );

  const fraudAmount = useMemo(() => {
    // Tomamos alertas con action DENY y sumamos monto de su transacción
    return alerts
      .filter(a => String(a.action).toUpperCase() === 'DECLINE')
      .reduce((acc, a) => acc + Number(a.transaction?.amount || 0), 0);
  }, [alerts]);

  const approvalRate = useMemo(() => {
    // Aprobación ~ 1 - (denegadas / total con decisión)
    const denied = alerts.filter(a => String(a.action).toUpperCase() === 'DECLINE').length;
    const decided = alerts.length; // si hay CHALLENGE/REVIEW, ajusta según tu definición
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
    // rule_hits puede venir como {hits: [{rule_name:..}, ...]} o como array directo
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
    // intenta mapear id->name si vienen como IDs
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
            <AppButton label="Refrescar" icon="pi pi-refresh" onClick={loadAll} loading={loading} />
          </div>
        </div>
      </div>
      <div className='col-8'>
        <div className='grid'>
          <div className="col-12">
            <DashboardKpis approvalRate={approvalRate} last7dAmount={last7dAmount} />
          </div>
          <div className="col-12">
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
