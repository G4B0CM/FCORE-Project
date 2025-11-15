// src/components/layout/navConfig.ts
export type NavItem = {
    key: string;
    label: string;
    icon: string;
    href?: string;
    roles?: string[];
    children?: NavItem[];
};

export const navItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', href: '/dashboard', roles: ['analyst', 'admin'] },
    {
        key: 'transactions',
        label: 'Transacciones',
        icon: 'pi pi-credit-card',
        href: '/transactions',
        roles: ['analyst', 'admin'],
    },
    {
        key: 'rules',
        label: 'Reglas',
        icon: 'pi pi-sliders-h',
        href: '/rules',
        roles: ['analyst', 'admin'],
    },
    { key: 'customers', label: 'Clientes', icon: 'pi pi-users', href: '/customers', roles: ['analyst', 'admin'] },
    { key: 'cards', label: 'Tarjetas', icon: 'pi pi-id-card', href: '/cards', roles: ['analyst', 'admin'] },
    { key: 'audit', label: 'Auditoría', icon: 'pi pi-search', href: '/audit', roles: ['analyst', 'admin'] },
    { key: 'analysts', label: 'Analistas', icon: 'pi pi-shield', href: '/analysts', roles: ['analyst', 'admin'] },
];
