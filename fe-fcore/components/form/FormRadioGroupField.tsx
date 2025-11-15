'use client';

import React, { useEffect, useMemo, useState } from 'react';
import RadioGroupField, { RadioValidator } from '@/components/ui/RadioGroupField';
import { useFormContext, FieldValidator } from './FormProvider';

export type FormRadioGroupFieldProps<T> = Omit<React.ComponentProps<typeof RadioGroupField<T>>, 'value' | 'onValueChange' | 'validate' | 'initiallyTouched' | 'validateOnMount'> & {
    name: string;
    validators?: RadioValidator<T> | RadioValidator<T>[];
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormRadioGroupField<T>(props: FormRadioGroupFieldProps<T>) {
    const { name, validators, initiallyTouched, validateOnMount, ...rest } = props as any;
    const form = useFormContext();
    const initial = form.getInitialValue(name);
    const [val, setVal] = useState<T | null>((initial as T) ?? null);

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn((value as T) ?? null));
    }, [validators]);

    useEffect(() => {
        form.register({ name, getValue: () => val, validators: vList });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <RadioGroupField<T>
            {...(rest as any)}
            name={name}
            value={val}
            onValueChange={setVal}
            validate={Array.isArray(validators) ? validators : validators ? [validators] : []}
            initiallyTouched={initiallyTouched ?? form.defaults.touchOnMount ?? false}
            validateOnMount={validateOnMount ?? form.defaults.validateOnMount ?? false}
        />
    );
}
