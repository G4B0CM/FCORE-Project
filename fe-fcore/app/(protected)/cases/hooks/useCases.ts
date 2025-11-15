// src/app/(protected)/cases/hooks/useCases.ts
'use client';

import { useCallback, useState } from 'react';
import type { CaseResponse, CaseDecision } from '@/types/case';

export function useCases() {
  const [rows, setRows] = useState<CaseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<CaseResponse | null>(null);

  const fetchAll = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/cases?limit=${limit}&offset=${offset}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('No se pudieron cargar los casos');
      setRows(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const openFromAlert = useCallback(async (alert_id: string) => {
    const r = await fetch('/api/cases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alert_id }) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo abrir el caso');
    return (await r.json()) as CaseResponse;
  }, []);

  const addNote = useCallback(async (id: string, note: string) => {
    const r = await fetch(`/api/cases/${encodeURIComponent(id)}/notes`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo agregar la nota');
    return (await r.json()) as CaseResponse;
  }, []);

  const resolve = useCallback(async (id: string, decision: CaseDecision) => {
    const r = await fetch(`/api/cases/${encodeURIComponent(id)}/resolve`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision }) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'No se pudo resolver el caso');
    return (await r.json()) as CaseResponse;
  }, []);

  return { rows, loading, selected, setSelected, fetchAll, openFromAlert, addNote, resolve };
}
