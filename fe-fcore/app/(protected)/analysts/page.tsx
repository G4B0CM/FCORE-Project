// src/app/(protected)/analysts/page.tsx
import { requireRole } from '@/lib/auth/server';
import AnalystsClient from './AnalystsClient';

export default async function AnalystsPage() {
    return <AnalystsClient />;
}
