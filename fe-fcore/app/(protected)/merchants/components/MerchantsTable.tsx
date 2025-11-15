// src/app/(protected)/merchants/components/MerchantsTable.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import AppButton from '@/components/ui/AppButton';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import BoolIconCell from '@/components/ui/BoolIconCell';
import MerchantFormDialog from './MerchantFormDialog';
import { useMerchants } from '../hooks/useMerchants';

export default function MerchantsTable() {
  const toast = useRef<Toast>(null);
  const { rows, loading, fetchAll, create, update, remove } = useMerchants();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });

  useEffect(() => {
    fetchAll().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchAll]);

  const columns = useMemo(
    () => [
      { field: 'name', header: 'Nombre', sortable: true },
      { field: 'category', header: 'Categoría', sortable: true },
      { field: 'risk_level', header: 'Riesgo', sortable: true, body: (r: any) => <TagCell value={r.risk_level} severity="warning" /> },
      { field: 'is_whitelisted', header: 'White', sortable: true, body: (r: any) => <BoolIconCell value={r.is_whitelisted} /> },
      { field: 'is_blacklisted', header: 'Black', sortable: true, body: (r: any) => <BoolIconCell value={r.is_blacklisted} /> },
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
      await create({ name: String(values.name ?? '').trim(), category: String(values.category ?? '').trim() });
      toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Comercio creado', life: 1600 });
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
        category: String(values.category ?? '').trim() || undefined,
        risk_level: String(values.risk_level ?? '') || null,
        is_whitelisted: values.is_whitelisted as boolean,
        is_blacklisted: values.is_blacklisted as boolean,
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
        <h2 className="text-600 m-0">Comercios</h2>
        <AppButton label="Nuevo comercio" icon="pi pi-plus" severity="primary" onClick={() => setOpenCreate(true)} />
      </div>

      <DataTablePro value={rows} dataKey="id" loading={loading} globalFilterFields={['name', 'category', 'risk_level']} columns={columns as any} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} />

      <MerchantFormDialog visible={openCreate} onClose={() => setOpenCreate(false)} title="Nuevo comercio" initialValues={{ name: '', category: '' }} submitLabel="Crear" onValid={onCreateValid} />

      {openEdit.open && openEdit.row && (
        <MerchantFormDialog
          visible={openEdit.open}
          onClose={() => setOpenEdit({ open: false, row: null })}
          title={`Editar: ${openEdit.row.name}`}
          initialValues={{ name: openEdit.row.name, category: openEdit.row.category, risk_level: openEdit.row.risk_level, is_whitelisted: openEdit.row.is_whitelisted, is_blacklisted: openEdit.row.is_blacklisted }}
          submitLabel="Guardar"
          onValid={onEditValid}
        />
      )}
    </div>
  );
}
