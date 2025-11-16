// src/app/(protected)/layout.tsx
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/server';
import ClientShell from '@/components/layout/ClientShell';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { ok, payload, redirectTo } = await requireAuth();
  if (!ok || !payload) redirect(redirectTo || '/login');
  const roles = [String(payload.role || '').toLowerCase()];
  const username = String(payload.sub || '');
  return <ClientShell roles={roles} username={username}>{children}</ClientShell>;
}
