// src/app/(protected)/cases/components/CaseResolveDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormSelectField from '@/components/form/FormSelectField';
import { required, selectRequired } from '@/components/form/validators';

const DECISIONS = [
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'Fraude Confirmado', value: 'CONFIRMED_FRAUD' },
  { label: 'Falso Positivo', value: 'FALSE_POSITIVE' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onValid: (decision: string) => Promise<void>;
};

export default function CaseResolveDialog({ visible, onClose, onValid }: Props) {
  return (
    <FormDialog
      visible={visible}
      onClose={onClose}
      title="Resolver caso"
      initialValues={{ decision: '' }}
      defaults={{ validateOn: 'both', touchOnMount: true, validateOnMount: true }}
      submitLabel="Resolver"
      submitIcon="pi pi-check"
      submitSeverity="success"
      size="sm"
      onValid={async (values) => onValid(String(values.decision))}
      onInvalid={() => {}}
    >
      <div className="grid pt-2 gap-4">
        <div className="col-12">
          <FormSelectField name="decision" label="Decisión" options={DECISIONS} validators={[selectRequired]} />
        </div>
      </div>
    </FormDialog>
  );
}
