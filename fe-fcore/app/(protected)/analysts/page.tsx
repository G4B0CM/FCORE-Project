// src/app/(protected)/analysts/page.tsx
import { requireRole } from '@/lib/auth/server';
import AnalystsTable from './components/AnalystsTable';

export default async function AnalystsPage() {
  const { ok, redirectTo } = await requireRole('admin');
  if (!ok) return null;
  return <AnalystsTable />;
}
