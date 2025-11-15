'use client';

import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import AppButton, { ButtonSeverity, ButtonVariant } from '@/components/ui/AppButton';

export type AppToolbarProps = {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    start?: React.ReactNode;
    center?: React.ReactNode;
    end?: React.ReactNode;
    onBack?: () => void;
    backIcon?: string;
    actions?: Array<{
        key?: string;
        label?: string;
        icon?: string;
        severity?: ButtonSeverity;
        variant?: ButtonVariant;
        rounded?: boolean;
        raised?: boolean;
        onClick?: () => void;
    }>;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    searchPosition?: 'left' | 'center' | 'right';
    rounded?: boolean;
    elevated?: boolean;
    gradient?: boolean;
    sticky?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

export default function AppToolbar(props: AppToolbarProps) {
    const {
        title,
        subtitle,
        start,
        center,
        end,
        onBack,
        backIcon = 'pi pi-arrow-left',
        actions,
        searchValue,
        onSearchChange,
        searchPlaceholder = 'Buscar...',
        searchPosition = 'right',
        rounded = true,
        elevated = true,
        gradient = false,
        sticky = false,
        className,
        style
    } = props;

    const wrapSearch = (extraClass?: string) =>
        typeof searchValue === 'string' && onSearchChange ? (
            <div className={['w-20rem', extraClass].filter(Boolean).join(' ')}>
                <IconField iconPosition="left" className="w-full">
                    <InputIcon className="pi pi-search" />
                    <InputText
                        className="w-full"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                    />
                </IconField>
            </div>
        ) : null;

    const startBlock = (
        <div className="flex align-items-center gap-3">
            {onBack ? <AppButton icon={backIcon} variant="text" severity="secondary" ariaLabel="back" onClick={onBack} /> : null}
            {title ? (
                <div className="flex flex-column">
                    <div className="font-semibold text-lg">{title}</div>
                    {subtitle ? <div className="text-sm text-600">{subtitle}</div> : null}
                </div>
            ) : null}
            {searchPosition === 'left' ? wrapSearch() : null}
            {start}
        </div>
    );

    const centerBlock = (
        <div className="flex align-items-center gap-2">
            {searchPosition === 'center' ? wrapSearch() : null}
            {center}
        </div>
    );

    const endBlock = (
        <div className="flex align-items-center gap-2">
            {searchPosition === 'right' ? wrapSearch('hidden md:block') : null}
            {actions?.map((a, i) => (
                <AppButton
                    key={a.key ?? `tb-action-${i}`}
                    label={a.label}
                    icon={a.icon}
                    severity={a.severity}
                    variant={a.variant}
                    rounded={a.rounded}
                    raised={a.raised}
                    onClick={a.onClick}
                />
            ))}
            {end}
        </div>
    );

    const cls = [
        rounded ? 'border-round-3xl' : '',
        elevated ? 'shadow-2' : '',
        gradient ? 'text-white' : '',
        sticky ? 'sticky top-0 z-5' : '',
        className ?? ''
    ]
        .filter(Boolean)
        .join(' ');

    const st = gradient
        ? {
            backgroundImage: 'linear-gradient(to right, var(--bluegray-500), var(--bluegray-800))',
            ...style
        }
        : style;

    return <Toolbar start={startBlock} center={centerBlock} end={endBlock} className={cls} style={st} />;
}
