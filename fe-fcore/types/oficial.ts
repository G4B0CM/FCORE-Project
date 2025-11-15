// src/types/oficial.ts
export type CreateOficialDto = {
    q_code: string;
    name: string;
    lastname: string;
    password: string;
};

export type UpdateOficialDto = {
    id: number;
    name: string;
    lastname: string;
};

export type ResponseOficialDto = {
    id: number;
    qcode: string;
    is_active: boolean;
};

export type OficialRole = {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
};
