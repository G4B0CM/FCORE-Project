// src/app/(protected)/customers/hooks/useCustomers.ts
'use client';

import { useCallback, useRef, useState } from 'react';
import type { CustomerResponse, CustomerCreate, CustomerUpdate } from '@/types/customer';

export function useCustomers() {
  const [rows, setRows] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const firstError = useRef<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/customers', { cache: 'no-store' });
      if (!r.ok) throw new Error('No se pudieron cargar los clientes');
      setRows(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: CustomerCreate) => {
    const r = await fetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo crear');
    return (await r.json()) as CustomerResponse;
  }, []);

  const update = useCallback(async (id: string, dto: CustomerUpdate) => {
    const r = await fetch(`/api/customers/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo actualizar');
    return (await r.json()) as CustomerResponse;
  }, []);

  const remove = useCallback(async (id: string) => {
    const r = await fetch(`/api/customers/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('No se pudo eliminar');
  }, []);

  return { rows, loading, fetchAll, create, update, remove, firstError };
}
