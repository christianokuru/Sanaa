export type Result<T = void> = { ok: true; data: T } | { ok: false; error: string; fields?: Record<string, string> };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const fail = (error: string, fields?: Record<string, string>): Result<never> => ({ ok: false, error, fields });
