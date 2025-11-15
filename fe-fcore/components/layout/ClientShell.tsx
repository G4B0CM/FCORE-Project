// src/components/layout/ClientShell.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';

export default function ClientShell({
    children,
    roles,
    username,
}: {
    children: React.ReactNode;
    roles: string[];
    username: string | null;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarWidth = collapsed ? '5rem' : '16rem';

    const onToggleSidebar = useCallback(() => setCollapsed((v) => !v), []);
    const onLogout = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    }, []);

    const contentStyle = useMemo(
        () => ({
            paddingTop: '4rem',
            paddingLeft: `calc(${sidebarWidth} + 1rem)`,
            paddingRight: '1rem',
        }),
        [sidebarWidth]
    );

    useEffect(() => {
        document.documentElement.style.setProperty('--fcore-sidebar-width', sidebarWidth);
    }, [sidebarWidth]);

    return (
        <div>
            <AppHeader onToggleSidebar={onToggleSidebar} username={username ?? undefined} />
            <AppSidebar collapsed={collapsed} roles={roles} onLogout={onLogout} />
            <main className="min-h-screen" style={contentStyle}>
                <div className="p-3">{children}</div>
            </main>
        </div>
    );
}
