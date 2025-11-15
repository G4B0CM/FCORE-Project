'use client';

import React, { useEffect, useMemo, useState } from 'react';
import InputPassword, {
    InputValidator as PwdValidator
} from '@/components/ui/InputPassword';
import { useFormContext, FieldValidator } from './FormProvider';
import { classNames } from 'primereact/utils';

export type FormInputPasswordProps = Omit<
    React.ComponentProps<typeof InputPassword>,
    'value' | 'onValueChange' | 'validate' | 'validateOn' | 'initiallyTouched' | 'validateOnMount'
> & {
    name: string;
    validators?: PwdValidator | PwdValidator[];
    validateOn?: 'blur' | 'change' | 'both';
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function FormInputPassword(props: FormInputPasswordProps) {
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
        <InputPassword
            {...rest}
            name={name}
            value={val}
            onValueChange={setVal}
            validate={Array.isArray(validators) ? validators : validators ? [validators] : []}
            validateOn={validateOn ?? form.defaults.validateOn ?? 'blur'}
            initiallyTouched={initiallyTouched ?? form.defaults.touchOnMount ?? false}
            validateOnMount={validateOnMount ?? form.defaults.validateOnMount ?? false}
            className={classNames('w-19rem', props.className)}
            containerClassName={classNames('w-full', props.containerClassName)}
        />
    );
}
