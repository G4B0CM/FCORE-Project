// src/app/(protected)/transactions/hooks/useTransactions.ts
'use client';

import { useCallback, useState } from 'react';
import type { TransactionResponse, TransactionCreate } from '@/types/transaction';

export function useTransactions() {
  const [rows, setRows] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/transactions?limit=${limit}&offset=${offset}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('No se pudieron cargar las transacciones');
      setRows(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: TransactionCreate) => {
    const r = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo registrar');
    return (await r.json()) as TransactionResponse;
  }, []);

  return { rows, loading, fetchAll, create };
}
