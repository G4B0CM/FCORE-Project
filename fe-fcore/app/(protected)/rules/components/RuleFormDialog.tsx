'use client';

import { useState } from 'react';
import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormTextAreaField from '@/components/form/FormTextAreaField';
import FormSelectField from '@/components/form/FormSelectField';
import SwitchField from '@/components/ui/SwitchField';
import RuleDslBuilder from './RuleDSLBuilder';
import { required, minLen, selectRequired } from '@/components/form/validators';
import FormSwitchField from '@/components/form/FormSwitchField';

const SEVERITY_OPTIONS = [
  { label: 'LOW',      value: 'low' },
  { label: 'MEDIUM',   value: 'medium' },
  { label: 'HIGH',     value: 'high' },
  { label: 'CRITICAL', value: 'critical' },
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
  const [useWizard, setUseWizard] = useState(true);

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
      size="lg"
      onValid={onValid}
      onInvalid={() => {}}
    >
      <div className="grid pt-2 gap-4">
        <div className="col-12">
          <FormInputField name="name" label="Nombre" validators={[required, minLen(5)]} />
        </div>

        <div className="col-12">
          <div className="flex align-items-center justify-content-between">
            <h3 className="m-0 text-lg">Asistente de condiciones</h3>
            <div className="flex align-items-center gap-2">
              <span className="text-600 text-sm">Usar asistente</span>
              <SwitchField checked={useWizard} onCheckedChange={setUseWizard} label="" />
            </div>
          </div>

          {useWizard && <RuleDslBuilder />}
        </div>

        {!useWizard && (
          <div className="col-12">
            <FormTextAreaField
              name="dsl_expression"
              label="Expresión (DSL)"
              autoResize
              rows={5}
              validators={[required, minLen(10)]}
              className="w-full"
            />
          </div>
        )}

        <div className="col-12 md:col-6">
          <FormSelectField name="severity" label="Severidad" options={SEVERITY_OPTIONS} validators={[selectRequired]} />
        </div>

        {'enabled' in initialValues && (
          <div className="col-12 md:col-3">
            <FormSwitchField name="enabled" label="Activa" className="w-full" />
          </div>
        )}
      </div>
    </FormDialog>
  );
}
