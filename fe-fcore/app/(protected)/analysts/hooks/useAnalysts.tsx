// src/app/(protected)/analysts/hooks/useAnalysts.ts
'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { AnalystResponse, AnalystCreate, AnalystUpdate } from '@/types/analyst';
import type { RoleResponse } from '@/types/role';

export function useAnalysts() {
  const [rows, setRows] = useState<AnalystResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const firstError = useRef<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [a, r] = await Promise.all([
        fetch('/api/analysts', { cache: 'no-store' }).then((x) => x.json() as Promise<AnalystResponse[]>),
        fetch('/api/roles', { cache: 'no-store' }).then((x) => x.json() as Promise<RoleResponse[]>).catch(() => []),
      ]);
      setRows(a);
      setRoles(r);
    } catch (e: any) {
      firstError.current = e?.message ?? 'Error cargando analistas';
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: AnalystCreate) => {
    const res = await fetch('/api/analysts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.detail ?? 'No se pudo crear');
    return res.json() as Promise<AnalystResponse>;
  }, []);

  const update = useCallback(async (code: string, dto: AnalystUpdate) => {
    const res = await fetch(`/api/analysts/${encodeURIComponent(code)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
    if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.detail ?? 'No se pudo actualizar');
    return res.json() as Promise<AnalystResponse>;
  }, []);

  const deactivate = useCallback(async (code: string) => {
    const res = await fetch(`/api/analysts/deactivate/${encodeURIComponent(code)}`, { method: 'POST' });
    if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.detail ?? 'No se pudo desactivar');
    return res.json() as Promise<AnalystResponse>;
  }, []);

  const roleOptions = useMemo(() => roles.filter((r) => r.is_active).map((r) => ({ label: r.name, value: r.id })), [roles]);

  return { rows, roles, roleOptions, loading, fetchAll, create, update, deactivate, firstError };
}
