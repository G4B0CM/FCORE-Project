// src/app/(auth)/login/components/LoginLayout.tsx
'use client';

import Image from 'next/image';
import { Toast } from 'primereact/toast';
import { useLoginForm } from '../hooks/useLoginForm';
import TipsCarousel from './TipsCarousel';

export default function LoginLayout({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  redirectTo: string;
}) {
  const { toast } = useLoginForm(redirectTo);
  return (
    <div className="min-h-screen flex flex-column">
      <Toast ref={toast} position="bottom-right" />
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
            {children}
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
          <div className="relative z-1 p-5 md:p-6 lg:p-7 w-full flex flex-column justify-content-between">
            <div className="text-0">
              <h2 className="m-0 text-0 font-light" style={{ fontSize: '2.2rem' }}>Plataforma de Detección de Fraude</h2>
              <p className="mt-2 mb-0 text-300" style={{ maxWidth: 640 }}>Señales, reglas y ML para decisiones en milisegundos. Observabilidad y trazabilidad completas.</p>
            </div>
            <div className="flex justify-content-center">
              <TipsCarousel />
            </div>
            <div className="flex gap-3 flex-wrap mt-4">
              <span className="inline-flex align-items-center gap-2 text-0"><i className="pi pi-bolt"></i> <small>Decisión &lt; 200 ms</small></span>
              <span className="inline-flex align-items-center gap-2 text-0"><i className="pi pi-eye"></i> <small>Explainability SHAP</small></span>
              <span className="inline-flex align-items-center gap-2 text-0"><i className="pi pi-database"></i> <small>Streaming Kafka</small></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
