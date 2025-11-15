// src/components/layout/AppSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import { navItems, NavItem } from './navConfig';

type Props = {
    collapsed: boolean;
    roles: string[];
    onLogout: () => Promise<void> | void;
};

function canShow(item: NavItem, roles: string[]) {
    if (!item.roles || item.roles.length === 0) return true;
    if (!roles || roles.length === 0) return true;
    return roles.some((r) => item.roles!.includes(r));
}

export default function AppSidebar({ collapsed, roles, onLogout }: Props) {
    const pathname = usePathname();
    const width = collapsed ? '5rem' : '16rem';

    const baseItem =
        'relative flex align-items-center gap-2 px-3 py-2 border-round transition-colors cursor-pointer text-700 hover:surface-100';

    return (
        <aside
            className="fixed left-0 z-4 surface-card border-right-1 surface-border flex flex-column justify-content-between"
            style={{ top: '4rem', height: 'calc(100vh - 4rem)', width }}
        >
            <nav className="flex flex-column p-2 gap-1 overflow-auto">
                {navItems.filter((i) => canShow(i, roles)).map((item) => {
                    const active = item.href ? pathname.startsWith(item.href) : false;
                    const className = active
                        ? `${baseItem} bg-primary text-primary-contrast`
                        : baseItem;
                    return (
                        <Link key={item.key} href={item.href ?? '#'} className={className}>
                            {active && <span className="absolute left-0 top-0 h-full" style={{ width: '4px', background: 'var(--p-primary-600)' }} />}
                            <i className={`${item.icon} text-lg`} />
                            {!collapsed && <span className="white-space-nowrap">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-2">
                <Button
                    icon="pi pi-sign-out"
                    label={collapsed ? undefined : 'Cerrar sesión'}
                    className={`w-full ${collapsed ? 'justify-content-center' : 'justify-content-start'}`}
                    outlined
                    severity="secondary"
                    onClick={() => onLogout()}
                    aria-label="Cerrar sesión"
                />
            </div>
        </aside>
    );
}
