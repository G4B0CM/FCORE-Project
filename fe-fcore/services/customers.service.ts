// src/services/customers.service.ts
import { apiClient } from './apiClient';
import type { CustomerResponse, CustomerCreate, CustomerUpdate } from '@/types/customer';

export const customersService = {
  list:   (token?: string | null) => apiClient.get<CustomerResponse[]>('/customers', { token: token ?? null }),
  get:    (id: string, token?: string | null) => apiClient.get<CustomerResponse>(`/customers/${encodeURIComponent(id)}`, { token: token ?? null }),
  create: (dto: CustomerCreate, token?: string | null) => apiClient.post<CustomerResponse, CustomerCreate>('/customers', dto, { token: token ?? null }),
  update: (id: string, dto: CustomerUpdate, token?: string | null) => apiClient.put<CustomerResponse, CustomerUpdate>(`/customers/${encodeURIComponent(id)}`, dto, { token: token ?? null }),
  delete: (id: string, token?: string | null) => apiClient.delete<void>(`/customers/${encodeURIComponent(id)}`, { token: token ?? null }),
};
