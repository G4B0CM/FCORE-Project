// src/types/role.ts
export type RoleResponse = {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
};
export type RoleCreate = {
  name: string;
  description?: string | null;
};
export type RoleUpdate = {
  name: string;
  description?: string | null;
  is_active: boolean;
};
