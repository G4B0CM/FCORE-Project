'use client';

import React, { useEffect, useMemo, useState } from 'react';
import NumberField, { NumberValidator } from '@/components/ui/NumberField';
import { useFormContext, FieldValidator } from './FormProvider';

export type FormNumberFieldProps = Omit<React.ComponentProps<typeof NumberField>, 'value' | 'onValueChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'> & {
    name: string;
    validators?: NumberValidator | NumberValidator[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormNumberField(props: FormNumberFieldProps) {
    const { name, validators, validateOn, initiallyTouched, validateOnMount, ...rest } = props;
    const form = useFormContext();
    const initial = form.getInitialValue(name);
    const [val, setVal] = useState<number | null>(typeof initial === 'number' ? (initial as number) : null);

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn((typeof value === 'number' || value === null) ? (value as number | null) : null));
    }, [validators]);

    useEffect(() => {
        form.register({ name, getValue: () => val, validators: vList });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <NumberField
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
