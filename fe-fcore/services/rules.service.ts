// src/services/rules.service.ts
import { apiClient } from './apiClient';
import type { RuleResponse, RuleCreate, RuleUpdate } from '@/types/rule';

export const rulesService = {
  list: (token?: string | null) => apiClient.get<RuleResponse[]>('/rules', { token: token ?? null }),
  get: (id: string, token?: string | null) => apiClient.get<RuleResponse>(`/rules/${encodeURIComponent(id)}`, { token: token ?? null }),
  create: (dto: RuleCreate, token?: string | null) => apiClient.post<RuleResponse, RuleCreate>('/rules', dto, { token: token ?? null }),
  update: (id: string, dto: RuleUpdate, token?: string | null) => apiClient.put<RuleResponse, RuleUpdate>(`/rules/${encodeURIComponent(id)}`, dto, { token: token ?? null }),
  delete: (id: string, token?: string | null) => apiClient.delete<void>(`/rules/${encodeURIComponent(id)}`, { token: token ?? null }),
};
