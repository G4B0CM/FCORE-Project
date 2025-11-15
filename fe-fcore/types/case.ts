// src/types/case.ts
export type CaseDecision = 'APPROVED' | 'DECLINED' | 'NEED_MORE_INFO' | 'FALSE_POSITIVE';
export type CaseResponse = {
  id: string;
  decision: CaseDecision;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  alert?: import('./alert').AlertResponse | null;
  analyst?: { id: string; code: string; name: string; lastname: string } | null;
};
