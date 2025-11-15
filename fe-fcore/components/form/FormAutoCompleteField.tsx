'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AutoCompleteField, { AutoCompleteValidator } from '@/components/ui/AutoCompleteField';
import { useFormContext, FieldValidator } from './FormProvider';

export type FormAutoCompleteFieldProps<T> = Omit<React.ComponentProps<typeof AutoCompleteField<T>>, 'value' | 'onValueChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'> & {
    name: string;
    validators?: AutoCompleteValidator<T> | AutoCompleteValidator<T>[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormAutoCompleteField<T>(props: FormAutoCompleteFieldProps<T>) {
    const { name, validators, validateOn, initiallyTouched, validateOnMount, ...rest } = props as any;
    const form = useFormContext();
    const initial = form.getInitialValue(name);
    const [val, setVal] = useState<any>(initial ?? null);

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn(value ?? null));
    }, [validators]);

    useEffect(() => {
        form.register({ name, getValue: () => val, validators: vList });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <AutoCompleteField<any>
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
