'use client';

import React from 'react';
import { Dialog } from 'primereact/dialog';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DialogPosition =
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';

export type AppDialogProps = {
    visible: boolean;
    onHide: () => void;
    title?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    size?: DialogSize;
    position?: DialogPosition;
    modal?: boolean;
    dismissableMask?: boolean;
    blockScroll?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    closable?: boolean;
    className?: string;
    contentClassName?: string;
    style?: React.CSSProperties;
    breakpoints?: Record<string, string>;
};

const sizeToWidth: Record<DialogSize, string> = {
    sm: '28rem',
    md: '42rem',
    lg: '56rem',
    xl: '72rem',
    full: '95vw'
};

export default function AppDialog(props: AppDialogProps) {
    const {
        visible,
        onHide,
        title,
        header,
        footer,
        children,
        size = 'md',
        position = 'center',
        modal = true,
        dismissableMask = false,
        blockScroll = true,
        draggable = false,
        resizable = false,
        closable = true,
        className,
        contentClassName,
        style,
        breakpoints
    } = props;

    const hdr = header ?? (title ? <div className="font-semibold text-lg">{title}</div> : undefined);
    const computedStyle = { width: sizeToWidth[size], ...style };
    const computedBreakpoints =
        breakpoints ?? { '960px': '75vw', '640px': '95vw' };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            modal={modal}
            header={hdr}
            footer={footer}
            position={position}
            dismissableMask={dismissableMask}
            blockScroll={blockScroll}
            draggable={draggable}
            resizable={resizable}
            closable={closable}
            className={className}
            contentClassName={contentClassName}
            style={computedStyle}
            breakpoints={computedBreakpoints}
        >
            {children}
        </Dialog>
    );
}
