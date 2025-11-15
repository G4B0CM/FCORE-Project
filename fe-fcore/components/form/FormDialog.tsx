'use client';

import React, { useState } from 'react';
import AppDialog, { AppDialogProps } from '@/components/ui/AppDialog';
import { FormProvider } from './FormProvider';
import AppButton from '@/components/ui/AppButton';
import FormSubmitButton from './FormSubmitButton';

export type FormDialogProps = {
    visible: boolean;
    onClose: () => void;
    title: React.ReactNode;
    initialValues?: Record<string, unknown>;
    defaults?: {
        validateOn?: 'blur' | 'change' | 'both';
        touchOnMount?: boolean;
        validateOnMount?: boolean;
    };
    submitLabel?: string;
    submitIcon?: string;
    submitSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
    cancelLabel?: string;
    cancelIcon?: string;
    size?: AppDialogProps['size'];
    footerExtra?: React.ReactNode;
    onValid: (values: Record<string, unknown>) => void | Promise<void>;
    onInvalid?: (errors: Record<string, string | null>) => void | Promise<void>;
    children: React.ReactNode;
};

export default function FormDialog(props: FormDialogProps) {
    const {
        visible,
        onClose,
        title,
        initialValues,
        defaults,
        submitLabel = 'Guardar',
        submitIcon = 'pi pi-check',
        submitSeverity = 'success',
        cancelLabel = 'Cancelar',
        cancelIcon = 'pi pi-times',
        size = 'md',
        footerExtra,
        onValid,
        onInvalid,
        children
    } = props;

    const [closing, setClosing] = useState(false);

    const footer = (
        <div className="flex w-full justify-content-end gap-2">
            {footerExtra}
            <AppButton label={cancelLabel} icon={cancelIcon} severity="secondary" onClick={() => onClose()} />
            <FormSubmitButton
                label={submitLabel}
                icon={submitIcon}
                severity={submitSeverity}
                onValid={async (values) => {
                    try {
                        await onValid(values);
                        setClosing(true);
                        onClose();
                    } finally {
                        setClosing(false);
                    }
                }}
                onInvalid={onInvalid}
                loading={closing}
            />
        </div>
    );

    return (
        <FormProvider initialValues={initialValues} defaults={defaults}>
            <AppDialog
                visible={visible}
                onHide={onClose}
                title={title}
                size={size}
                footer={
                    <div className="flex w-full justify-content-end gap-2">
                        {footerExtra}
                        <AppButton
                            label={cancelLabel}
                            icon={cancelIcon}
                            severity="secondary"
                            onClick={onClose}
                        />
                        <FormSubmitButton
                            label={submitLabel}
                            icon={submitIcon}
                            severity={submitSeverity}
                            onValid={async (values) => {
                                try {
                                    await onValid(values);
                                    setClosing(true);
                                    onClose();
                                } finally {
                                    setClosing(false);
                                }
                            }}
                            onInvalid={onInvalid}
                            loading={closing}
                        />
                    </div>
                }
            >
                <form className="space-y-4">{children}</form>
            </AppDialog>
        </FormProvider>
    );
}
