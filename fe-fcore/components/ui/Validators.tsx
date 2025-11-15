import { InputValidator } from "./FloatLabelInput";

export const required: InputValidator = (v) =>
    v.trim() === '' ? 'Este campo es obligatorio' : null;

export const minLen = (n: number): InputValidator => (v) =>
    v.length < n ? `Mínimo ${n} caracteres` : null;

export const hasLower: InputValidator = (v) =>
    /[a-z]/.test(v) ? null : 'Debe incluir minúsculas';

export const hasUpper: InputValidator = (v) =>
    /[A-Z]/.test(v) ? null : 'Debe incluir mayúsculas';

export const hasDigit: InputValidator = (v) =>
    /\d/.test(v) ? null : 'Debe incluir números';