import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootRedirect() {
  const cookieStore = await cookies();
  const has = cookieStore.has(ACCESS_COOKIE);

  if (has) {
    redirect('/');
  }

  redirect('/login');
}
