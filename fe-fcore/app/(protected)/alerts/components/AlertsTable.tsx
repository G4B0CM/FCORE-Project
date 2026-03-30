// src/app/(protected)/alerts/components/AlertsTable.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import AppButton from '@/components/ui/AppButton';
import { useAlerts } from '../hooks/useAlerts';

export default function AlertsTable() {
  const toast = useRef<Toast>(null);
  const { rows, loading, fetchAll, getOne } = useAlerts();
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetchAll().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchAll]);

  const columns = useMemo(
    () => [
      { field: 'id', header: 'ID', sortable: true },
      { field: 'action', header: 'Acción', sortable: true, body: (r: any) => <TagCell value={r.action} severity="warning" /> },
      { field: 'final_score', header: 'Score', sortable: true, body: (r: any) => <TagCell value={r.final_score?.toFixed?.(2) ?? '—'} severity="info" /> },
      { field: 'created_at', header: 'Creada', sortable: true },
      {
        field: 'actions',
        header: 'Acciones',
        body: (r: any) => (
          <div className="flex gap-2">
            <AppButton label="Ver" icon="pi pi-search" size="small" onClick={async () => setSelected(await getOne(r.id))} />
          </div>
        ),
        style: { width: '10rem' },
      },
    ],
    [getOne]
  );

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex align-items-center justify-content-between mb-3">
        <h2 className="text-600 m-0">Alertas</h2>
      </div>
      <DataTablePro 
      value={rows} 
      dataKey="id" 
      loading={loading} 
      globalFilterFields={['id', 'action']} 
      columns={columns as any} 
      paginator rows={20} 
      rowsPerPageOptions={[20, 50, 100]}
      rounded="2xl"
      elevated
      containerClassName="mb-3" />
      {selected && (
        <div className="mt-3 surface-card p-3 border-round">
          <h3 className="m-0 mb-2">Detalle de alerta</h3>
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="text-600 mb-1">Acción</div>
              <TagCell value={selected.action} severity="warning" />
            </div>
            <div className="col-12 md:col-6">
              <div className="text-600 mb-1">Score final</div>
              <TagCell value={selected.final_score?.toFixed?.(2) ?? '—'} severity="info" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-600 mb-2">Rule hits</div>
            <pre className="m-0 text-sm overflow-auto">{JSON.stringify(selected.rule_hits ?? {}, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
