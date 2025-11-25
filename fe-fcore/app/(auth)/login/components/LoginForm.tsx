'use client';

import { RefObject } from 'react';
import { Toast } from 'primereact/toast';
import { FormProvider } from '@/components/form/FormProvider';
import FormInputField from '@/components/form/FormInputField';
import FormInputPassword from '@/components/form/FormInputPassword';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { required, minLen, qcode } from '@/components/form/validators';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginForm({ redirectTo, toastRef }: { redirectTo: string; toastRef?: RefObject<Toast> }) {
  const { submit, notifyInvalid, notifyError } = useLoginForm(redirectTo, toastRef);

  return (
    <FormProvider
      initialValues={{ username: '', password: '' }}
      defaults={{ validateOn: 'blur', touchOnMount: false, validateOnMount: false }}
    >
      <form className="flex flex-column gap-4" onSubmit={(e) => e.preventDefault()} aria-label="Formulario de acceso antifraude">
        <FormInputField
          name="username"
          label="Usuario"
          placeholder="e.g. C10010837"
          autoComplete="username"
          validators={[required, qcode]}
          initiallyTouched={false}
        />
        <FormInputPassword
          name="password"
          label="Contraseña"
          toggleMask
          feedback={false}
          autoComplete="current-password"
          validators={[required, minLen(3)]}
          initiallyTouched={false}
        />
        <FormSubmitButton
          label="Entrar"
          icon="pi pi-sign-in"
          className="w-full mt-2"
          severity="primary"
          onValid={async (values) => {
            try {
              await submit(values as any);
            } catch (e: any) {
              notifyError(e?.message);
            }
          }}
          onInvalid={(errors) => {
            const first = Object.values(errors).find(Boolean) as string | null;
            notifyInvalid(first);
          }}
        />
        <div className="flex align-items-center gap-2 mt-3">
          <i className="pi pi-shield text-primary"></i>
          <small className="text-600">Sesión protegida. Monitoreo y auditoría en tiempo real.</small>
        </div>
      </form>
    </FormProvider>
  );
}
