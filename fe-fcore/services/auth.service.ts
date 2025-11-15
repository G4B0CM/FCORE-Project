import { apiClient } from './apiClient';
import type { ValidateResponse } from '@/types/auth';

export const authService = {
    validate: (token?: string | null) =>
        apiClient.post<ValidateResponse, unknown>('/auth/validate', {}, { token: token ?? null }),
};
