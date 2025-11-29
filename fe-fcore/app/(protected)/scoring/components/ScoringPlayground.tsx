'use client';

import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import AppButton from '@/components/ui/AppButton';
import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormNumberField from '@/components/form/FormNumberField';
import FormSelectField from '@/components/form/FormSelectField';
import { numberBetween, numberRequired, selectRequired, eqLen } from '@/components/form/validators';
import TagCell from '@/components/ui/TagCell';
import { useScoring } from '../hooks/useScoring';

const CHANNEL_OPTIONS = [
  { label: 'POS', value: 'POS' },
  { label: 'ECOM', value: 'ECOM' }
];

type Props = {
  customerOptions: { label: string; value: string }[];
  merchantOptions: { label: string; value: string }[];
};

export default function ScoringPlayground({ customerOptions, merchantOptions }: Props) {
  const toast = useRef<Toast>(null);
  const { loading, result, score, setResult } = useScoring();
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <div className="flex align-items-center justify-content-between mb-3">
        <h2 className="text-600 m-0">Scoring Engine</h2>
        <div className="flex gap-2">
          <AppButton label="Nueva prueba" icon="pi pi-plus" onClick={() => { setResult(null); setOpen(true); }} />
        </div>
      </div>

      {result && (
        <div className="grid">
          <div className="col-12 md:col-4">
            <div className="surface-card p-3 border-round shadow-1">
              <div className="text-600 mb-1">Acción</div>
              <TagCell value={result.action} severity={result.action === 'ALLOW' ? 'success' : result.action === 'DENY' ? 'danger' : 'warning'} />
            </div>
          </div>
          <div className="col-12 md:col-4">
            <div className="surface-card p-3 border-round shadow-1">
              <div className="text-600 mb-1">ML Score</div>
              <div className="text-2xl font-bold">{result.ml_score.toFixed(4)}</div>
            </div>
          </div>
          <div className="col-12 md:col-4">
            <div className="surface-card p-3 border-round shadow-1">
              <div className="text-600 mb-1">Final Score</div>
              <div className="text-2xl font-bold">{result.final_score.toFixed(4)}</div>
            </div>
          </div>
          <div className="col-12">
            <div className="surface-card p-3 border-round shadow-1">
              <div className="text-600 mb-2">Rule hits</div>
              <pre className="m-0 text-sm overflow-auto">{JSON.stringify(result.rule_hits, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {open && (
        <FormDialog
          visible={open}
          onClose={() => setOpen(false)}
          title="Probar transacción"
          initialValues={{ customer_id: '', merchant_id: '', amount: null, channel: '', device_id: '', ip_address: '', country: '' }}
          defaults={{ validateOn: 'change', touchOnMount: false, validateOnMount: false }}
          submitLabel="Score"
          submitIcon="pi pi-bolt"
          submitSeverity="primary"
          size="md"
          onValid={async (values) => {
            try {
              await score({
                customer_id: String(values.customer_id ?? ''),
                merchant_id: String(values.merchant_id ?? ''),
                amount: Number(values.amount ?? 0),
                channel: String(values.channel ?? ''),
                device_id: String(values.device_id ?? '') || null,
                ip_address: String(values.ip_address ?? '') || null,
                country: String(values.country ?? '') || null,
              });
              setOpen(false);
            } catch (e: any) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: e?.message ?? 'Error', life: 2400 });
            }
          }}
          onInvalid={() => {}}
        >
          <div className="grid pt-2 gap-3">
            <p className='mb-20 text-gray-600'>Obligatorios</p>
            <div className="col-12 md:col-6 w-full">
              <FormSelectField name="customer_id" label="Cliente" initiallyTouched options={customerOptions} validators={[selectRequired]} />
            </div>
            <div className="col-12 md:col-6 w-full">
              <FormSelectField name="merchant_id" label="Comercio" initiallyTouched options={merchantOptions} validators={[selectRequired]} />
            </div>
            <div className="col-12 md:col-6 w-full">
              <div className="flex gap-2 min-w-0">
                <div className="flex-1 min-w-0">
                  <FormNumberField className="w-full" name="amount" label="Monto" validators={[numberRequired, numberBetween(0.01, 99999999)]} />
                </div>
                <div className="flex-1 min-w-0">
                  <FormSelectField
                    name="channel"
                    label="Canal"
                    options={CHANNEL_OPTIONS}
                    validators={[selectRequired]}
                    className="w-full"
                    containerClassName="w-full"
                  />
                </div>
              </div>
            </div>
            <p className='mb-20 text-gray-600'>Opcionales</p>
            <div className="col-12 md:col-6 w-full">
              <div className="flex gap-2 min-w-0">
                <div className="flex-1">
                  <FormInputField name="device_id" label="Device ID" />
                </div>
                <div className="flex-1 ">
                  <FormInputField name="ip_address" label="IP" />
                </div>
                <div className="flex-1">
                  <FormInputField name="country" label="País (ISO2)" validators={[eqLen(2)]} />
                </div>
              </div>
            </div>
          </div>
        </FormDialog>
      )}
    </div>
  );
}
