// src/services/merchants.service.ts
import { apiClient } from './apiClient';
import type { MerchantResponse, MerchantCreate, MerchantUpdate } from '@/types/merchant';

export const merchantsService = {
  list:   (token?: string | null) => apiClient.get<MerchantResponse[]>('/merchants', { token: token ?? null }),
  get:    (id: string, token?: string | null) => apiClient.get<MerchantResponse>(`/merchants/${encodeURIComponent(id)}`, { token: token ?? null }),
  create: (dto: MerchantCreate, token?: string | null) => apiClient.post<MerchantResponse, MerchantCreate>('/merchants', dto, { token: token ?? null }),
  update: (id: string, dto: MerchantUpdate, token?: string | null) => apiClient.put<MerchantResponse, MerchantUpdate>(`/merchants/${encodeURIComponent(id)}`, dto, { token: token ?? null }),
  delete: (id: string, token?: string | null) => apiClient.delete<void>(`/merchants/${encodeURIComponent(id)}`, { token: token ?? null }),
};
