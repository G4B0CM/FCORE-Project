// src/types/scoring.ts
export type ScoringAction = 'ALLOW' | 'CHALLENGE' | 'DENY';
export type ScoringResponse = {
  transaction_id: string;
  action: ScoringAction;
  ml_score: number;
  final_score: number;
  rule_hits: Array<Record<string, unknown>>;
};
