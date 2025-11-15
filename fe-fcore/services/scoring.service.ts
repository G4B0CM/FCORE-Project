// src/services/scoring.service.ts
import { apiClient } from './apiClient';
import type { ScoringResponse } from '@/types/scoring';

export type ScoreTxInput = {
  customer_id: string;
  merchant_id: string;
  amount: number;
  channel: string;
  device_id?: string | null;
  ip_address?: string | null;
  country?: string | null;
};

export const scoringService = {
  scoreTransaction: (dto: ScoreTxInput, token?: string | null) =>
    apiClient.post<ScoringResponse, ScoreTxInput>('/scoring/score-transaction', dto, { token: token ?? null }),
};
