// src/app/(protected)/transactions/components/TransactionsTable.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import AppButton from '@/components/ui/AppButton';
import { useTransactions } from '../hooks/useTransactions';

export default function TransactionsTable() {
  const toast = useRef<Toast>(null);
  const { rows, loading, fetchAll, create } = useTransactions();
  const [openCreate, setOpenCreate] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetchAll().catch((e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2500 }));
  }, [fetchAll]);

  const columns = useMemo(
    () => [
      { field: 'customer.full_name', header: 'Cliente', sortable: true, body: (r: any) => r.customer?.full_name ?? r.customer_id },
      { field: 'merchant.name', header: 'Comercio', sortable: true, body: (r: any) => r.merchant?.name ?? r.merchant_id },
      { field: 'amount', header: 'Monto', sortable: true, body: (r: any) => <TagCell value={Number(r.amount).toFixed(2)} severity="info" /> },
      { field: 'channel', header: 'Canal', sortable: true, body: (r: any) => <TagCell value={r.channel} severity="secondary" /> },
      { field: 'country', header: 'País', sortable: true },
      { field: 'occurred_at', header: 'Ocurrió', sortable: true },
      {
        field: 'actions',
        header: 'Acciones',
        body: (r: any) => (
          <div className="flex gap-2">
            <AppButton label="Ver" icon="pi pi-search" size="small" onClick={() => setSelected(r)} />
          </div>
        ),
        style: { width: '10rem' },
      },
    ],
    []
  );

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex align-items-center justify-content-between mb-3">
        <h2 className="text-600 m-0">Transacciones</h2>
        <AppButton label="Registrar" icon="pi pi-plus" severity="primary" onClick={() => setOpenCreate(true)} />
      </div>
      <DataTablePro 
      value={rows} 
      dataKey="id" 
      loading={loading} 
      globalFilterFields={['id', 'customer.full_name', 'merchant.name', 'channel', 'country']} 
      columns={columns as any} 
      paginator rows={20} 
      rowsPerPageOptions={[20, 50, 100]}
      rounded="2xl"
      elevated
      containerClassName="mb-3" />
      {openCreate && (
        <div>
          <TransactionForm />
        </div>
      )}
      {selected && (
        <div className="mt-3 surface-card p-3 border-round">
          <h3 className="m-0 mb-2">Detalle</h3>
          <pre className="m-0 text-sm overflow-auto">{JSON.stringify(selected, null, 2)}</pre>
        </div>
      )}
    </div>
  );

  function TransactionForm() {
    const onValid = async (values: Record<string, unknown>) => {
      try {
        await create({
          customer_id: String(values.customer_id ?? ''),
          merchant_id: String(values.merchant_id ?? ''),
          amount: Number(values.amount ?? 0),
          channel: String(values.channel ?? ''),
          device_id: String(values.device_id ?? '') || null,
          ip_address: String(values.ip_address ?? '') || null,
          country: String(values.country ?? '') || null,
        });
        toast.current?.show({ severity: 'success', summary: 'Registrada', detail: 'Transacción creada', life: 1600 });
        setOpenCreate(false);
        await fetchAll();
      } catch (e: any) {
        toast.current?.show({ severity: 'error', summary: 'Error al registrar', detail: e?.message ?? 'Error', life: 2600 });
      }
    };
    const TransactionFormDialog = require('./TransactionFormDialog').default;
    return <TransactionFormDialog visible={openCreate} onClose={() => setOpenCreate(false)} title="Nueva transacción" initialValues={{ customer_id: '', merchant_id: '', amount: 0, channel: '', device_id: '', ip_address: '', country: '' }} submitLabel="Crear" onValid={onValid} />;
  }
}
