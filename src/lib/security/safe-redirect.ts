/**
 * Only allow same-site relative paths as redirect targets.
 * Blocks open redirects like `//evil.com`, `/\evil.com` and `javascript:` URLs.
 */
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target || typeof target !== "string") return fallback;
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f]/.test(target)) return fallback;
  return target;
}
