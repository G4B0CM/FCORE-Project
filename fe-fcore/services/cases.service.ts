// src/services/cases.service.ts
import { apiClient } from './apiClient';
import type { CaseResponse, CaseDecision } from '@/types/case';

export const casesService = {
  open: (alert_id: string, token?: string | null) =>
    apiClient.post<CaseResponse, { alert_id: string }>('/cases', { alert_id }, { token: token ?? null }),
  list: (limit = 100, offset = 0, token?: string | null) =>
    apiClient.get<CaseResponse[]>(`/cases?limit=${limit}&offset=${offset}`, { token: token ?? null }),
  get: (id: string, token?: string | null) =>
    apiClient.get<CaseResponse>(`/cases/${encodeURIComponent(id)}`, { token: token ?? null }),
  addNote: (id: string, note: string, token?: string | null) =>
    apiClient.put<CaseResponse, { note: string }>(`/cases/${encodeURIComponent(id)}/notes`, { note }, { token: token ?? null, headers: { 'X-HTTP-Method-Override': 'PATCH' } }),
  resolve: (id: string, decision: CaseDecision, token?: string | null) =>
    apiClient.put<CaseResponse, { decision: CaseDecision }>(`/cases/${encodeURIComponent(id)}/resolve`, { decision }, { token: token ?? null, headers: { 'X-HTTP-Method-Override': 'PATCH' } }),
};
