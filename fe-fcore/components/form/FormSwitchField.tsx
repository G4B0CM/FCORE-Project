'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SwitchField, { BoolValidator } from '@/components/ui/SwitchField';
import { useFormContext, FieldValidator } from './FormProvider';

export type FormSwitchFieldProps = Omit<React.ComponentProps<typeof SwitchField>, 'checked' | 'onCheckedChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'> & {
    name: string;
    validators?: BoolValidator | BoolValidator[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormSwitchField(props: FormSwitchFieldProps) {
    const { name, validators, validateOn, initiallyTouched, validateOnMount, ...rest } = props;
    const form = useFormContext();
    const initial = form.getInitialValue(name);
    const [val, setVal] = useState<boolean>(!!initial);

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn(!!value));
    }, [validators]);

    useEffect(() => {
        form.register({ name, getValue: () => val, validators: vList });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <SwitchField
            {...rest}
            name={name}
            checked={val}
            onCheckedChange={setVal}
            validate={Array.isArray(validators) ? validators : validators ? [validators] : []}
            validateOn={validateOn ?? form.defaults.validateOn ?? 'change'}
            initiallyTouched={initiallyTouched ?? form.defaults.touchOnMount ?? false}
            validateOnMount={validateOnMount ?? form.defaults.validateOnMount ?? false}
        />
    );
}
