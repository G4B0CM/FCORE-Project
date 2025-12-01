// src/app/(protected)/rules/components/RulesTable.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import AppButton from '@/components/ui/AppButton';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import BoolIconCell from '@/components/ui/BoolIconCell';
import RuleFormDialog from './RuleFormDialog';
import { useRules } from '../hooks/useRules';

export default function RulesTable() {
  const toast = useRef<Toast>(null);
  const { rows, loading, fetchAll, create, update, remove } = useRules();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });

  useEffect(() => {
    fetchAll().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchAll]);

  const columns = useMemo(
    () => [
      { field: 'name', header: 'Nombre', sortable: true },
      { field: 'severity', header: 'Severidad', sortable: true, body: (r: any) => <TagCell value={r.severity} severity="warning" /> },
      { field: 'enabled', header: 'Activa', sortable: true, body: (r: any) => <BoolIconCell value={r.enabled} /> },
      { field: 'created_by', header: 'Creada por', sortable: true },
      { field: 'created_at', header: 'Creada', sortable: true },
      {
        field: 'actions',
        header: 'Acciones',
        body: (r: any) => (
          <div className="flex gap-2">
            <AppButton label="Editar" icon="pi pi-pencil" size="small" onClick={() => setOpenEdit({ open: true, row: r })} />
            <AppButton label="Eliminar" icon="pi pi-trash" size="small" severity="danger" isOutlined onClick={() => onDelete(r)} />
          </div>
        ),
        style: { width: '16rem' },
      },
    ],
    []
  );

  async function onCreateValid(values: Record<string, unknown>) {
    try {
      await create({ name: String(values.name ?? '').trim(), dsl_expression: String(values.dsl_expression ?? '').trim(), severity: String(values.severity ?? 'LOW') as any });
      toast.current?.show({ severity: 'success', summary: 'Creada', detail: 'Regla creada', life: 1600 });
      setOpenCreate(false);
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'Error al crear', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  async function onEditValid(values: Record<string, unknown>) {
    if (!openEdit.row) return;
    try {
      await update(openEdit.row.id, {
        name: String(values.name ?? '').trim() || undefined,
        dsl_expression: String(values.dsl_expression ?? '').trim() || undefined,
        severity: (values.severity ? String(values.severity) : undefined) as any,
        enabled: typeof values.enabled === 'boolean' ? values.enabled : undefined,
      });
      toast.current?.show({ severity: 'success', summary: 'Actualizada', detail: openEdit.row.name, life: 1600 });
      setOpenEdit({ open: false, row: null });
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'Error al actualizar', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  async function onDelete(r: any) {
    try {
      await remove(r.id);
      toast.current?.show({ severity: 'success', summary: 'Eliminada', detail: r.name, life: 1400 });
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'No se pudo eliminar', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex align-items-center justify-content-between mb-3">
        <h2 className="text-600 m-0">Reglas</h2>
        <AppButton label="Nueva regla" icon="pi pi-plus" severity="primary" onClick={() => setOpenCreate(true)} />
      </div>

      <DataTablePro 
      value={rows} 
      dataKey="id" 
      loading={loading} 
      globalFilterFields={['name', 'dsl_expression', 'severity', 'created_by']} 
      columns={columns as any} 
      paginator rows={10} 
      rowsPerPageOptions={[10, 20, 50]}
      rounded="2xl"
      elevated
      containerClassName="mb-3" />

      <RuleFormDialog visible={openCreate} onClose={() => setOpenCreate(false)} title="Nueva regla" initialValues={{ name: '', dsl_expression: '', severity: 'LOW' }} submitLabel="Crear" onValid={onCreateValid} />

      {openEdit.open && openEdit.row && (
        <RuleFormDialog
          visible={openEdit.open}
          onClose={() => setOpenEdit({ open: false, row: null })}
          title={`Editar: ${openEdit.row.name}`}
          initialValues={{ name: openEdit.row.name, dsl_expression: openEdit.row.dsl_expression, severity: openEdit.row.severity, enabled: openEdit.row.enabled }}
          submitLabel="Guardar"
          onValid={onEditValid}
        />
      )}
    </div>
  );
}
