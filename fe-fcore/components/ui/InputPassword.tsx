'use client';

import React, { forwardRef, useEffect, useId, useMemo, useState } from 'react';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

export type InputValidator = (value: string) => string | null;
type ValidateOn = 'blur' | 'change' | 'both';

export type InputPasswordProps = {
    id?: string;
    name?: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    containerClassName?: string;
    validate?: InputValidator | InputValidator[];
    validateOn?: ValidateOn;
    showError?: boolean;
    disabled?: boolean;
    autoComplete?: string;
    required?: boolean;
    feedback?: boolean;
    showHelp?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    toggleMask?: boolean;
    initiallyTouched?: boolean;
    validateOnMount?: boolean;
};

const DefaultFooter = () => (
    <>
        <Divider />
        <p className="mt-2">Recomendaciones</p>
        <ul className="pl-2 ml-2 mt-0 line-height-3">
            <li>Al menos una minúscula</li>
            <li>Al menos una mayúscula</li>
            <li>Al menos un número</li>
            <li>Mínimo 8 caracteres</li>
        </ul>
    </>
);

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(function InputPassword(props, ref) {
    const {
        id,
        name,
        label,
        value,
        onValueChange,
        className,
        containerClassName,
        validate,
        validateOn = 'blur',
        showError = true,
        disabled = false,
        autoComplete,
        required = false,
        feedback = false,
        showHelp = false,
        header,
        footer,
        toggleMask = true,
        initiallyTouched = false,
        validateOnMount = false
    } = props;

    const reactId = useId();
    const inputId = id ?? name ?? reactId;

    const validators = useMemo(() => {
        if (!validate) return [] as InputValidator[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const [touched, setTouched] = useState<boolean>(initiallyTouched);
    const [error, setError] = useState<string | null>(null);

    const runValidation = (val: string) => {
        for (const v of validators) {
            const res = v(val);
            if (res) return res;
        }
        return null;
    };

    useEffect(() => {
        if (validateOnMount) {
            setError(runValidation(value));
        }
    }, []);

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
    const inputClassName = [className, invalid ? 'p-invalid' : ''].filter(Boolean).join(' ');

    const computedHeader = showHelp ? header ?? <div className="font-bold mb-3">Elige una contraseña</div> : undefined;
    const computedFooter = showHelp ? footer ?? <DefaultFooter /> : undefined;

    return (
        <div className={classNames('w-full', containerClassName)}>
            <FloatLabel className='w-full'>
                <Password
                    inputId={inputId}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full"
                    inputClassName={classNames('w-full', inputClassName)}
                    disabled={disabled}
                    toggleMask={toggleMask}
                    autoComplete={autoComplete}
                    feedback={feedback}
                    header={computedHeader}
                    footer={computedFooter}
                    required={required}
                />
                <label htmlFor={inputId}>{label}</label>
            </FloatLabel>
            {showError && invalid && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
});

export default InputPassword;
