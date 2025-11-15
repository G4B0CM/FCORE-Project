'use client';

import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';

type ToastSeverity = NonNullable<ToastMessage['severity']>;

type ToastInputMessage = ToastMessage | ToastMessage[];

export interface ToastContextValue {
    show: (message: ToastInputMessage) => void;
    clear: () => void;
    showSuccess: (message: Omit<ToastMessage, 'severity'>) => void;
    showInfo: (message: Omit<ToastMessage, 'severity'>) => void;
    showWarn: (message: Omit<ToastMessage, 'severity'>) => void;
    showError: (message: Omit<ToastMessage, 'severity'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export type ToastPosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
    | 'center';

export interface ToastProviderProps {
    children: ReactNode;
    position?: ToastPosition;
    life?: number;
    baseZIndex?: number;
    className?: string;
}

const DEFAULT_LIFE = 3000;

function applyDefaults(message: ToastMessage, life: number): ToastMessage {
    return {
        ...message,
        life: message.life ?? life,
    };
}

export default function ToastProvider({
    children,
    position = 'top-right',
    life = DEFAULT_LIFE,
    baseZIndex = 0,
    className,
}: ToastProviderProps) {
    const toastRef = useRef<Toast>(null);

    const show = useCallback(
        (input: ToastInputMessage) => {
            if (!toastRef.current) {
                return;
            }

            if (Array.isArray(input)) {
                toastRef.current.show(input.map((message) => applyDefaults(message, life)));
                return;
            }

            toastRef.current.show(applyDefaults(input, life));
        },
        [life],
    );

    const clear = useCallback(() => {
        toastRef.current?.clear();
    }, []);

    const showWithSeverity = useCallback(
        (severity: ToastSeverity, options: Omit<ToastMessage, 'severity'>) => {
            show({ ...options, severity });
        },
        [show],
    );

    const value = useMemo<ToastContextValue>(
        () => ({
            show,
            clear,
            showSuccess: (options) => showWithSeverity('success', options),
            showInfo: (options) => showWithSeverity('info', options),
            showWarn: (options) => showWithSeverity('warn', options),
            showError: (options) => showWithSeverity('error', options),
        }),
        [clear, show, showWithSeverity],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast ref={toastRef} position={position} baseZIndex={baseZIndex} className={className} />
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}
