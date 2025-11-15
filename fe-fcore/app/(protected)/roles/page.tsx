// src/app/(protected)/roles/page.tsx
import { requireRole } from '@/lib/auth/server';
import RolesTable from './components/RolesTable';

export default async function RolesPage() {
  const { ok } = await requireRole('admin');
  if (!ok) return null;
  return <RolesTable />;
}
