// src/app/(protected)/layout.tsx
import { requireAuth } from '@/lib/auth/server';
import ClientShell from '@/components/layout/ClientShell';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { ok, payload } = await requireAuth();
  if (!ok || !payload) return null;
  const roles = [String(payload.role || '').toLowerCase()];
  const username = String(payload.sub || '');
  return <ClientShell roles={roles} username={username}>{children}</ClientShell>;
}
