// src/services/behavior.service.ts
import { apiClient } from './apiClient';
import type { BehaviorProfileResponse } from '@/types/behavior';

export const behaviorService = {
  getByCustomer: (customer_id: string, token?: string | null) =>
    apiClient.get<BehaviorProfileResponse>(`/behavior/${encodeURIComponent(customer_id)}`, { token: token ?? null }),
};
