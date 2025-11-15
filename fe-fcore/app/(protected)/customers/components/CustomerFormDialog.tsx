// src/app/(protected)/customers/components/CustomerFormDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormNumberField from '@/components/form/FormNumberField';
import { required, minLen, numberBetween, cedulaValidator } from '@/components/form/validators';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  initialValues: Record<string, any>;
  submitLabel: string;
  onValid: (values: Record<string, unknown>) => Promise<void>;
};

export default function CustomerFormDialog({ visible, onClose, title, initialValues, submitLabel, onValid }: Props) {
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
          <FormInputField name="full_name" label="Nombre completo" validators={[required, minLen(3)]} />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="document_number" label="Documento" validators={[ cedulaValidator, minLen(5)]} />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="segment" label="Segmento" />
        </div>
        <div className="col-12 md:col-6">
          <FormNumberField name="age" label="Edad" validators={[numberBetween(18, 100)]} />
        </div>
      </div>
    </FormDialog>
  );
}
