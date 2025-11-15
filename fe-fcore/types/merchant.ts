// src/types/merchant.ts
export type MerchantResponse = {
  id: string;
  name: string;
  category: string;
  risk_level: string;
  is_whitelisted: boolean;
  is_blacklisted: boolean;
};

export type MerchantCreate = {
  name: string;
  category: string;
};

export type MerchantUpdate = Partial<MerchantCreate> & {
  risk_level?: string | null;
  is_whitelisted?: boolean | null;
  is_blacklisted?: boolean | null;
};
