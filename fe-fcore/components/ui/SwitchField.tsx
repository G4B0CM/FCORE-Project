'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';

export type BoolValidator = (value: boolean) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type SwitchFieldProps = {
    id?: string;
    name?: string;
    label?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
    containerClassName?: string;
    validate?: BoolValidator | BoolValidator[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function SwitchField(props: SwitchFieldProps) {
    const {
        id, name, label,
        checked, onCheckedChange,
        className, containerClassName,
        validate, validateOn = 'change',
        showError = true, disabled = false,
        initiallyTouched = false, validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as BoolValidator[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: boolean) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    useEffect(() => {
        if (validateOnMount) setError(runValidation(checked));
    }, []);

    const onChange = (e: InputSwitchChangeEvent) => {
        onCheckedChange(!!e.value);
        if (validateOn === 'change' || validateOn === 'both') setError(runValidation(!!e.value));
    };

    const onBlur = () => {
        setTouched(true);
        if (validateOn === 'blur' || validateOn === 'both') setError(runValidation(checked));
    };

    const invalid = (touched || validateOnMount) && !!error;
    const cls = [className, invalid ? 'p-invalid' : ''].filter(Boolean).join(' ');

    return (
        <div className={containerClassName}>
            {label ? <label htmlFor={inputId} className="mr-2 aling-items-center">{label}</label> : null}
            <InputSwitch inputId={inputId} checked={checked} onChange={onChange} onBlur={onBlur} className={cls} disabled={disabled} />
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
}
