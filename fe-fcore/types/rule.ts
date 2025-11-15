// src/types/rule.ts
export type RuleSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RuleResponse = {
  id: string;
  name: string;
  dsl_expression: string;
  severity: RuleSeverity;
  enabled: boolean;
  created_at: string;
  created_by: string;
  updated_at?: string | null;
  updated_by?: string | null;
};

export type RuleCreate = {
  name: string;
  dsl_expression: string;
  severity: RuleSeverity;
};

export type RuleUpdate = Partial<RuleCreate> & { enabled?: boolean | null };
