// src/app/(protected)/roles/hooks/useRoles.ts
'use client';

import { useCallback, useRef, useState } from 'react';
import type { RoleResponse, RoleCreate, RoleUpdate } from '@/types/role';

export function useRoles() {
  const [rows, setRows] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const firstError = useRef<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/roles', { cache: 'no-store' });
      if (!r.ok) throw new Error('No se pudieron cargar los roles');
      setRows(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: RoleCreate) => {
    const r = await fetch('/api/roles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo crear');
    return (await r.json()) as RoleResponse;
  }, []);

  const update = useCallback(async (id: string, dto: RoleUpdate) => {
    const r = await fetch(`/api/roles/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo actualizar');
    return (await r.json()) as RoleResponse;
  }, []);

  const remove = useCallback(async (id: string) => {
    const r = await fetch(`/api/roles/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('No se pudo eliminar');
  }, []);

  return { rows, loading, fetchAll, create, update, remove };
}
