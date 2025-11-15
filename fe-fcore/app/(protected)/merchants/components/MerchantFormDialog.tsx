// src/app/(protected)/merchants/components/MerchantFormDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormSwitchField from '@/components/form/FormSwitchField';
import { required, minLen } from '@/components/form/validators';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  initialValues: Record<string, any>;
  submitLabel: string;
  onValid: (values: Record<string, unknown>) => Promise<void>;
};

export default function MerchantFormDialog({ visible, onClose, title, initialValues, submitLabel, onValid }: Props) {
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
          <FormInputField name="name" label="Nombre" validators={[required, minLen(2)]} />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="category" label="Categoría" validators={[required, minLen(3)]} />
        </div>
        {'risk_level' in initialValues && (
          <>
            <div className="col-12 md:col-6">
              <FormInputField name="risk_level" label="Nivel de riesgo" />
            </div>
            <div className="col-12 md:col-3">
              <FormSwitchField name="is_whitelisted" label="Whitelisted" />
            </div>
            <div className="col-12 md:col-3">
              <FormSwitchField name="is_blacklisted" label="Blacklisted" />
            </div>
          </>
        )}
      </div>
    </FormDialog>
  );
}
