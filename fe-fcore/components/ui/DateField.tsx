'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';

export type DateValidator = (value: Date | null) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type DateFieldProps = {
    id?: string;
    name?: string;
    label: string;
    value: Date | null;
    onValueChange: (value: Date | null) => void;
    className?: string;
    containerClassName?: string;
    validate?: DateValidator | DateValidator[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    placeholder?: string;
    dateFormat?: string;
    showIcon?: boolean;
    showTime?: boolean;
    hourFormat?: '12' | '24';
    timeOnly?: boolean;
    minDate?: Date;
    maxDate?: Date;
    touchUI?: boolean;
    readOnlyInput?: boolean;
    showButtonBar?: boolean;
    inline?: boolean;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

export default function DateField(props: DateFieldProps) {
    const {
        id, name, label, value, onValueChange,
        className, containerClassName,
        validate, validateOn = 'blur', showError = true, disabled = false, placeholder,
        dateFormat, showIcon, showTime, hourFormat, timeOnly, minDate, maxDate, touchUI, readOnlyInput, showButtonBar, inline,
        initiallyTouched = false, validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as DateValidator[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: Date | null) => {
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
        const next = (e.value ?? null) as Date | null;
        onValueChange(next);
        if (validateOn === 'change' || validateOn === 'both') setError(runValidation(next));
    };

    const onBlur = () => {
        setTouched(true);
        if (validateOn === 'blur' || validateOn === 'both') setError(runValidation(value));
    };

    const invalid = (touched || validateOnMount) && !!error;
    const inputClassName = [className, invalid ? 'p-invalid' : ''].filter(Boolean).join(' ');

    const control = (
        <Calendar
            id={inputId}
            value={value as any}
            onChange={onChange}
            onBlur={onBlur}
            className={inputClassName}
            disabled={disabled}
            placeholder={placeholder}
            dateFormat={dateFormat}
            showIcon={showIcon}
            showTime={showTime}
            hourFormat={hourFormat}
            timeOnly={timeOnly}
            minDate={minDate}
            maxDate={maxDate}
            touchUI={touchUI}
            readOnlyInput={readOnlyInput}
            showButtonBar={showButtonBar}
            inline={inline}
        />
    );

    if (inline) {
        return (
            <div className={containerClassName}>
                {control}
                {showError && invalid && <small className="p-error block mt-1">{error}</small>}
            </div>
        );
    }

    return (
        <div className={containerClassName}>
            <FloatLabel>
                {control}
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
}
