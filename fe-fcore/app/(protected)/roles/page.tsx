// src/app/(protected)/roles/page.tsx
import { requireRole } from '@/lib/auth/server';
import RolesTable from './components/RolesTable';
import { redirect } from 'next/navigation';

export default async function RolesPage() {
  const { ok, redirectTo } = await requireRole('admin');
    if (!ok) redirect(redirectTo || '/login');
  return <RolesTable />;
}
