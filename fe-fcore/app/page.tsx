// src/app/page.tsx
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';

export default async function RootRedirect() {
  const has = (await cookies()).has(ACCESS_COOKIE);
  if (has) redirect('/dashboard');
  redirect('/login');
}
