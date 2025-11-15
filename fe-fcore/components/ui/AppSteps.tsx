// src/components/ui/AppSteps.tsx
'use client';

import React from 'react';
import { Steps } from 'primereact/steps';
import { MenuItem } from 'primereact/menuitem';

export type StepItem = {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
};

export type AppStepsProps = {
    items: StepItem[];
    activeIndex: number;
    onChange: (index: number) => void;
    readOnly?: boolean;
    className?: string;
};

export default function AppSteps(props: AppStepsProps) {
    const { items, activeIndex, onChange, readOnly = false, className } = props;

    const model: MenuItem[] = items.map((it, idx) => ({
        label: it.label,
        icon: it.icon,
        disabled: it.disabled,
        command: () => {
            if (!readOnly && !it.disabled) onChange(idx);
        },
    }));

    return <Steps model={model} activeIndex={activeIndex} readOnly={readOnly} className={className} />;
}
