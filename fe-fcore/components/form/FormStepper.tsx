// src/components/form/FormStepper.tsx
'use client';

import React, { useMemo, useState } from 'react';
import AppSteps, { StepItem } from '@/components/ui/AppSteps';
import AppButton from '@/components/ui/AppButton';
import { useFormContext } from './FormProvider';

export type StepDef = {
    id: string;
    label: string;
    icon?: string;
    fields?: string[];
    content: React.ReactNode;
    disabled?: boolean;
};

export type FormStepperProps = {
    steps: StepDef[];
    initialStep?: number;
    linear?: boolean;
    className?: string;
    onFinish: (values: Record<string, unknown>) => void | Promise<void>;
    onInvalid?: (errors: Record<string, string | null>) => void | Promise<void>;
    labels?: { back?: string; next?: string; finish?: string };
    footerExtra?: React.ReactNode;
};

export default function FormStepper(props: FormStepperProps) {
    const { steps, initialStep = 0, linear = true, className, onFinish, onInvalid, labels, footerExtra } = props;
    const [active, setActive] = useState(initialStep);
    const form = useFormContext();

    const items: StepItem[] = useMemo(
        () => steps.map((s) => ({ id: s.id, label: s.label, icon: s.icon, disabled: s.disabled })),
        [steps]
    );

    const validateAll = async () => {
        let valid = false;
        let errors: Record<string, string | null> = {};
        let values: Record<string, unknown> = {};
        const runner = form.handleSubmit(
            (v) => {
                valid = true;
                values = v;
            },
            (e) => {
                valid = false;
                errors = e as Record<string, string | null>;
            }
        );
        runner({ preventDefault() { } } as any);
        await Promise.resolve();
        return { valid, errors, values };
    };

    const canProceed = async () => {
        if (!linear) return true;
        const current = steps[active];
        const { valid, errors } = await validateAll();
        if (!current.fields || current.fields.length === 0) return valid;
        const hasStepError = current.fields.some((f) => !!errors[f]);
        if (hasStepError) {
            if (onInvalid) await onInvalid(errors);
            return false;
        }
        return true;
    };

    const onBack = () => setActive((i) => Math.max(0, i - 1));
    const onNext = async () => {
        const ok = await canProceed();
        if (!ok) return;
        setActive((i) => Math.min(steps.length - 1, i + 1));
    };
    const onFinishClick = async () => {
        const runner = form.handleSubmit(async (v) => { await onFinish(v); }, async (e) => { if (onInvalid) await onInvalid(e as Record<string, string | null>); });
        runner({ preventDefault() { } } as any);
    };

    return (
        <div className={className}>
            <AppSteps items={items} activeIndex={active} onChange={async (idx) => {
                if (idx > active) {
                    const ok = await canProceed();
                    if (!ok) return;
                }
                setActive(idx);
            }} readOnly={linear} />
            <div className="mt-4">{steps[active]?.content}</div>
            <div className="flex justify-content-between align-items-center gap-2 mt-4">
                <div>{footerExtra}</div>
                <div className="flex gap-2">
                    <AppButton label={labels?.back ?? 'Atrás'} severity="secondary" onClick={onBack} disabled={active === 0} />
                    {active < steps.length - 1 ? (
                        <AppButton label={labels?.next ?? 'Siguiente'} icon="pi pi-arrow-right" iconPos="right" severity="info" onClick={onNext} />
                    ) : (
                        <AppButton label={labels?.finish ?? 'Finalizar'} icon="pi pi-check" severity="success" onClick={onFinishClick} />
                    )}
                </div>
            </div>
        </div>
    );
}
