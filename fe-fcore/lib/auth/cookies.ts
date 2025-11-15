// src/lib/auth/cookies.ts
export const ACCESS_COOKIE = 'fcore.at';
export const REFRESH_COOKIE = 'fcore.rt';
export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;
export const COOKIE_SECURE = process.env.NODE_ENV === 'production';
export const COOKIE_SAME_SITE: 'lax' | 'strict' | 'none' = 'lax';
export const COOKIE_PATH = '/';
export const TOKEN_HEADER = 'Authorization';
