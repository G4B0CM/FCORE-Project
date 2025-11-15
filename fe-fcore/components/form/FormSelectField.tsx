'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SelectField, { SelectFieldProps, SelectValidator } from '@/components/ui/SelectField';
import { useFormContext, FieldValidator } from './FormProvider';
import { classNames } from 'primereact/utils';

type BaseProps<T> = Omit<
    SelectFieldProps<T>,
    'value' | 'onValueChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'
>;

export type FormSelectFieldProps<T> = BaseProps<T> & {
    name: string;
    validators?: SelectValidator<T> | SelectValidator<T>[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormSelectField<T>(props: FormSelectFieldProps<T>) {
    const { name, validators, validateOn, initiallyTouched, validateOnMount, ...rest } = props;
    const form = useFormContext();
    const initial = form.getInitialValue(name);
    const [val, setVal] = useState<T | null>((initial as T | null) ?? null);

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn((value as T | null) ?? null));
    }, [validators]);

    useEffect(() => {
        form.register({
            name,
            getValue: () => val,
            validators: vList
        });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <SelectField<T>
            {...(rest as any)}
            name={name}
            value={val}
            onValueChange={setVal}
            validate={Array.isArray(validators) ? validators : validators ? [validators] : []}
            validateOn={validateOn ?? form.defaults.validateOn ?? 'blur'}
            initiallyTouched={initiallyTouched ?? form.defaults.touchOnMount ?? false}
            validateOnMount={validateOnMount ?? form.defaults.validateOnMount ?? false}
            className={classNames('w-full', props.className)}
        />
    );
}
