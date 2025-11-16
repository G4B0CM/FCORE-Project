// src/app/(protected)/analysts/page.tsx
import { requireRole } from '@/lib/auth/server';
import AnalystsTable from './components/AnalystsTable';
import { redirect } from 'next/navigation';

export default async function AnalystsPage() {
  const { ok, redirectTo } = await requireRole('admin');
  if (!ok) redirect(redirectTo || '/login');
  return <AnalystsTable />;
}
