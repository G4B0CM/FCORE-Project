// src/components/layout/navConfig.ts
export type NavItem = { key: string; label: string; icon: string; href?: string; roles?: string[]; children?: NavItem[] };

export const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', href: '/dashboard', roles: ['analyst', 'admin'] },
  { key: 'transactions', label: 'Transacciones', icon: 'pi pi-credit-card', href: '/transactions', roles: ['analyst','admin'] },
  { key: 'alerts', label: 'Alertas', icon: 'pi pi-bell', href: '/alerts', roles: ['analyst','admin'] },
  { key: 'cases', label: 'Casos', icon: 'pi pi-briefcase', href: '/cases', roles: ['analyst','admin'] },
  { key: 'scoring', label: 'Scoring', icon: 'pi pi-bolt', href: '/scoring', roles: ['admin'] },
  { key: 'rules', label: 'Reglas', icon: 'pi pi-sliders-h', href: '/rules', roles: ['analyst', 'admin'] },
  { key: 'customers', label: 'Clientes', icon: 'pi pi-users', href: '/customers', roles: ['analyst','admin'] },
  { key: 'merchants', label: 'Comercios', icon: 'pi pi-shop', href: '/merchants', roles: ['analyst','admin']},
  { key: 'analysts', label: 'Analistas', icon: 'pi pi-shield', href: '/analysts', roles: ['admin'] },
  { key: 'roles', label: 'Roles', icon: 'pi pi-lock', href: '/roles', roles: ['admin'] },
];
