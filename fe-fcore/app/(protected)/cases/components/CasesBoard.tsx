// src/app/(protected)/cases/components/CasesBoard.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import AppButton from '@/components/ui/AppButton';
import CaseNoteDialog from './CaseNoteDialog';
import CaseResolveDialog from './CaseResolveDialog';
import { useCases } from '../hooks/useCases';

export default function CasesBoard() {
  const toast = useRef<Toast>(null);
  const { rows, loading, selected, setSelected, fetchAll, openFromAlert, addNote, resolve } = useCases();
  const [openNote, setOpenNote] = useState(false);
  const [openResolve, setOpenResolve] = useState(false);

  useEffect(() => {
    fetchAll().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchAll]);

  const columns = useMemo(
    () => [
      { field: 'id', header: 'ID', sortable: true },
      { field: 'decision', header: 'Estado', sortable: true, body: (r: any) => <TagCell value={r.decision} severity={r.decision === 'APPROVED' ? 'success' : r.decision === 'DECLINED' ? 'danger' : 'warning'} /> },
      { field: 'alert.id', header: 'Alerta', sortable: true, body: (r: any) => r.alert?.id ?? '—' },
      { field: 'analyst.code', header: 'Analista', sortable: true, body: (r: any) => r.analyst?.code ?? '—' },
      { field: 'created_at', header: 'Creado', sortable: true },
      { field: 'updated_at', header: 'Actualizado', sortable: true },
      {
        field: 'actions',
        header: 'Acciones',
        body: (r: any) => (
          <div className="flex gap-2">
            <AppButton label="Ver" icon="pi pi-search" size="small" onClick={() => setSelected(r)} />
            <AppButton label="Nota" icon="pi pi-comment" size="small" onClick={() => { setSelected(r); setOpenNote(true); }} />
            <AppButton label="Resolver" icon="pi pi-check" size="small" severity="success" onClick={() => { setSelected(r); setOpenResolve(true); }} />
          </div>
        ),
        style: { width: '20rem' },
      },
    ],
    []
  );

  return (
    <div className="grid">
      <Toast ref={toast} position="bottom-right" />
      <div className="col-12 lg:col-7">
        <div className="flex align-items-center justify-content-between mb-3">
          <h2 className="text-600 m-0">Casos</h2>
          <div className="flex gap-2">
            <AppButton label="Refrescar" icon="pi pi-refresh" onClick={() => fetchAll().catch(() => {})} />
          </div>
        </div>
        <DataTablePro value={rows} dataKey="id" loading={loading} globalFilterFields={['id', 'decision', 'analyst.code']} columns={columns as any} paginator rows={20} rowsPerPageOptions={[20, 50, 100]} />
      </div>
      <div className="col-12 lg:col-5">
        <div className="surface-card p-3 border-round h-full">
          <h3 className="m-0 mb-3">Detalle</h3>
          {!selected && <div className="text-600">Selecciona un caso para ver detalles</div>}
          {selected && (
            <div className="flex flex-column gap-3">
              <div className="grid">
                <div className="col-6">
                  <div className="text-600 mb-1">ID</div>
                  <div className="text-xl">{selected.id}</div>
                </div>
                <div className="col-6">
                  <div className="text-600 mb-1">Estado</div>
                  <TagCell value={selected.decision} severity={selected.decision === 'APPROVED' ? 'success' : selected.decision === 'DECLINED' ? 'danger' : 'warning'} />
                </div>
              </div>
              <div>
                <div className="text-600 mb-1">Notas</div>
                <div className="surface-100 p-2 border-round" style={{ minHeight: 80 }}>
                  <pre className="m-0 text-sm overflow-auto">{selected.notes ?? '—'}</pre>
                </div>
              </div>
              <div>
                <div className="text-600 mb-1">Alerta vinculada</div>
                <pre className="m-0 text-sm overflow-auto">{JSON.stringify(selected.alert ?? {}, null, 2)}</pre>
              </div>
              <div className="flex gap-2">
                <AppButton label="Agregar nota" icon="pi pi-comment" onClick={() => setOpenNote(true)} />
                <AppButton label="Resolver" icon="pi pi-check" severity="success" onClick={() => setOpenResolve(true)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {openNote && selected && (
        <CaseNoteDialog
          visible={openNote}
          onClose={() => setOpenNote(false)}
          onValid={async (note) => {
            try {
              const r = await fetch(`/api/cases/${encodeURIComponent(selected.id)}/notes`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) });
              if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'Error');
              const updated = await r.json();
              toast.current?.show({ severity: 'success', summary: 'Nota agregada', life: 1400 });
              setOpenNote(false);
              await fetchAll();
              const sel = (await fetch(`/api/cases/${encodeURIComponent(selected.id)}`)).ok ? await (await fetch(`/api/cases/${encodeURIComponent(selected.id)}`)).json() : updated;
              setSelected(sel);
            } catch (e: any) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2400 });
            }
          }}
        />
      )}

      {openResolve && selected && (
        <CaseResolveDialog
          visible={openResolve}
          onClose={() => setOpenResolve(false)}
          onValid={async (decision) => {
            try {
              const r = await fetch(`/api/cases/${encodeURIComponent(selected.id)}/resolve`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision }) });
              if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail ?? 'Error');
              const updated = await r.json();
              toast.current?.show({ severity: 'success', summary: 'Caso resuelto', life: 1400 });
              setOpenResolve(false);
              await fetchAll();
              setSelected(updated);
            } catch (e: any) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2400 });
            }
          }}
        />
      )}
    </div>
  );
}
