'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from 'primereact/floatlabel';

export type TextValidator = (value: string) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type TextAreaFieldProps = {
    id?: string;
    name?: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    containerClassName?: string;
    validate?: TextValidator | TextValidator[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    placeholder?: string;
    rows?: number;
    cols?: number;
    autoResize?: boolean;
    maxLength?: number;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function TextAreaField(props: TextAreaFieldProps) {
    const {
        id, name, label, value, onValueChange,
        className, containerClassName,
        validate, validateOn = 'blur', showError = true, disabled = false, placeholder,
        rows = 5, cols, autoResize, maxLength,
        initiallyTouched = false, validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as TextValidator[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: string) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    useEffect(() => {
        if (validateOnMount) setError(runValidation(value));
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const next = e.target.value ?? '';
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
                <InputTextarea
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={cls}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    cols={cols}
                    autoResize={autoResize}
                    maxLength={maxLength}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
}
