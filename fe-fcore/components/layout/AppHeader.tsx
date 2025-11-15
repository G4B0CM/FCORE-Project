// src/components/layout/AppHeader.tsx
'use client';

import { Button } from 'primereact/button';

type Props = {
    onToggleSidebar: () => void;
    username?: string | null;
};

export default function AppHeader({ onToggleSidebar, username }: Props) {
    return (
        <header className="w-full bg-surface-0 border-bottom-1 surface-border shadow-1 
        flex align-items-center px-3 justify-content-between 
        fixed top-0 left-0 z-5" style={{ height: '4rem', background: 'url(https://wallpapershome.com/images/pages/pic_h/26426.jpg)' }}>
            <div className="flex align-items-center gap-3">
                <Button icon="pi pi-bars" rounded severity="secondary" outlined onClick={onToggleSidebar} aria-label="Menú" />
                <div className="flex align-items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">FCORE</span>
                    <span className="text-600 text-sm hidden sm:inline">Antifraude</span>
                </div>
            </div>
            <div className="flex align-items-center gap-3">
                <span className="text-700 hidden sm:inline">{username ?? 'Usuario'}</span>
                <img src="https://api.dicebear.com/7.x/identicon/svg?seed=fcore" alt="Avatar" className="w-3rem h-3rem border-circle surface-border border" />
            </div>
        </header>
    );
}
