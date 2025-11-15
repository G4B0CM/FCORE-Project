// src/types/behavior.ts
export type BehaviorProfileResponse = {
  customer_id: string;
  avg_amount_24h: number;
  tx_count_10m: number;
  tx_count_30m: number;
  tx_count_24h: number;
  usual_country?: string | null;
  usual_ip?: string | null;
  usual_hour_band?: string | null;
  updated_at: string;
  customer?: { id: string; full_name: string; document_number: string } | null;
};
