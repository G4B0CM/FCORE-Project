// src/components/ui/TagCell.tsx
'use client';

import { Tag } from 'primereact/tag';

type Severity = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast';

type Props = {
    value?: React.ReactNode;
    severity?: Severity;
    icon?: string;
    rounded?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

export default function TagCell({ value, severity, icon, rounded, className, style }: Props) {
    return <Tag value={value} severity={severity} icon={icon} rounded={rounded} className={className} style={style} />;
}
