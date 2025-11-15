// src/services/analysts.service.ts
import { apiClient } from './apiClient';
import type { AnalystCreate, AnalystUpdate, AnalystResponse } from '@/types/analyst';

export const analystsService = {
  list: (token?: string | null) => apiClient.get<AnalystResponse[]>('/analysts', { token: token ?? null }),
  getByCode: (code: string, token?: string | null) => apiClient.get<AnalystResponse>(`/analysts/${encodeURIComponent(code)}`, { token: token ?? null }),
  create: (dto: AnalystCreate, token?: string | null) => apiClient.post<AnalystResponse, AnalystCreate>('/analysts', dto, { token: token ?? null }),
  update: (code: string, dto: AnalystUpdate, token?: string | null) => apiClient.put<AnalystResponse, AnalystUpdate>(`/analysts/${encodeURIComponent(code)}`, dto, { token: token ?? null }),
  deactivate: (code: string, token?: string | null) => apiClient.post<AnalystResponse, Record<string, never>>(`/analysts/deactivate/${encodeURIComponent(code)}`, {}, { token: token ?? null }),
};
