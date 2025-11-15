'use client';

import React from 'react';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';

export function TagCell(props: { value: string; severity?: 'success' | 'info' | 'warning' | 'danger' | null }) {
    const { value, severity = null } = props;
    return <Tag value={value} severity={severity as any} />;
}

export function BoolIconCell(props: { value: boolean }) {
    const { value } = props;
    return <i className={classNames('pi', { 'true-icon pi-check-circle text-green-500': value, 'false-icon pi-times-circle text-red-400': !value })}></i>;
}

export function statusSeverity(status: string) {
    switch (status) {
        case 'unqualified':
            return 'danger';
        case 'qualified':
            return 'success';
        case 'new':
            return 'info';
        case 'negotiation':
            return 'warning';
        case 'renewal':
            return null;
        default:
            return null;
    }
}
