// src/types/auth.ts
export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: 'bearer';
};

export type TokenPayload = {
  sub: string;
  role: string;
  exp: number;
  jti: string;
  type: string;
};

export type ValidateResponse =
  | { status: 'ok'; payload: TokenPayload }
  | { status: 'error'; detail?: string };
