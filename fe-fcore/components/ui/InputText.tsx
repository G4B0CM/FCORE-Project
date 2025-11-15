import React from 'react';
import { InputText as Input } from "primereact/inputtext";

interface InputTextProps {
    id?: string;
    ariaDescribedBy?: string;
    small?: string;
    label?: string;
    isValid?: (() => boolean) | boolean;
    size?: number;
}

export default function InputText({ id, ariaDescribedBy, small, label, isValid, size }: InputTextProps) {
    const isValidBoolean = typeof isValid === 'function' ? isValid() : isValid;
    return (
        <div className="card flex justify-content-center">
            <div className="flex flex-column gap-2">
                <label htmlFor={`${id}Label`}>{label}</label>
                <Input id={id} aria-describedby={ariaDescribedBy} invalid={isValidBoolean} size={size} />
                <small id={`${id}Help`} className={isValid ? 'p' : 'p-error'}>
                    {small}
                </small>
            </div>
        </div>
    )
}