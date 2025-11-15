'use client';

import React from 'react';
import { Button } from 'primereact/button';

export type ButtonVariant = 'solid' | 'outlined' | 'text';
export type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
export type ButtonSize = 'small' | 'normal' | 'large';

export type AppButtonProps = {
    label?: string;
    icon?: string;
    iconPos?: 'left' | 'right';
    severity?: ButtonSeverity;
    variant?: ButtonVariant;
    rounded?: boolean;
    raised?: boolean;
    size?: ButtonSize;
    className?: string;
    full?: boolean;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    tooltip?: string;
    isOutlined?: boolean;
    tooltipOptions?: Record<string, unknown>;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function AppButton(props: AppButtonProps) {
    const {
        label,
        icon,
        iconPos = 'left',
        severity,
        variant = 'solid',
        rounded = false,
        raised = false,
        size = 'normal',
        className,
        full = false,
        type = 'button',
        loading = false,
        disabled = false,
        ariaLabel,
        tooltip,
        tooltipOptions,
        onClick,
        isOutlined
    } = props;

    const text = variant === 'text';
    const pSeverity = severity && severity !== 'primary' ? severity : undefined;
    const pSize = size !== 'normal' ? size : undefined;
    const cls = [className, full ? 'w-full' : ''].filter(Boolean).join(' ');

    return (
        <Button
            label={label}
            icon={icon}
            iconPos={iconPos}
            severity={pSeverity as any}
            text={text}
            rounded={rounded}
            raised={raised}
            size={pSize as any}
            className={cls}
            outlined={isOutlined}
            type={type}
            loading={loading}
            disabled={disabled}
            aria-label={ariaLabel ?? label ?? icon ?? 'button'}
            tooltip={tooltip}
            tooltipOptions={tooltipOptions}
            onClick={onClick}
        />
    );
}
