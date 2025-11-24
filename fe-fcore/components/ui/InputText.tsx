import React, { ChangeEvent } from 'react';
import { InputText as Input } from "primereact/inputtext";
import { classNames } from 'primereact/utils';

interface InputTextProps {
    id?: string;
    ariaDescribedBy?: string;
    small?: string;
    label?: string;
    isValid?: (() => boolean) | boolean;
    size?: number;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string;
    className?: string;
}

export default function InputText({ id, ariaDescribedBy, small, label, isValid, size ,value, onChange, placeholder, className}: InputTextProps) {
    const isValidBoolean = typeof isValid === 'function' ? isValid() : isValid;
    return (
        <div className="card flex justify-content-center">
            <div className="flex flex-column gap-2">
                <label htmlFor={`${id}Label`}>{label}</label>
                <Input id={id} value={value} 
                aria-describedby={ariaDescribedBy} 
                invalid={isValidBoolean} 
                size={size} 
                onChange={onChange}
                placeholder={placeholder}
                className={classNames(className)}
                />
                <small id={`${id}Help`} className={isValid ? 'p' : 'p-error'}>
                    {small}
                </small>
            </div>
        </div>
    )
}