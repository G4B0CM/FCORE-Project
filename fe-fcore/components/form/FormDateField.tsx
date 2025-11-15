'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DateField, { DateValidator } from '@/components/ui/DateField';
import { useFormContext, FieldValidator } from './FormProvider';

export type FormDateFieldProps = Omit<React.ComponentProps<typeof DateField>, 'value' | 'onValueChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'> & {
    name: string;
    validators?: DateValidator | DateValidator[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormDateField(props: FormDateFieldProps) {
    const { name, validators, validateOn, initiallyTouched, validateOnMount, ...rest } = props;
    const form = useFormContext();
    const initial = form.getInitialValue(name);
    const [val, setVal] = useState<Date | null>(initial instanceof Date ? (initial as Date) : null);

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn((value instanceof Date ? value : value ?? null) as Date | null));
    }, [validators]);

    useEffect(() => {
        form.register({ name, getValue: () => val, validators: vList });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <DateField
            {...rest}
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
