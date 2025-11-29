// src/app/(protected)/cases/components/CaseNoteDialog.tsx
'use client';

import FormDialog from '@/components/form/FormDialog';
import FormTextAreaField from '@/components/form/FormTextAreaField';
import { minLen, required } from '@/components/form/validators';

type Props = {
  visible: boolean;
  onClose: () => void;
  onValid: (note: string) => Promise<void>;
};

export default function CaseNoteDialog({ visible, onClose, onValid }: Props) {
  return (
    <FormDialog
      visible={visible}
      onClose={onClose}
      title="Agregar nota"
      initialValues={{ note: '' }}
      defaults={{ validateOn: 'both', touchOnMount: true, validateOnMount: true }}
      submitLabel="Guardar"
      submitIcon="pi pi-check"
      submitSeverity="success"
      size="md"
      onValid={async (values) => onValid(String(values.note ?? '').trim())}
      onInvalid={() => {}}
    >
      <div className="grid pt-2 gap-4">
        <div className="col-12">
          <FormTextAreaField name="note" label="Nota" className='w-full' autoResize rows={4} validators={[required, minLen(5)]} />
        </div>
      </div>
    </FormDialog>
  );
}
