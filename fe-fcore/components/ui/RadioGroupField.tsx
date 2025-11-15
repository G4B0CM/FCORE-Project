'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';

export type RadioValidator<T> = (value: T | null) => string | null;

export type RadioGroupFieldProps<T> = {
    name?: string;
    label?: string;
    value: T | null;
    onValueChange: (value: T | null) => void;
    options: T[];
    optionLabel?: keyof T | ((o: T) => string);
    optionValue?: keyof T | ((o: T) => any);
    inline?: boolean;
    className?: string;
    containerClassName?: string;
    validate?: RadioValidator<T> | RadioValidator<T>[];
    showError?: boolean;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

function getLabel<T>(opt: T, optionLabel?: keyof T | ((o: T) => string)) {
    if (!opt) return '';
    if (typeof optionLabel === 'function') return optionLabel(opt);
    if (typeof optionLabel === 'string') return String((opt as any)[optionLabel]);
    return String(opt);
}
function getValue<T>(opt: T, optionValue?: keyof T | ((o: T) => any)) {
    if (typeof optionValue === 'function') return optionValue(opt);
    if (typeof optionValue === 'string') return (opt as any)[optionValue];
    return opt as any;
}

export default function RadioGroupField<T>(props: RadioGroupFieldProps<T>) {
    const {
        name, label, value, onValueChange, options, optionLabel, optionValue,
        inline = false, className, containerClassName,
        validate, showError = true, initiallyTouched = false, validateOnMount = false
    } = props;

    const validators = useMemo(() => {
        if (!validate) return [] as RadioValidator<T>[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: T | null) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    useEffect(() => {
        if (validateOnMount) setError(runValidation(value));
    }, []);

    const onChange = (e: RadioButtonChangeEvent) => {
        onValueChange(e.value as T);
        setError(runValidation(e.value as T));
    };

    const onBlur = () => {
        setTouched(true);
        setError(runValidation(value));
    };

    const invalid = (touched || validateOnMount) && !!error;

    return (
        <div className={[containerClassName, className].filter(Boolean).join(' ')}>
            {label ? <div className="mb-2">{label}</div> : null}
            <div className={inline ? 'flex gap-3 flex-wrap' : 'flex flex-column gap-3'}>
                {options.map((opt, idx) => {
                    const optVal = getValue<T>(opt, optionValue);
                    const optKey = `${name ?? 'radio'}-${idx}`;
                    return (
                        <div key={optKey} className="flex align-items-center">
                            <RadioButton inputId={optKey} name={name} value={optVal} onChange={onChange} onBlur={onBlur} checked={optVal === (value as any)} />
                            <label htmlFor={optKey} className="ml-2">{getLabel<T>(opt, optionLabel)}</label>
                        </div>
                    );
                })}
            </div>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
}
