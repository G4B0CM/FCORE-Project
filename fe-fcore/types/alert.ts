// src/types/alert.ts
export type AlertAction = 'ALLOW' | 'CHALLENGE' | 'DENY';
export type AlertResponse = {
  id: string;
  action: AlertAction;
  ml_score?: number | null;
  final_score?: number | null;
  rule_hits?: Record<string, unknown> | null;
  created_at: string;
  transaction?: {
    id: string;
    customer_id: string;
    merchant_id: string;
    amount: number;
    channel: string;
    currency: string;
    occurred_at: string;
  } | null;
  creator?: { id: string; code: string; name: string; lastname: string } | null;
};
