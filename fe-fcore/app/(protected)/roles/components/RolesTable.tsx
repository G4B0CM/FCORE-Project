// src/app/(protected)/roles/components/RolesTable.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import AppButton from '@/components/ui/AppButton';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import BoolIconCell from '@/components/ui/BoolIconCell';
import RoleFormDialog from './RoleFormDialog';
import { useRoles } from '../hooks/useRoles';

export default function RolesTable() {
  const toast = useRef<Toast>(null);
  const { rows, loading, fetchAll, create, update, remove } = useRoles();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });

  useEffect(() => {
    fetchAll().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchAll]);

  const columns = useMemo(
    () => [
      { field: 'name', header: 'Nombre', sortable: true, body: (r: any) => <TagCell value={r.name} severity="info" /> },
      { field: 'description', header: 'Descripción', sortable: true },
      { field: 'is_active', header: 'Activo', sortable: true, body: (r: any) => <BoolIconCell value={r.is_active} /> },
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
      await create({ name: String(values.name ?? '').trim(), description: String(values.description ?? '') || null });
      toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Rol creado', life: 1600 });
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
        name: String(values.name ?? '').trim(),
        description: String(values.description ?? '') || null,
        is_active: Boolean(values.is_active ?? true),
      });
      toast.current?.show({ severity: 'success', summary: 'Actualizado', detail: openEdit.row.name, life: 1600 });
      setOpenEdit({ open: false, row: null });
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'Error al actualizar', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  async function onDelete(r: any) {
    try {
      await remove(r.id);
      toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: r.name, life: 1400 });
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'No se pudo eliminar', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex align-items-center justify-content-between mb-3">
        <h2 className="text-600 m-0">Administración de roles</h2>
        <AppButton label="Nuevo rol" icon="pi pi-plus" severity="primary" onClick={() => setOpenCreate(true)} />
      </div>

      <DataTablePro value={rows} dataKey="id" loading={loading} globalFilterFields={['name', 'description']} columns={columns as any} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} />

      <RoleFormDialog visible={openCreate} onClose={() => setOpenCreate(false)} title="Nuevo rol" initialValues={{ name: '', description: '' }} submitLabel="Crear" onValid={onCreateValid} />

      {openEdit.open && openEdit.row && (
        <RoleFormDialog
          visible={openEdit.open}
          onClose={() => setOpenEdit({ open: false, row: null })}
          title={`Editar rol: ${openEdit.row.name}`}
          initialValues={{ name: openEdit.row.name, description: openEdit.row.description ?? '', is_active: Boolean(openEdit.row.is_active) }}
          submitLabel="Guardar"
          onValid={onEditValid}
        />
      )}
    </div>
  );
}
