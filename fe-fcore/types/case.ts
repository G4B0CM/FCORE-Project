// src/types/case.ts
export type CaseDecision = 'PENDING' | 'CONFIRMED_FRAUD' | 'FALSE_POSITIVE';
export type CaseResponse = {
  id: string;
  decision: CaseDecision;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  alert?: import('./alert').AlertResponse | null;
  analyst?: { id: string; code: string; name: string; lastname: string } | null;
};
