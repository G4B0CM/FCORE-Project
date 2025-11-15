// src/app/(auth)/login/hooks/useLoginForm.ts
'use client';

import { useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toast } from 'primereact/toast';

export function useLoginForm() {
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get('redirectTo') || '/dashboard';

  async function submit(values: { username: string; password: string }) {
    const { username, password } = values;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.detail ?? 'Credenciales inválidas');
    }
    toast.current?.show({ severity: 'success', summary: 'Bienvenido', detail: username, life: 1200 });
    setTimeout(() => router.replace(redirectTo), 300);
  }

  function notifyInvalid(first?: string | null) {
    toast.current?.show({
      severity: 'warn',
      summary: 'Revisa el formulario',
      detail: first ?? 'Campos requeridos',
      life: 2500,
    });
  }

  function notifyError(msg?: string) {
    toast.current?.show({
      severity: 'error',
      summary: 'Error de acceso',
      detail: msg ?? 'Error',
      life: 3000,
    });
  }

  return { toast, submit, notifyInvalid, notifyError };
}
