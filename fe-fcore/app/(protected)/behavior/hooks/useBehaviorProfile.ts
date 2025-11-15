// src/app/(protected)/behavior/hooks/useBehaviorProfile.ts
'use client';

import { useCallback, useState } from 'react';
import type { BehaviorProfileResponse } from '@/types/behavior';

export function useBehaviorProfile(customerId: string) {
  const [profile, setProfile] = useState<BehaviorProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/behavior/${encodeURIComponent(customerId)}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('No se encontró el perfil de comportamiento');
      setProfile(await r.json());
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  return { profile, loading, fetchProfile };
}
