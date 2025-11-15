// src/app/(protected)/analysts/components/AnalystsTable.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import AppButton from '@/components/ui/AppButton';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import BoolIconCell from '@/components/ui/BoolIconCell';
import AnalystFormDialog from './AnaylstFormDialog';
import { useAnalysts } from '../hooks/useAnalysts';

export default function AnalystsTable() {
  const toast = useRef<Toast>(null);
  const { rows, roleOptions, loading, fetchAll, create, update, deactivate } = useAnalysts();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });

  useEffect(() => {
    fetchAll().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchAll]);

  const columns = useMemo(
    () => [
      { field: 'code', header: 'Código', sortable: true },
      { field: 'name', header: 'Nombre', sortable: true },
      { field: 'lastname', header: 'Apellido', sortable: true },
      { field: 'role.name', header: 'Rol', sortable: true, body: (r: any) => <TagCell value={r.role?.name ?? '—'} severity={r.role?.name ? 'info' : 'warning'} /> },
      { field: 'is_active', header: 'Activo', sortable: true, body: (r: any) => <BoolIconCell value={r.is_active} /> },
      {
        field: 'actions',
        header: 'Acciones',
        body: (r: any) => (
          <div className="flex gap-2">
            <AppButton label="Editar" icon="pi pi-pencil" size="small" onClick={() => setOpenEdit({ open: true, row: r })} />
            <AppButton label="Desactivar" icon="pi pi-ban" size="small" severity="danger" isOutlined onClick={() => onDeactivate(r)} />
          </div>
        ),
        style: { width: '16rem' },
      },
    ],
    []
  );

  async function onCreateValid(values: Record<string, unknown>) {
    try {
      await create({
        code: String(values.code ?? '').trim(),
        name: String(values.name ?? '').trim(),
        lastname: String(values.lastname ?? '').trim(),
        password: String(values.password ?? ''),
        role_id: String(values.role_id ?? ''),
      });
      toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Analista creado', life: 1600 });
      setOpenCreate(false);
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'Error al crear', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  async function onEditValid(values: Record<string, unknown>) {
    if (!openEdit.row) return;
    try {
      await update(openEdit.row.code, {
        name: String(values.name ?? '').trim() || null,
        lastname: String(values.lastname ?? '').trim() || null,
        role_id: String(values.role_id ?? '') || null,
      });
      toast.current?.show({ severity: 'success', summary: 'Actualizado', detail: openEdit.row.code, life: 1600 });
      setOpenEdit({ open: false, row: null });
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'Error al actualizar', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  async function onDeactivate(r: any) {
    try {
      await deactivate(r.code);
      toast.current?.show({ severity: 'success', summary: 'Desactivado', detail: r.code, life: 1400 });
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'No se pudo desactivar', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex align-items-center justify-content-between mb-3">
        <h2 className="text-600 m-0">Administración de analistas</h2>
        <AppButton label="Nuevo analista" icon="pi pi-plus" severity="primary" onClick={() => setOpenCreate(true)} />
      </div>

      <DataTablePro
        value={rows}
        dataKey="id"
        loading={loading}
        globalFilterFields={['code', 'name', 'lastname', 'role.name']}
        columns={columns as any}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
      />

      <AnalystFormDialog
        visible={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Nuevo analista"
        initialValues={{ code: '', name: '', lastname: '', password: '', role_id: '', roleOptions }}
        submitLabel="Crear"
        onValid={onCreateValid}
      />

      {openEdit.open && openEdit.row && (
        <AnalystFormDialog
          visible={openEdit.open}
          onClose={() => setOpenEdit({ open: false, row: null })}
          title={`Editar ${openEdit.row.code}`}
          initialValues={{ code: openEdit.row.code, name: openEdit.row.name, lastname: openEdit.row.lastname, role_id: openEdit.row.role?.id ?? '', roleOptions }}
          submitLabel="Guardar"
          onValid={onEditValid}
        />
      )}
    </div>
  );
}
