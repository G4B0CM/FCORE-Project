'use client';

import React, { createContext, useContext, useMemo, useRef } from 'react';

export type FieldValidator = (value: unknown, values: Record<string, unknown>) => string | null;

type FieldController = {
    name: string;
    getValue: () => unknown;
    validators: FieldValidator[];
};

type FormContextType = {
    register: (controller: FieldController) => void;
    unregister: (name: string) => void;
    getInitialValue: (name: string) => unknown;
    getValues: () => Record<string, unknown>;
    validateAll: () => Record<string, string | null>;
    handleSubmit: (
        onValid: (values: Record<string, unknown>) => void | Promise<void>,
        onInvalid?: (errors: Record<string, string | null>) => void | Promise<void>
    ) => (e: React.FormEvent) => void;
    defaults: {
        validateOn?: 'blur' | 'change' | 'both';
        touchOnMount?: boolean;
        validateOnMount?: boolean;
    };
};

const FormContext = createContext<FormContextType | null>(null);

export function useFormContext() {
    const ctx = useContext(FormContext);
    if (!ctx) throw new Error('useFormContext must be used within FormProvider');
    return ctx;
}

export type FormProviderProps = {
    initialValues?: Record<string, unknown>;
    children: React.ReactNode;
    defaults?: {
        validateOn?: 'blur' | 'change' | 'both';
        touchOnMount?: boolean;
        validateOnMount?: boolean;
    };
};

export function FormProvider({ initialValues, children, defaults }: FormProviderProps) {
    const ctrlsRef = useRef<Map<string, FieldController>>(new Map());
    const initialRef = useRef<Record<string, unknown>>(initialValues ?? {});
    const def = useMemo(
        () => ({
            validateOn: defaults?.validateOn,
            touchOnMount: defaults?.touchOnMount,
            validateOnMount: defaults?.validateOnMount
        }),
        [defaults]
    );

    const value = useMemo<FormContextType>(() => {
        return {
            register: (c) => {
                ctrlsRef.current.set(c.name, c);
            },
            unregister: (name) => {
                ctrlsRef.current.delete(name);
            },
            getInitialValue: (name) => initialRef.current[name],
            getValues: () => {
                const out: Record<string, unknown> = {};
                for (const [name, c] of ctrlsRef.current.entries()) out[name] = c.getValue();
                return out;
            },
            validateAll: () => {
                const values: Record<string, unknown> = {};
                for (const [name, c] of ctrlsRef.current.entries()) values[name] = c.getValue();
                const errors: Record<string, string | null> = {};
                for (const [name, c] of ctrlsRef.current.entries()) {
                    let err: string | null = null;
                    for (const v of c.validators) {
                        const res = v(values[name], values);
                        if (res) {
                            err = res;
                            break;
                        }
                    }
                    errors[name] = err;
                }
                return errors;
            },
            handleSubmit:
                (onValid, onInvalid) =>
                    (e) => {
                        e.preventDefault();
                        const errors = (value as FormContextType).validateAll();
                        const hasErr = Object.values(errors).some(Boolean);
                        if (hasErr) {
                            if (onInvalid) onInvalid(errors);
                            return;
                        }
                        const vals = (value as FormContextType).getValues();
                        onValid(vals);
                    },
            defaults: def
        };
    }, [def]);

    return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}
