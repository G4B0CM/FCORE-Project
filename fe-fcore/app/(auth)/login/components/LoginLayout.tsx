'use client';

import Image from 'next/image';
import { useRef, isValidElement, cloneElement, ReactElement } from 'react';
import { Toast } from 'primereact/toast';

export default function LoginLayout({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  redirectTo: string;
}) {
  const toastRef = useRef<Toast>(null);
  const childWithToast = isValidElement(children)
    ? cloneElement(children as ReactElement<any>, { redirectTo, toastRef })
    : children;

  return (
    <div className="min-h-screen flex flex-column">
      <Toast ref={toastRef} position="bottom-right" />
      <div className="flex flex-1">
        <aside className="surface-card w-full md:w-26rem border-right-1 border-300 flex flex-column justify-content-between" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.02)' }}>
          <header className="p-4 border-bottom-1 surface-border">
            <div className="flex align-items-center gap-2">
              <div>
                <h1 className="m-0 text-900 text-xl">FCORE</h1>
                <small className="text-600">Banco • Unidad Antifraude</small>
              </div>
            </div>
          </header>
          <div className="p-4">
            <h2 className="text-4xl mb-2">Ingresar</h2>
            <p className="text-600 mb-6">Autenticación segura para analistas y oficiales.</p>
            {childWithToast}
          </div>
          <footer className="p-3 mb-4 surface-ground text-600 text-sm">
            <div className="flex align-items-center justify-content-between">
              <span>© {new Date().getFullYear()} Banco Demo</span>
              <a className="text-600" href="/legal/terminos">Términos</a>
            </div>
          </footer>
        </aside>

        <section className="hidden md:flex flex-1 relative">
          <Image src="https://4kwallpapers.com/images/wallpapers/windows-11-dark-mode-abstract-background-black-background-3840x2160-8710.jpg" alt="Antifraude abstracto" fill priority className="object-cover" style={{ objectFit: 'cover', opacity: 0.3 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(3,8,26,0.75), rgba(3,8,26,0.35) 40%, rgba(3,8,26,0.75))' }} />
          {/* tu contenido derecho… */}
        </section>
      </div>
    </div>
  );
}
