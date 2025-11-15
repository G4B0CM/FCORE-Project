// components/form/FieldError.tsx
'use client';
import React from 'react';

type FieldErrorProps = {
    id: string;                 // id único para aria-describedby
    message?: string | null;
    show?: boolean;
};

export default function FieldError({ id, message, show = true }: FieldErrorProps) {
    if (!show || !message) return null;
    return <small id={id} className="p-error block mt-1">{message}</small>;
}
