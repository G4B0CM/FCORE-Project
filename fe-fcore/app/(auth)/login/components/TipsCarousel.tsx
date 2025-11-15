// src/app/(auth)/login/components/TipsCarousel.tsx
'use client';

import Image from 'next/image';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';

type FraudTip = { title: string; text: string; img?: string; badge?: string };

const TIPS: FraudTip[] = [
  { title: 'Regla 3-D Secure', text: 'Autenticación reforzada para e-commerce.', img: '/images/fraud/3ds.jpg', badge: 'Mejor práctica' },
  { title: 'Límites dinámicos', text: 'Ajusta límites por perfil y horario.', img: '/images/fraud/limits.jpg', badge: 'Riesgo' },
  { title: 'Velocidad de transacciones', text: 'Bloquea ráfagas por IP/dispositivo.', img: '/images/fraud/velocity.jpg', badge: 'Heurística' },
  { title: 'Geolocalización', text: 'Cruza país, BIN y MCC.', img: '/images/fraud/geo.jpg', badge: 'Señal' },
];

export default function TipsCarousel() {
  const tipTemplate = (tip: FraudTip) => (
    <Card className="w-full shadow-2 surface-card border-round-2xl overflow-hidden" style={{ minHeight: 200, backgroundColor: 'rgba(30,30,30,0.6)' }}>
      <div className="flex flex-column md:flex-row gap-3">
        <div className="relative w-full md:w-6 border-round-xl overflow-hidden" style={{ minHeight: 160 }}>
          <Image src={tip.img || '/images/fraud/3ds.jpg'} alt={tip.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex align-items-center gap-2 mb-2">
            <Tag value={tip.badge ?? 'Tip'} severity="info" />
            <h3 className="m-0 text-xl font-semibold">{tip.title}</h3>
          </div>
          <p className="m-0 line-height-3 text-300">{tip.text}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="w-7" style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', minHeight: '400px' }}>
      <Carousel value={TIPS} itemTemplate={tipTemplate} numVisible={1} numScroll={1} circular autoplayInterval={5000} showIndicators showNavigators className="mt-7" />
    </div>
  );
}
