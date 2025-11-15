// src/app/(protected)/transactions/components/TransactionFormDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormNumberField from '@/components/form/FormNumberField';
import FormSelectField from '@/components/form/FormSelectField';
import { selectRequired,required, numberBetween, minLen } from '@/components/form/validators';

const CHANNEL_OPTIONS = [
  { label: 'POS', value: 'POS' },
  { label: 'ECOM', value: 'ECOM' },
  { label: 'ATM', value: 'ATM' },
  { label: 'P2P', value: 'P2P' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  initialValues: Record<string, any>;
  submitLabel: string;
  onValid: (values: Record<string, unknown>) => Promise<void>;
};

export default function TransactionFormDialog({ visible, onClose, title, initialValues, submitLabel, onValid }: Props) {
  return (
    <FormDialog
      visible={visible}
      onClose={onClose}
      title={title}
      initialValues={initialValues}
      defaults={{ validateOn: 'both', touchOnMount: true, validateOnMount: true }}
      submitLabel={submitLabel}
      submitIcon="pi pi-check"
      submitSeverity="success"
      size="md"
      onValid={onValid}
      onInvalid={() => {}}
    >
      <div className="grid pt-2 gap-4">
        <div className="col-12 md:col-6">
          <FormInputField name="customer_id" label="Customer ID" validators={[required, minLen(10)]} />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="merchant_id" label="Merchant ID" validators={[required, minLen(10)]} />
        </div>
        <div className="col-12 md:col-6">
          <FormNumberField name="amount" label="Monto" validators={[numberBetween(0.01 as any, 99999999 as any)]} />
        </div>
        <div className="col-12 md:col-6">
          <FormSelectField name="channel" label="Canal" options={CHANNEL_OPTIONS} validators={[selectRequired]} />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="device_id" label="Device ID" />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="ip_address" label="IP" />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="country" label="País (ISO2)" />
        </div>
      </div>
    </FormDialog>
  );
}
