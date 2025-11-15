'use client';

import React from 'react';

export type InputGroupProps = {
    children: React.ReactNode;
    className?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
};

export default function InputGroup(props: InputGroupProps) {
    const { children, className, prefix, suffix } = props;
    return (
        <div className={['p-inputgroup', 'app-inputgroup', className].filter(Boolean).join(' ')}>
            {prefix ? <span className="p-inputgroup-addon mb-4">{prefix}</span> : null}
            {children}
            {suffix ? <span className="p-inputgroup-addon mb-4">{suffix}</span> : null}
        </div>
    );
}
