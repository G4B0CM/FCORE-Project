// src/app/(protected)/customers/components/CustomersTable.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import AppButton from '@/components/ui/AppButton';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import BoolIconCell from '@/components/ui/BoolIconCell';
import CustomerFormDialog from './CustomerFormDialog';
import { useCustomers } from '../hooks/useCustomers';

export default function CustomersTable() {
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const { rows, loading, fetchAll, create, update, remove } = useCustomers();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<{ open: boolean; row: any | null }>({ open: false, row: null });

  useEffect(() => {
    fetchAll().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchAll]);

  const columns = useMemo(
    () => [
      { field: 'full_name', header: 'Nombre', sortable: true },
      { field: 'document_number', header: 'Documento', sortable: true },
      { field: 'segment', header: 'Segmento', sortable: true, body: (r: any) => <TagCell value={r.segment ?? '—'} severity="info" /> },
      { field: 'age', header: 'Edad', sortable: true },
      { field: 'risk_profile', header: 'Riesgo', sortable: true, body: (r: any) => <TagCell value={r.risk_profile} severity="warning" /> },
      {
        field: 'actions',
        header: 'Acciones',
        body: (r: any) => (
          <div className="flex gap-2">
            <AppButton label="Comportamiento" icon="pi pi-chart-bar" size="small" severity="help" onClick={() => router.push(`/behavior/${r.id}`)} />
            <AppButton label="Editar" icon="pi pi-pencil" size="small" onClick={() => setOpenEdit({ open: true, row: r })} />
            <AppButton label="Eliminar" icon="pi pi-trash" size="small" severity="danger" isOutlined onClick={() => onDelete(r)} />
          </div>
        ),
        style: { width: '26rem' },
      },
    ],
    [router]
  );

  async function onCreateValid(values: Record<string, unknown>) {
    try {
      await create({
        full_name: String(values.full_name ?? '').trim(),
        document_number: String(values.document_number ?? '').trim(),
        segment: String(values.segment ?? '') || null,
        age: values.age === null || values.age === undefined ? null : Number(values.age),
      });
      toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Cliente creado', life: 1600 });
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
        full_name: String(values.full_name ?? '').trim() || undefined,
        document_number: String(values.document_number ?? '').trim() || undefined,
        segment: String(values.segment ?? '') || null,
        age: values.age === null || values.age === undefined ? null : Number(values.age),
      });
      toast.current?.show({ severity: 'success', summary: 'Actualizado', detail: openEdit.row.full_name, life: 1600 });
      setOpenEdit({ open: false, row: null });
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'Error al actualizar', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  async function onDelete(r: any) {
    try {
      await remove(r.id);
      toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: r.full_name, life: 1400 });
      await fetchAll();
    } catch (e: any) {
      toast.current?.show({ severity: 'error', summary: 'No se pudo eliminar', detail: e?.message ?? 'Error', life: 2600 });
    }
  }

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex align-items-center justify-content-between mb-3">
        <h2 className="text-600 m-0">Clientes</h2>
        <AppButton label="Nuevo cliente" icon="pi pi-plus" severity="primary" onClick={() => setOpenCreate(true)} />
      </div>

      <DataTablePro value={rows} dataKey="id" loading={loading} globalFilterFields={['full_name', 'document_number', 'segment', 'risk_profile']} columns={columns as any} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} />

      <CustomerFormDialog visible={openCreate} onClose={() => setOpenCreate(false)} title="Nuevo cliente" initialValues={{ full_name: '', document_number: '', segment: '', age: null }} submitLabel="Crear" onValid={onCreateValid} />

      {openEdit.open && openEdit.row && (
        <CustomerFormDialog
          visible={openEdit.open}
          onClose={() => setOpenEdit({ open: false, row: null })}
          title={`Editar: ${openEdit.row.full_name}`}
          initialValues={{ full_name: openEdit.row.full_name, document_number: openEdit.row.document_number, segment: openEdit.row.segment ?? '', age: openEdit.row.age ?? null }}
          submitLabel="Guardar"
          onValid={onEditValid}
        />
      )}
    </div>
  );
}
