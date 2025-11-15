'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';

import { FormProvider } from '@/components/form/FormProvider';
import FormInputField from '@/components/form/FormInputField';
import FormInputPassword from '@/components/form/FormInputPassword';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { required, minLen, qcode } from '@/components/form/validators';

type FraudTip = {
    title: string;
    text: string;
    img?: string;
    badge?: string;
};

const FRAUD_TIPS: FraudTip[] = [
    {
        title: 'Regla 3-D Secure',
        text: 'Habilita autenticación reforzada para e-commerce. Reduce fraude en CNP (card-not-present).',
        img: '/images/fraud/3ds.jpg',
        badge: 'Mejor práctica'
    },
    {
        title: 'Límites dinámicos',
        text: 'Ajusta límites por perfil y horario. Dispara MFA ante cambios anómalos.',
        img: '/images/fraud/limits.jpg',
        badge: 'Riesgo'
    },
    {
        title: 'Velocidad de transacciones',
        text: 'Bloquea ráfagas desde el mismo dispositivo/IP. Señal clave ante testing de tarjetas.',
        img: '/images/fraud/velocity.jpg',
        badge: 'Heurística'
    },
    {
        title: 'Geolocalización',
        text: 'Inconsistencias país-comercio-emisor → alerta. Combínalo con BIN y MCC.',
        img: '/images/fraud/geo.jpg',
        badge: 'Señal'
    }
];

