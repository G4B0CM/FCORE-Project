// src/types/customer.ts
export type CustomerResponse = {
  id: string;
  full_name: string;
  document_number: string;
  segment?: string | null;
  age?: number | null;
  risk_profile: string;
};

export type CustomerCreate = {
  full_name: string;
  document_number: string;
  segment?: string | null;
  age?: number | null;
};

export type CustomerUpdate = Partial<CustomerCreate> & {
  risk_profile?: string | null;
};
