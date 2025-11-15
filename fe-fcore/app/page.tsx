// src/app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';

export default async function RootRedirect() {
  const has = (await cookies()).has(ACCESS_COOKIE);
  if (has) redirect('/(protected)');
  redirect('/login');
}
