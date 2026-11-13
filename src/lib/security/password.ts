/**
 * Password hashing with PBKDF2 (Web Crypto). Used by the local demo auth so plain
 * passwords are never stored. Replace with Supabase Auth when the backend is connected.
 */
const ITERATIONS = 210_000;

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export function randomId(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

export async function hashPassword(password: string, saltHex = randomId(16)): Promise<{ hash: string; salt: string }> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromHex(saltHex), iterations: ITERATIONS },
    key,
    256,
  );
  return { hash: toHex(bits), salt: saltHex };
}

/** Constant-time comparison so timing doesn't leak how much of the hash matched. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const { hash: candidate } = await hashPassword(password, salt);
  return safeEqual(candidate, hash);
}
