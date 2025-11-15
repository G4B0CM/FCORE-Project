// src/types/rol.ts
export type CreateRolDto = {
    name: string;
    description: string;
};

export type UpdateRolDto = {
    name: string;
    description: string;
};

export type RolResponseDto = {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
};
