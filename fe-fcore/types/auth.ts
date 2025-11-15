// src/types/auth.ts
export type AuthRequest = {
    username: string;
    password: string;
};

export type AuthResponse = {
    username: string;
    token: string;
    status: number;
};

export type TokenPayload = {
    sub?: string;
    username?: string;
    role?: string;
    roles?: string[];
    exp?: number;
    [k: string]: unknown;
};

export type ValidateResponse =
    | { status: 'ok'; payload: TokenPayload }
    | { status: 'error'; detail?: string };
