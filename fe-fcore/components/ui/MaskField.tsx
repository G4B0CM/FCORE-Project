'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { FloatLabel } from 'primereact/floatlabel';

export type TextValidator = (value: string) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type MaskFieldProps = {
    id?: string;
    name?: string;
    label: string;
    value?: string | null;               // <- admite null/undefined
    onValueChange: (value: string) => void;
    mask: string;                        // <- requerido
    slotChar?: string;
    autoClear?: boolean;
    unmask?: boolean;
    className?: string;
    containerClassName?: string;
    validate?: TextValidator | TextValidator[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    placeholder?: string;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function MaskField(props: MaskFieldProps) {
    const {
        id, name, label,
        value = '',                         // <- coerciona a string
        onValueChange,
        mask,
        slotChar = '_',                     // <- default seguro
        autoClear,
        unmask,
        className,
        containerClassName,
        validate,
        validateOn = 'blur',
        showError = true,
        disabled = false,
        placeholder,
        initiallyTouched = false,
        validateOnMount = false
    } = props;

    // Guard: mask obligatoria y no vacía
    if (!mask || typeof mask !== 'string' || mask.length === 0) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('MaskField: prop "mask" debe ser un string no vacío.');
        }
        // Evita crashear InputMask si te pasan mask incorrecta
        return null;
    }

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // solo al montar

    const onChange = (e: InputMaskChangeEvent) => {
        // En PrimeReact, el valor viene en e.value; usa fallback a e.target?.value
        const next = String((e.value ?? e.target?.value) ?? '');
        onValueChange(next);
        if (validateOn === 'change' || validateOn === 'both') {
            setError(runValidation(next));
        }
    };

    const onBlur = () => {
        setTouched(true);
        if (validateOn === 'blur' || validateOn === 'both') {
            setError(runValidation(value));
        }
    };

    const invalid = (touched || validateOnMount) && !!error;
    const cls = [className, invalid ? 'p-invalid' : ''].filter(Boolean).join(' ');

    return (
        <div className={containerClassName}>
            <FloatLabel>
                <InputMask
                    id={inputId}
                    name={name}
                    value={value ?? ''}          // <- nunca undefined
                    onChange={onChange}
                    onBlur={onBlur}
                    mask={mask}                  // <- garantizado no vacío
                    slotChar={slotChar}
                    autoClear={autoClear}
                    unmask={unmask}
                    className={cls}
                    disabled={disabled}
                    placeholder={placeholder}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
}
