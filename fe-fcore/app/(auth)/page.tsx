'use client';

import { FormProvider, useFormContext } from '@/components/form/FormProvider';
import FormInputField from '@/components/form/FormInputField';
import FormInputPassword from '@/components/form/FormInputPassword';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { required } from '@/components/form/validators';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

function LoginForm() {
    const form = useFormContext();
    const toast = useRef<Toast>(null);

    const onValid = async (values: Record<string, unknown>) => {
        toast.current?.show({ severity: 'success', summary: 'OK', detail: 'Inicio de sesión', life: 2500 });
        console.log(values);
    };

    const onInvalid = async (errors: Record<string, string | null>) => {
        Object.entries(errors).forEach(([field, msg]) => {
            if (msg) toast.current?.show({ severity: 'error', summary: field, detail: msg, life: 3500 });
        });
    };

    return (
        <div className="space-y-4 max-w-md">
            <Toast ref={toast} position="bottom-right" />
            <FormInputField
                name="username"
                label="Usuario"
                validators={[required]}
                containerClassName="w-full"
                className="w-full"
                autoComplete="username"
                required
            />
            <FormInputPassword
                name="password"
                label="Contraseña"
                validators={[required]}
                containerClassName="w-full"
                className="w-full"
                autoComplete="current-password"
                required
                feedback={false}
                showHelp={false}
                toggleMask
            />
            <FormSubmitButton
                label="Entrar"
                full
                icon="pi pi-sign-in"
                onValid={onValid}
                onInvalid={onInvalid}
            />
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="p-4">
            <FormProvider
                initialValues={{ username: '', password: '' }}
                defaults={{ validateOn: 'both', touchOnMount: false, validateOnMount: false }}
            >
                <LoginForm />
            </FormProvider>
        </div>
    );
}
