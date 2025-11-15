// src/lib/auth/jwt.ts
function b64urlToStr(b: string) {
  const pad = '='.repeat((4 - (b.length % 4)) % 4);
  const base64 = (b + pad).replace(/-/g, '+').replace(/_/g, '/');
  if (typeof window === 'undefined') return Buffer.from(base64, 'base64').toString('utf8');
  return decodeURIComponent(escape(atob(base64)));
}
export function decodeJwt<T = unknown>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(b64urlToStr(payload)) as T;
  } catch {
    return null;
  }
}
