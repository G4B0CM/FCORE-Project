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
      defaults={{ validateOn: 'both', touchOnMount: false, validateOnMount: false }}
      submitLabel={submitLabel}
      submitIcon="pi pi-check"
      submitSeverity="success"
      size="md"
      onValid={onValid}
      onInvalid={(errors) => {
            const first = Object.values(errors || {}).find(Boolean) as string | null;
          }}
    >
      <div className="grid gap-3 mt-3">
        <div className="col-5">
          <FormInputField name="code" label="Código" placeholder="C10010837" validators={[required, qcode]} disabled={'password' in initialValues ? false : true} />
        </div>
        {'password' in initialValues && (
          <div className="col-6">
            <FormInputPassword className='w-full' name="password" label="Contraseña" toggleMask feedback  validators={[required, minLen(8)]} />
          </div>
        )}
        <div className="col-4">
          <FormInputField className='w-full' name="name" label="Nombre" validators={[required]} />
        </div>
        <div className="col-4">
          <FormInputField className="w-full" name="lastname" label="Apellido" validators={[required]} />
        </div>
        <div className="col-3">
          <FormSelectField name="role_id" label="Rol" placeholder="Seleccione un rol" options={(initialValues as any).roleOptions ?? []} validators={[selectRequired]} />
        </div>
      </div>
    </FormDialog>
  );
}
