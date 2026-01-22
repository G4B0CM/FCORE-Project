import { useCallback, useState } from "react";

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


export function useDashboard () {
    const [loading, setLoading] = useState(false);
      const [txs, setTxs] = useState<Tx[]>([]);
      const [alerts, setAlerts] = useState<Alert[]>([]);
      const [rules, setRules] = useState<Rule[]>([]);
      const [merchants, setMerchants] = useState<Merchant[]>([]);


    const loadData = useCallback(async function loadAll() {
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
          throw e;
        } finally {
          setLoading(false);
        }
      }, []);

    return {
        txs,
        alerts,
        rules,
        merchants,
        loading,
        loadData
    }
}