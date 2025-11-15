// src/app/(protected)/rules/components/RuleFormDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormTextAreaField from '@/components/form/FormTextAreaField';
import FormSelectField from '@/components/form/FormSelectField';
import FormSwitchField from '@/components/form/FormSwitchField';
import { required, minLen, selectRequired } from '@/components/form/validators';

const SEVERITY_OPTIONS = [
  { label: 'LOW', value: 'LOW' },
  { label: 'MEDIUM', value: 'MEDIUM' },
  { label: 'HIGH', value: 'HIGH' },
  { label: 'CRITICAL', value: 'CRITICAL' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  initialValues: Record<string, any>;
  submitLabel: string;
  onValid: (values: Record<string, unknown>) => Promise<void>;
};

export default function RuleFormDialog({ visible, onClose, title, initialValues, submitLabel, onValid }: Props) {
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
        <div className="col-12">
          <FormInputField name="name" label="Nombre" validators={[required, minLen(5)]} />
        </div>
        <div className="col-12">
          <FormTextAreaField name="dsl_expression" label="Expresión (DSL)" autoResize rows={5} validators={[required, minLen(10)]} />
        </div>
        <div className="col-12 md:col-6">
          <FormSelectField name="severity" label="Severidad" options={SEVERITY_OPTIONS} validators={[selectRequired]} />
        </div>
        {'enabled' in initialValues && (
          <div className="col-12 md:col-3">
            <FormSwitchField name="enabled" label="Activa" />
          </div>
        )}
      </div>
    </FormDialog>
  );
}
