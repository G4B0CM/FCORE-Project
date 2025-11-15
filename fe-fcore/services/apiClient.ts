// src/services/apiClient.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ReqOptions = {
  token?: string | null;
  next?: RequestInit['next'];
  signal?: AbortSignal;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  options?: ReqOptions
): Promise<T> {
  const isServer = typeof window === 'undefined';
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(options?.headers ?? {}),
  };
  const token = options?.token ?? null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: options?.credentials ?? 'include',
    body: body ? JSON.stringify(body) : undefined,
    next: options?.next,
    signal: options?.signal,
  });

  if (res.status === 204) return undefined as unknown as T;

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : undefined;

  if (!res.ok) {
    const detail = (data as any)?.detail ?? (data as any)?.message ?? res.statusText;
    if (!isServer && res.status === 401) {
      window.location.href = '/login';
    }
    throw new ApiError(res.status, String(detail));
  }

  return data as T;
}

export const apiClient = {
  get:      <T>(path: string, options?: ReqOptions) => request<T>('GET', path, undefined, options),
  post: <T, B = unknown>(path: string, body: B, options?: ReqOptions) => request<T>('POST', path, body, options),
  put:  <T, B = unknown>(path: string, body: B, options?: ReqOptions) => request<T>('PUT', path, body, options),
  delete:   <T>(path: string, options?: ReqOptions) => request<T>('DELETE', path, undefined, options),
};
