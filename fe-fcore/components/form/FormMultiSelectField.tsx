'use client';

import React, { useEffect, useMemo, useState } from 'react';
import MultiSelectField, { MultiSelectValidator } from '@/components/ui/MultiSelectField';
import { useFormContext, FieldValidator } from './FormProvider';

export type FormMultiSelectFieldProps<T> = Omit<React.ComponentProps<typeof MultiSelectField<T>>, 'value' | 'onValueChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'> & {
    name: string;
    validators?: MultiSelectValidator<T> | MultiSelectValidator<T>[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormMultiSelectField<T>(props: FormMultiSelectFieldProps<T>) {
    const { name, validators, validateOn, initiallyTouched, validateOnMount, ...rest } = props as any;
    const form = useFormContext();
    const initial = form.getInitialValue(name);
    const [val, setVal] = useState<T[]>(Array.isArray(initial) ? (initial as T[]) : []);

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn(Array.isArray(value) ? (value as T[]) : []));
    }, [validators]);

    useEffect(() => {
        form.register({ name, getValue: () => val, validators: vList });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <MultiSelectField<T>
            {...(rest as any)}
            name={name}
            value={val}
            onValueChange={setVal}
            validate={Array.isArray(validators) ? validators : validators ? [validators] : []}
            validateOn={validateOn ?? form.defaults.validateOn ?? 'blur'}
            initiallyTouched={initiallyTouched ?? form.defaults.touchOnMount ?? false}
            validateOnMount={validateOnMount ?? form.defaults.validateOnMount ?? false}
        />
    );
}
