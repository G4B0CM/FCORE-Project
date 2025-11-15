// src/services/alerts.service.ts
import { apiClient } from './apiClient';
import type { AlertResponse } from '@/types/alert';

export const alertsService = {
  list: (limit = 100, offset = 0, token?: string | null) =>
    apiClient.get<AlertResponse[]>(`/alerts?limit=${limit}&offset=${offset}`, { token: token ?? null }),
  get: (id: string, token?: string | null) =>
    apiClient.get<AlertResponse>(`/alerts/${encodeURIComponent(id)}`, { token: token ?? null }),
};
