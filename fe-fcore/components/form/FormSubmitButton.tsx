'use client';

import React, { useState } from 'react';
import AppButton, { AppButtonProps } from '../ui/AppButton';
import { useFormContext } from './FormProvider';

export type FormSubmitButtonProps = Omit<AppButtonProps, 'type' | 'onClick' | 'loading'> & {
    onValid: (values: Record<string, unknown>) => void | Promise<void>;
    onInvalid?: (errors: Record<string, string | null>) => void | Promise<void>;
    loading?: boolean;
};

export default function FormSubmitButton(props: FormSubmitButtonProps) {
    const { onValid, onInvalid, loading, ...rest } = props;
    const form = useFormContext();
    const [busy, setBusy] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const submit = form.handleSubmit(
            async (values) => {
                setBusy(true);
                try {
                    await onValid(values);
                } finally {
                    setBusy(false);
                }
            },
            async (errors) => {
                if (onInvalid) await onInvalid(errors);
            }
        );
        submit(e as unknown as React.FormEvent);
    };

    return <AppButton {...rest} type="button" loading={busy || !!loading} onClick={handleClick} />;
}
