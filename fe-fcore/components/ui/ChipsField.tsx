'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { Chips, ChipsChangeEvent } from 'primereact/chips';
import { FloatLabel } from 'primereact/floatlabel';

export type ChipsValidator = (value: string[]) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type ChipsFieldProps = {
    id?: string;
    name?: string;
    label: string;
    value: string[];
    onValueChange: (value: string[]) => void;
    className?: string;
    containerClassName?: string;
    validate?: ChipsValidator | ChipsValidator[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    separator?: string;
    max?: number;
    allowDuplicate?: boolean;
    placeholder?: string;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function ChipsField(props: ChipsFieldProps) {
    const {
        id, name, label, value, onValueChange,
        className, containerClassName,
        validate, validateOn = 'blur', showError = true, disabled = false,
        separator, max, allowDuplicate, placeholder,
        initiallyTouched = false, validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as ChipsValidator[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: string[]) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    useEffect(() => {
        if (validateOnMount) setError(runValidation(value));
    }, []);

    const onChange = (e: ChipsChangeEvent) => {
        const next = (e.value ?? []) as string[];
        onValueChange(next);
        if (validateOn === 'change' || validateOn === 'both') setError(runValidation(next));
    };

    const onBlur = () => {
        setTouched(true);
        if (validateOn === 'blur' || validateOn === 'both') setError(runValidation(value));
    };

    const invalid = (touched || validateOnMount) && !!error;
    const cls = [className, invalid ? 'p-invalid' : ''].filter(Boolean).join(' ');

    return (
        <div className={containerClassName}>
            <FloatLabel>
                <Chips
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur as any}
                    className={cls}
                    disabled={disabled}
                    separator={separator}
                    max={max}
                    allowDuplicate={allowDuplicate}
                    placeholder={placeholder}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
}
