// src/services/roles.service.ts
import { apiClient } from './apiClient';
import type { RoleResponse, RoleCreate, RoleUpdate } from '@/types/role';

export const rolesService = {
  list: (token?: string | null) => apiClient.get<RoleResponse[]>('/roles', { token: token ?? null }),
  create: (dto: RoleCreate, token?: string | null) => apiClient.post<RoleResponse, RoleCreate>('/roles', dto, { token: token ?? null }),
  get: (id: string, token?: string | null) => apiClient.get<RoleResponse>(`/roles/${encodeURIComponent(id)}`, { token: token ?? null }),
  update: (id: string, dto: RoleUpdate, token?: string | null) => apiClient.put<RoleResponse, RoleUpdate>(`/roles/${encodeURIComponent(id)}`, dto, { token: token ?? null }),
  delete: (id: string, token?: string | null) => apiClient.delete<void>(`/roles/${encodeURIComponent(id)}`, { token: token ?? null }),
};
