// src/types/analyst.ts
export type AnalystResponse = {
  id: string;
  code: string;
  name: string;
  lastname: string;
  is_active: boolean;
  role: { id: string; name: string };
};

export type AnalystCreate = {
  code: string;
  name: string;
  lastname: string;
  password: string;
  role_id: string;
};

export type AnalystUpdate = {
  name?: string | null;
  lastname?: string | null;
  role_id?: string | null;
};
