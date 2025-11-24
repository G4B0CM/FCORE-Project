'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';

export type MultiSelectValidator<T> = (value: T[]) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type MultiSelectFieldProps<T> = {
    id?: string;
    name?: string;
    label?: string;
    value: T[];
    onValueChange: (value: T[]) => void;
    options: T[];
    optionLabel?: keyof T | ((o: T) => string);
    optionValue?: keyof T | ((o: T) => unknown);
    placeholder?: string;
    className?: string;
    containerClassName?: string;
    validate?: MultiSelectValidator<T> | MultiSelectValidator<T>[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    filter?: boolean;
    filterPlaceholder?: string;
    maxSelectedLabels?: number;
    display?: 'comma' | 'chip';
    itemTemplate?: (o: T) => React.ReactNode;
    panelHeaderTemplate?: React.ReactNode;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

const MultiSelectFieldInner = <T,>(props: MultiSelectFieldProps<T>) => {
    const {
        id, name, label, value, onValueChange, options,
        optionLabel, optionValue,
        placeholder, className, containerClassName,
        validate, validateOn = 'blur', showError = true, disabled = false,
        filter, filterPlaceholder, maxSelectedLabels, display, itemTemplate, panelHeaderTemplate,
        initiallyTouched = false, validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as MultiSelectValidator<T>[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: T[]) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    useEffect(() => {
        if (validateOnMount) setError(runValidation(value));
    }, []);

    const onChange = (e: MultiSelectChangeEvent) => {
        const next = (e.value ?? []) as T[];
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
                <MultiSelect
                    id={inputId}
                    value={value as any}
                    onChange={onChange}
                    onBlur={onBlur as any}
                    options={options as any}
                    optionLabel={typeof optionLabel === 'string' ? (optionLabel as string) : undefined}
                    optionValue={typeof optionValue === 'string' ? (optionValue as string) : undefined}
                    placeholder={placeholder}
                    className={cls}
                    disabled={disabled}
                    filter={filter}
                    filterPlaceholder={filterPlaceholder}
                    maxSelectedLabels={maxSelectedLabels}
                    display={display}
                    itemTemplate={itemTemplate as any}
                    panelHeaderTemplate={panelHeaderTemplate}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
};

export default MultiSelectFieldInner as <T>(p: MultiSelectFieldProps<T>) => React.ReactElement;
