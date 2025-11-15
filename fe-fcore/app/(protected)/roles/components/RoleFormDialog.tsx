// src/app/(protected)/roles/components/RoleFormDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormTextAreaField from '@/components/form/FormTextAreaField';
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

export default function RoleFormDialog({ visible, onClose, title, initialValues, submitLabel, onValid }: Props) {
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
          <FormInputField name="name" label="Nombre" validators={[required, minLen(3)]} />
        </div>
        <div className="col-12">
          <FormTextAreaField name="description" label="Descripción" autoResize rows={3} />
        </div>
        {'is_active' in initialValues && (
          <div className="col-12 md:col-3">
            <FormSwitchField name="is_active" label="Activo" />
          </div>
        )}
      </div>
    </FormDialog>
  );
}
