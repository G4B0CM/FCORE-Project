'use client';

import React, { forwardRef, useEffect, useId, useMemo, useState } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';

export type SelectValidator<T> = (value: T | null) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type SelectFieldProps<T> = {
    id?: string;
    name?: string;
    label?: string;
    value: T | null;
    onValueChange: (value: T | null) => void;
    options: T[];
    optionLabel?: keyof T | ((option: T) => string);
    optionValue?: keyof T | ((option: T) => unknown);
    placeholder?: string;
    className?: string;
    containerClassName?: string;
    panelClassName?: string;
    validate?: SelectValidator<T> | SelectValidator<T>[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    filter?: boolean;
    filterPlaceholder?: string;
    itemTemplate?: (option: T) => React.ReactNode;
    valueTemplate?: (option: T | null, props: any) => React.ReactNode;
    appendTo?: 'self' | 'body' | HTMLElement | null | undefined;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

const SelectFieldInner = <T,>(props: SelectFieldProps<T>, ref: React.Ref<HTMLDivElement>) => {
    const {
        id,
        name,
        label,
        value,
        onValueChange,
        options,
        optionLabel,
        optionValue,
        placeholder,
        className,
        containerClassName,
        panelClassName,
        validate,
        validateOn = 'blur',
        showError = true,
        disabled = false,
        filter = false,
        filterPlaceholder,
        itemTemplate,
        valueTemplate,
        appendTo,
        initiallyTouched = false,
        validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as SelectValidator<T>[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (validateOnMount) setError(validators.map((v) => v(value)).find(Boolean) ?? null);
    }, []);

    const runValidation = (val: T | null) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    const onChange = (e: DropdownChangeEvent) => {
        onValueChange(e.value as T | null);
        if (validateOn === 'change' || validateOn === 'both') {
            setError(runValidation(e.value as T | null));
        }
    };

    const onBlur = () => {
        setTouched(true);
        if (validateOn === 'blur' || validateOn === 'both') {
            setError(runValidation(value));
        }
    };

    const invalid = (touched || validateOnMount) && !!error;
    const inputClassName = [className, invalid ? 'p-invalid' : ''].filter(Boolean).join(' ');

    return (
        <div className={containerClassName} ref={ref}>
            <FloatLabel>
                <Dropdown
                    inputId={inputId}
                    name={name}
                    value={value as any}
                    onChange={onChange}
                    onBlur={onBlur}
                    options={options as any}
                    optionLabel={typeof optionLabel === 'string' ? (optionLabel as string) : undefined}
                    optionValue={typeof optionValue === 'string' ? (optionValue as string) : undefined}
                    placeholder={placeholder}
                    disabled={disabled}
                    filter={filter}
                    filterPlaceholder={filterPlaceholder}
                    className={inputClassName}
                    panelClassName={panelClassName}
                    itemTemplate={itemTemplate as any}
                    valueTemplate={valueTemplate as any}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
};

const SelectField = forwardRef(SelectFieldInner) as <T>(
    p: SelectFieldProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

export default SelectField;
