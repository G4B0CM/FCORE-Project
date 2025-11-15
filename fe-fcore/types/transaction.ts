// src/types/transaction.ts
export type TransactionResponse = {
  id: string;
  customer_id: string;
  merchant_id: string;
  amount: number;
  channel: string;
  device_id?: string | null;
  ip_address?: string | null;
  country?: string | null;
  currency: string;
  occurred_at: string;
  customer?: { id: string; full_name: string; document_number: string } | null;
  merchant?: { id: string; name: string; category: string } | null;
};

export type TransactionCreate = {
  customer_id: string;
  merchant_id: string;
  amount: number;
  channel: string;
  device_id?: string | null;
  ip_address?: string | null;
  country?: string | null;
};
