// src/app/(protected)/scoring/hooks/useScoring.ts
'use client';

import { useCallback, useState } from 'react';
import type { ScoringResponse } from '@/types/scoring';

export type ScoreForm = {
  customer_id: string;
  merchant_id: string;
  amount: number;
  channel: string;
  device_id?: string | null;
  ip_address?: string | null;
  country?: string | null;
};

export function useScoring() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoringResponse | null>(null);

  const score = useCallback(async (dto: ScoreForm) => {
    setLoading(true);
    try {
      const r = await fetch('/api/scoring/score-transaction', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo ejecutar scoring');
      const data = (await r.json()) as ScoringResponse;
      setResult(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, score, setResult };
}