export default function LoginPage() {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const sp = useSearchParams();
    const redirectTo = sp.get('redirectTo') || '/dashboard';

    // template del carrusel (1 tarjeta por slide)
    const tipTemplate = (tip: FraudTip) => (
        <Card className="w-full shadow-2 surface-card border-round-2xl overflow-hidden" style={{ minHeight: 200, backgroundColor: 'rgba(30, 30, 30, 0.6)' }}>
            <div className="flex flex-column md:flex-row gap-3">
                <div className="relative w-full md:w-6 border-round-xl overflow-hidden" style={{ minHeight: 160 }}>
                    <Image
                        src={'https://www.piranirisk.com/hs-fs/hubfs/fraude-interno.webp?width=1280&height=720&name=fraude-interno.webp'}
                        alt={tip.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority={false}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex align-items-center gap-2 mb-2">
                        <Tag value={tip.badge ?? 'Tip'} severity="info" />
                        <h3 className="m-0 text-xl font-semibold">{tip.title}</h3>
                    </div>
                    <p className="m-0 line-height-3 text-700">{tip.text}</p>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="min-h-screen flex flex-column">
            <Toast ref={toast} position="bottom-right" />

            {/* Contenedor principal partida 2 columnas */}
            <div className="flex flex-1">
                {/* SIDEBAR: formulario de acceso */}
                <aside
                    className="surface-card w-full md:w-26rem border-right-1 border-300 flex flex-column justify-content-between"
                    style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.02)' }}
                >
                    {/* Branding / encabezado */}
                    <header className="p-4 border-bottom-1 surface-border">
                        <div className="flex align-items-center gap-2">
                            <div>
                                <h1 className="m-0 text-900 text-xl">FCORE</h1>
                                <small className="text-600">Banco • Unidad Antifraude</small>
                            </div>
                        </div>
                    </header>

                    {/* Cuerpo: Login form */}
                    <div className="p-4">
                        <h2 className="text-4xl mb-2">Ingresar</h2>
                        <p className="text-600 mb-6">Autenticación segura para analistas y oficiales.</p>

                        <FormProvider
                            initialValues={{ username: '', password: '', remember: true }}
                            defaults={{ validateOn: 'both', touchOnMount: true, validateOnMount: true }}
                        >
                            <form
                                className="flex flex-column gap-4"
                                onSubmit={(e) => e.preventDefault()}
                                aria-label="Formulario de acceso antifraude"
                            >
                                <FormInputField
                                    name="username"
                                    label="Usuario"
                                    placeholder="e.g. Q1001083"
                                    autoComplete="username"
                                    validators={[required, qcode]}
                                    initiallyTouched={false}
                                    validateOnMount={true}
                                    validateOn='change'
                                />

                                <FormInputPassword
                                    name="password"
                                    label="Contraseña"
                                    toggleMask
                                    feedback={false}
                                    autoComplete="current-password"
                                    validators={[required, minLen(3)]}
                                    initiallyTouched={false}
                                    validateOnMount={true}
                                />


                                <FormSubmitButton
                                    label="Entrar"
                                    icon="pi pi-sign-in"
                                    className="w-full mt-2"
                                    severity="primary"
                                    onValid={async (values) => {
                                        const { username, password } = values as { username: string; password: string };
                                        try {
                                            const res = await fetch('/api/auth/login', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ username, password })
                                            });
                                            if (!res.ok) {
                                                const data = await res.json().catch(() => ({}));
                                                throw new Error(data?.detail ?? 'Credenciales inválidas');
                                            }
                                            toast.current?.show({
                                                severity: 'success',
                                                summary: 'Bienvenido',
                                                detail: username,
                                                life: 1200
                                            });
                                            setTimeout(() => router.replace(redirectTo), 300);
                                        } catch (e: any) {
                                            toast.current?.show({
                                                severity: 'error',
                                                summary: 'Error de acceso',
                                                detail: e?.message ?? 'Error',
                                                life: 3000
                                            });
                                        }
                                    }}
                                    onInvalid={(errors) => {
                                        const first = Object.values(errors).find(Boolean) as string | null;
                                        toast.current?.show({
                                            severity: 'warn',
                                            summary: 'Revisa el formulario',
                                            detail: first ?? 'Campos requeridos',
                                            life: 2500
                                        });
                                    }}
                                />

                                {/* Metadatos de seguridad / sello */}
                                <div className="flex align-items-center gap-2 mt-3">
                                    <i className="pi pi-shield text-primary"></i>
                                    <small className="text-600">
                                        Sesión protegida. Monitoreo y auditoría en tiempo real.
                                    </small>
                                </div>
                            </form>
                        </FormProvider>
                    </div>

                    {/* Pie: links legales / versión */}
                    <footer className="p-3 mb-4 surface-ground text-600 text-sm">
                        <div className="flex align-items-center justify-content-between">
                            <span>© {new Date().getFullYear()} Banco Demo</span>
                            <a className="text-600" href="/legal/terminos">Términos</a>
                        </div>
                    </footer>
                </aside>

                {/* HERO: imagen de fondo + overlay + carrusel de tips */}
                <section className="hidden md:flex flex-1 relative">
                    {/* Imagen de fondo abstracta (reemplaza la ruta por la tuya) */}
                    <Image
                        src="https://4kwallpapers.com/images/wallpapers/windows-11-dark-mode-abstract-background-black-background-3840x2160-8710.jpg"
                        alt="Antifraude abstracto"
                        fill
                        priority
                        className="object-cover"
                        style={{ objectFit: 'cover', opacity: 0.3 }}
                    />
                    {/* Overlay para contraste */}
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(120deg, rgba(3,8,26,0.75), rgba(3,8,26,0.35) 40%, rgba(3,8,26,0.75))'
                    }} />

                    {/* Contenido del hero */}
                    <div className="relative z-1 p-5 md:p-6 lg:p-7 w-full flex flex-column justify-content-between">
                        {/* Encabezado del hero */}
                        <div className="text-0">
                            <h2 className="m-0 text-0 font-light" style={{ fontSize: '2.2rem' }}>
                                Plataforma de Detección de Fraude
                            </h2>
                            <p className="mt-2 mb-0 text-300" style={{ maxWidth: 640 }}>
                                Señales, reglas y ML para decisiones en milisegundos. Observabilidad y trazabilidad completas.
                            </p>
                        </div>
                        <div className='flex justify-content-center'>{/* Carrusel de tips */}
                            <div className="w-7" style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                minHeight: '400px'
                            }}>
                                <Carousel
                                    value={FRAUD_TIPS}
                                    itemTemplate={tipTemplate}
                                    numVisible={1}
                                    numScroll={1}
                                    circular
                                    autoplayInterval={5000}
                                    showIndicators
                                    showNavigators
                                    className=" mt-7 "
                                />
                            </div></div>


                        {/* Pie del hero: indicadores / claims */}
                        <div className="flex gap-3 flex-wrap mt-4">
                            <span className="inline-flex align-items-center gap-2 text-0">
                                <i className="pi pi-bolt"></i> <small>Decisión &lt; 200 ms</small>
                            </span>
                            <span className="inline-flex align-items-center gap-2 text-0">
                                <i className="pi pi-eye"></i> <small>Explainability SHAP</small>
                            </span>
                            <span className="inline-flex align-items-center gap-2 text-0">
                                <i className="pi pi-database"></i> <small>Streaming Kafka</small>
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
