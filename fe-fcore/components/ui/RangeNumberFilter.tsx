'use client';

import React from 'react';
import { InputNumber } from 'primereact/inputnumber';

export type RangeNumber = [number | null, number | null] | null;

export type RangeNumberFilterProps = {
    value: RangeNumber;
    onChange: (value: RangeNumber) => void;
    placeholderFrom?: string;
    placeholderTo?: string;
    className?: string;
};

export default function RangeNumberFilter(props: RangeNumberFilterProps) {
    const { value, onChange, placeholderFrom = 'Desde', placeholderTo = 'Hasta', className } = props;
    const from = value?.[0] ?? null;
    const to = value?.[1] ?? null;
    return (
        <div className={['flex gap-1', className].filter(Boolean).join(' ')}>
            <InputNumber value={from as any} onChange={(e) => onChange([e.value as number | null, to])} className="w-full" placeholder={placeholderFrom} />
            <InputNumber value={to as any} onChange={(e) => onChange([from, e.value as number | null])} className="w-full" placeholder={placeholderTo} />
        </div>
    );
}
