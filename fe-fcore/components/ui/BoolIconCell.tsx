// src/components/ui/BoolIconCell.tsx
'use client';

import { Button } from 'primereact/button';

type Severity = "help" | "secondary" | "success" | "info" | "warning" | "danger" | "contrast" | undefined;

type Props = {
    value?: boolean | null;
    trueIcon?: string;
    falseIcon?: string;
    nullIcon?: string;
    trueSeverity?: Severity;
    falseSeverity?: Severity;
    nullSeverity?: Severity;
    rounded?: boolean;
    outlined?: boolean;
    raised?: boolean;
    text?: boolean;
    className?: string;
    style?: React.CSSProperties;
    tooltipTrue?: string;
    tooltipFalse?: string;
    tooltipNull?: string;
};

export default function BoolIconCell({
    value,
    trueIcon = 'pi pi-check',
    falseIcon = 'pi pi-times',
    nullIcon = 'pi pi-minus',
    trueSeverity = 'success',
    falseSeverity = 'danger',
    nullSeverity = 'secondary',
    rounded = true,
    outlined,
    raised,
    text = true,
    className,
    style,
    tooltipTrue = 'Sí',
    tooltipFalse = 'No',
    tooltipNull = 'N/A',
}: Props) {
    const isTrue = value === true;
    const isFalse = value === false;
    const icon = isTrue ? trueIcon : isFalse ? falseIcon : nullIcon;
    const severity: Severity = isTrue ? trueSeverity : isFalse ? falseSeverity : nullSeverity;
    const tooltip = isTrue ? tooltipTrue : isFalse ? tooltipFalse : tooltipNull;

    return (
        <Button
            icon={icon}
            severity={severity}
            rounded={rounded}
            outlined={outlined}
            raised={raised}
            text={text}
            className={className}
            style={style}
            aria-label={tooltip}
            tooltip={tooltip}
        />
    );
}
