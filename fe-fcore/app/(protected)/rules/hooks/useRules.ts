// src/app/(protected)/rules/hooks/useRules.ts
'use client';

import { useCallback, useState } from 'react';
import type { RuleResponse, RuleCreate, RuleUpdate } from '@/types/rule';

export function useRules() {
  const [rows, setRows] = useState<RuleResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/rules', { cache: 'no-store' });
      if (!r.ok) throw new Error('No se pudieron cargar las reglas');
      setRows(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: RuleCreate) => {
    const r = await fetch('/api/rules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo crear');
    return (await r.json()) as RuleResponse;
  }, []);

  const update = useCallback(async (id: string, dto: RuleUpdate) => {
    const r = await fetch(`/api/rules/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo actualizar');
    return (await r.json()) as RuleResponse;
  }, []);

  const remove = useCallback(async (id: string) => {
    const r = await fetch(`/api/rules/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('No se pudo eliminar');
  }, []);

  return { rows, loading, fetchAll, create, update, remove };
}
