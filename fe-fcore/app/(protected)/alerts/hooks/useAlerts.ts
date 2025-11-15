// src/app/(protected)/alerts/hooks/useAlerts.ts
'use client';

import { useCallback, useState } from 'react';
import type { AlertResponse } from '@/types/alert';

export function useAlerts() {
  const [rows, setRows] = useState<AlertResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/alerts?limit=${limit}&offset=${offset}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('No se pudieron cargar las alertas');
      setRows(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const getOne = useCallback(async (id: string) => {
    const r = await fetch(`/api/alerts/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!r.ok) throw new Error('No se pudo obtener la alerta');
    return (await r.json()) as AlertResponse;
  }, []);

  return { rows, loading, fetchAll, getOne };
}
