'use client';

import React, { useEffect, useMemo, useState } from 'react';
import MaskField, { TextValidator } from '@/components/ui/MaskField';
import { useFormContext, FieldValidator } from './FormProvider';

export type FormMaskFieldProps = Omit<React.ComponentProps<typeof MaskField>, 'value' | 'onValueChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'> & {
    name: string;
    validators?: TextValidator | TextValidator[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormMaskField(props: FormMaskFieldProps) {
    const { name, validators, validateOn, initiallyTouched, validateOnMount, ...rest } = props;
    const form = useFormContext();
    const initial = form.getInitialValue(name);
    const [val, setVal] = useState<string>(typeof initial === 'string' ? (initial as string) : '');

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn(String(value ?? '')));
    }, [validators]);

    useEffect(() => {
        form.register({ name, getValue: () => val, validators: vList });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <MaskField
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
