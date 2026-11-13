/** Content Security Policy. Scripts only run from this site and with a per-request nonce. */
const MEDIA_HOSTS = ["https://test-streams.mux.dev", process.env.NEXT_PUBLIC_VIDEO_CDN_HOST ? `https://${process.env.NEXT_PUBLIC_VIDEO_CDN_HOST}` : ""]
  .filter(Boolean)
  .join(" ");

export function buildCsp(nonce: string, isDev: boolean): string {
  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": `'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src": "'self' 'unsafe-inline'",
    "img-src": "'self' data: blob:",
    "font-src": "'self'",
    "connect-src": `'self' ${MEDIA_HOSTS}${isDev ? " ws: wss:" : ""}`,
    "media-src": `'self' blob: ${MEDIA_HOSTS}`,
    "worker-src": "'self'",
    "manifest-src": "'self'",
    "object-src": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
  };
  const csp = Object.entries(directives).map(([k, v]) => `${k} ${v}`);
  if (!isDev) csp.push("upgrade-insecure-requests");
  return csp.join("; ");
}
