// src/lib/auth/cookies.ts
export const ACCESS_COOKIE = 'fcore.at';
export const REFRESH_COOKIE = 'fcore.rt';

function isIp(host?: string) {
  return !!host && /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
}

const NODE_ENV = process.env.NODE_ENV;
const HOST = process.env.NEXT_PUBLIC_HOST;
const COOKIE_DOMAIN_ENV = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || ''

const isHttps = !!HOST && HOST.startsWith('https://');
const inProd = NODE_ENV === 'production';

export const COOKIE_SECURE = inProd && isHttps;
export const COOKIE_SAME_SITE: 'lax' | 'strict' | 'none' = (process.env.NEXT_PUBLIC_COOKIE_SAMESITE as any) || 'lax';
export const TOKEN_HEADER = 'Authorization';

export function cookieOpts() {
  const domain = (inProd && !isIp(new URL(HOST || 'http://localhost:3000').hostname) && COOKIE_DOMAIN_ENV) || undefined;
  return {
    httpOnly: true as const,
    sameSite: COOKIE_SAME_SITE,
    path: '/',
    secure: COOKIE_SECURE,
    ...(domain ? { domain } : {}),
  };
}
