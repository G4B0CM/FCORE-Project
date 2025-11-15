// src/app/(protected)/analysts/components/AnalystFormDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormInputPassword from '@/components/form/FormInputPassword';
import FormSelectField from '@/components/form/FormSelectField';
import { required, selectRequired, minLen, qcode } from '@/components/form/validators';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  initialValues: Record<string, any>;
  submitLabel: string;
  onValid: (values: Record<string, unknown>) => Promise<void>;
};

export default function AnalystFormDialog({ visible, onClose, title, initialValues, submitLabel, onValid }: Props) {
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
        {'password' in initialValues && (
          <div className="col-12 md:col-6">
            <FormInputPassword name="password" label="Contraseña" toggleMask feedback validators={[required, minLen(8)]} />
          </div>
        )}
        <div className="col-12 md:col-6">
          <FormInputField name="code" label="Código" placeholder="C10010837" validators={[required, qcode]} disabled={'password' in initialValues ? false : true} />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="name" label="Nombre" validators={[required]} />
        </div>
        <div className="col-12 md:col-6">
          <FormInputField name="lastname" label="Apellido" validators={[required]} />
        </div>
        <div className="col-12 md:col-6">
          <FormSelectField name="role_id" label="Rol" placeholder="Seleccione un rol" options={(initialValues as any).roleOptions ?? []} validators={[selectRequired]} />
        </div>
      </div>
    </FormDialog>
  );
}
