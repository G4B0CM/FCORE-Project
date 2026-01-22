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
      defaults={{ validateOn: 'both', touchOnMount: false, validateOnMount: false }}
      submitLabel={submitLabel}
      submitIcon="pi pi-check"
      submitSeverity="success"
      size="sm"
      onValid={onValid}
      onInvalid={() => {}}
    >
      <div className="grid mt-3 gap-2 justify-content-center align-center">
        <div className="col-11 ">
          <FormInputField name="full_name" label="Nombre completo" validators={[required, minLen(3)]} />
        </div>
        <div className="col-11 ">
          <FormInputField name="document_number" label="Documento" validators={[ cedulaValidator, minLen(5)]} />
        </div>
        <div className="col-11 flex gap-1">
          <FormInputField className='flex-1' name="segment" label="Segmento" />
          <FormNumberField className='flex-none' name="age" label="Edad" validators={[numberBetween(18, 100)]} />
        </div>
      </div>
    </FormDialog>
  );
}
