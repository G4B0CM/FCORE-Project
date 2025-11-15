// src/services/roles.service.ts
import { apiClient } from './apiClient';
import type { RoleResponse } from '@/types/role';

export const rolesService = {
  all: (token?: string | null) => apiClient.get<RoleResponse[]>('/roles', { token: token ?? null }),
};
