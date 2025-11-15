'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { FloatLabel } from 'primereact/floatlabel';

export type AutoCompleteValidator<T> = (value: T | string | null) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type AutoCompleteFieldProps<T> = {
    id?: string;
    name?: string;
    label: string;
    value: T | string | null;
    onValueChange: (value: T | string | null) => void;
    suggestions: T[] | string[];
    onSearch?: (e: AutoCompleteCompleteEvent) => void;
    optionLabel?: keyof T | ((o: T) => string);
    dropdown?: boolean;
    forceSelection?: boolean;
    placeholder?: string;
    className?: string;
    containerClassName?: string;
    validate?: AutoCompleteValidator<T> | AutoCompleteValidator<T>[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

const AutoCompleteFieldInner = <T,>(props: AutoCompleteFieldProps<T>) => {
    const {
        id, name, label, value, onValueChange,
        suggestions, onSearch, optionLabel, dropdown, forceSelection,
        placeholder, className, containerClassName,
        validate, validateOn = 'blur', showError = true, disabled = false,
        initiallyTouched = false, validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as AutoCompleteValidator<T>[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: any) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    useEffect(() => {
        if (validateOnMount) setError(runValidation(value));
    }, []);

    const onChange = (e: any) => {
        const next = e.value ?? null;
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
                <AutoComplete
                    id={inputId}
                    value={value as any}
                    suggestions={suggestions as any}
                    completeMethod={onSearch}
                    onChange={onChange}
                    onBlur={onBlur as any}
                    dropdown={dropdown}
                    forceSelection={forceSelection}
                    field={typeof optionLabel === 'string' ? (optionLabel as string) : undefined}
                    className={cls}
                    disabled={disabled}
                    placeholder={placeholder}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
};

export default AutoCompleteFieldInner as <T>(p: AutoCompleteFieldProps<T>) => React.ReactElement;
