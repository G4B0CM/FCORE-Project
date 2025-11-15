'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { InputValidator as TextValidator } from '@/components/ui/FloatLabelInput';
import { useFormContext, FieldValidator } from './FormProvider';
import InputField from '../ui/FloatLabelInput';
import { classNames } from 'primereact/utils';

export type FormInputFieldProps = Omit<
    React.ComponentProps<typeof InputField>,
    'value' | 'onValueChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'
> & {
    name: string;
    validators?: TextValidator | TextValidator[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormInputField(props: FormInputFieldProps) {
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
        form.register({
            name,
            getValue: () => val,
            validators: vList
        });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <InputField
            {...rest}
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
