// src/app/(protected)/merchants/components/MerchantFormDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormSelectField from '@/components/form/FormSelectField';
import FormSwitchField from '@/components/form/FormSwitchField';
import { required, minLen, selectRequired } from '@/components/form/validators';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  initialValues: Record<string, any>;
  submitLabel: string;
  onValid: (values: Record<string, unknown>) => Promise<void>;
};

const CATEGORIES = [
  {label:'Web',value:'WEB'}
]
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
      size="sm"
      onValid={onValid}
      onInvalid={() => {}}
    >
      <div className="flex flex-column gap-4 mt-4 justify-content-center align-center">
        <div className="w-full">
          <FormInputField name="name" label="Nombre" validators={[required, minLen(2)]} />
        </div>
        <div className="w-full">
          <FormSelectField name="category" label='Categorías' options={CATEGORIES} validators={[selectRequired]}/>
        </div>
        {'risk_level' in initialValues && (
          <>
            <div className="w-full">
              <FormInputField name="risk_level" label="Nivel de riesgo" />
            </div>
            <div className="w-full">
              <FormSwitchField name="is_whitelisted" label="Whitelisted" />
            </div>
            <div className="w-full">
              <FormSwitchField name="is_blacklisted" label="Blacklisted" />
            </div>
          </>
        )}
      </div>
    </FormDialog>
  );
}
