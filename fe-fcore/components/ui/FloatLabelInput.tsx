'use client';

import React, { forwardRef, useEffect, useId, useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';

export type InputValidator = (value: string) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type InputFieldProps = {
    id?: string;
    name?: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    className?: string;
    containerClassName?: string;
    validate?: InputValidator | InputValidator[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    autoComplete?: string;
    required?: boolean;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(props, ref) {
    const {
        id,
        name,
        label,
        value,
        onValueChange,
        type = 'text',
        placeholder,
        className,
        containerClassName,
        validate,
        validateOn = 'blur',
        showError = true,
        disabled = false,
        autoComplete,
        required = false,
        initiallyTouched = false,
        validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as InputValidator[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    useEffect(() => {
        if (validateOnMount) setError(runValidation(value));
    }, []);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: string) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        onValueChange(newVal);
        if (validateOn === 'change' || validateOn === 'both') {
            setError(runValidation(newVal));
        }
    };

    const handleBlur = () => {
        setTouched(true);
        if (validateOn === 'blur' || validateOn === 'both') {
            setError(runValidation(value));
        }
    };


    const invalid = (touched || validateOnMount) && !!error;

    return (
        <div className={containerClassName}>
            <FloatLabel>
                <InputText
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={className}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    required={required}
                    invalid={invalid}
                    ref={ref}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
});

export default InputField;
