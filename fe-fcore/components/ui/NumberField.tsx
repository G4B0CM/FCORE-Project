'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { FloatLabel } from 'primereact/floatlabel';

export type NumberValidator = (value: number | null) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type NumberFieldProps = {
    id?: string;
    name?: string;
    label: string;
    value: number | null;
    onValueChange: (value: number | null) => void;
    className?: string;
    containerClassName?: string;
    validate?: NumberValidator | NumberValidator[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    useGrouping?: boolean;
    mode?: 'decimal' | 'currency';
    currency?: string;
    locale?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function NumberField(props: NumberFieldProps) {
    const {
        id, name, label, value, onValueChange,
        className, containerClassName,
        validate, validateOn = 'blur', showError = true, disabled = false, placeholder,
        min, max, minFractionDigits, maxFractionDigits, useGrouping,
        mode, currency, locale, inputProps,
        initiallyTouched = false, validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as NumberValidator[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: number | null) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    useEffect(() => {
        if (validateOnMount) setError(runValidation(value));
    }, []);

    const onChange = (e: InputNumberValueChangeEvent) => {
        const next = (typeof e.value === 'number' ? e.value : e.value ?? null) as number | null;
        onValueChange(next);
        if (validateOn === 'change' || validateOn === 'both') setError(runValidation(next));
    };

    const onBlur = () => {
        setTouched(true);
        if (validateOn === 'blur' || validateOn === 'both') setError(runValidation(value));
    };

    const invalid = (touched || validateOnMount) && !!error;
    const inputClassName = [className, invalid ? 'p-invalid' : ''].filter(Boolean).join(' ');

    return (
        <div className={containerClassName}>
            <FloatLabel>
                <InputNumber
                    inputId={inputId}
                    value={value as any}
                    onValueChange={onChange}
                    onBlur={onBlur}
                    className={inputClassName}
                    disabled={disabled}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    minFractionDigits={minFractionDigits}
                    maxFractionDigits={maxFractionDigits}
                    useGrouping={useGrouping}
                    mode={mode}
                    currency={currency}
                    locale={locale}
                    inputRef={undefined}
                    inputMode={undefined}
                    {...(inputProps as any)}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
}
