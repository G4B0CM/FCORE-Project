// src/services/transactions.service.ts
import { apiClient } from './apiClient';
import type { TransactionCreate, TransactionResponse } from '@/types/transaction';

export const transactionsService = {
  list: (params?: { limit?: number; offset?: number }, token?: string | null) =>
    apiClient.get<TransactionResponse[]>(`/transactions?limit=${params?.limit ?? 100}&offset=${params?.offset ?? 0}`, { token: token ?? null }),
  get: (id: string, token?: string | null) =>
    apiClient.get<TransactionResponse>(`/transactions/${encodeURIComponent(id)}`, { token: token ?? null }),
  create: (dto: TransactionCreate, token?: string | null) =>
    apiClient.post<TransactionResponse, TransactionCreate>('/transactions', dto, { token: token ?? null }),
};
