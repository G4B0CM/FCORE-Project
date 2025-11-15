// src/app/(protected)/merchants/hooks/useMerchants.ts
'use client';

import { useCallback, useRef, useState } from 'react';
import type { MerchantResponse, MerchantCreate, MerchantUpdate } from '@/types/merchant';

export function useMerchants() {
  const [rows, setRows] = useState<MerchantResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const firstError = useRef<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/merchants', { cache: 'no-store' });
      if (!r.ok) throw new Error('No se pudieron cargar los comercios');
      setRows(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: MerchantCreate) => {
    const r = await fetch('/api/merchants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo crear');
    return (await r.json()) as MerchantResponse;
  }, []);

  const update = useCallback(async (id: string, dto: MerchantUpdate) => {
    const r = await fetch(`/api/merchants/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo actualizar');
    return (await r.json()) as MerchantResponse;
  }, []);

  const remove = useCallback(async (id: string) => {
    const r = await fetch(`/api/merchants/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('No se pudo eliminar');
  }, []);

  return { rows, loading, fetchAll, create, update, remove, firstError };
}
