import "server-only";
import { createHash } from "crypto";

const LIBRARY = process.env.BUNNY_STREAM_LIBRARY_ID;
const API_KEY = process.env.BUNNY_STREAM_API_KEY;
const CDN_HOST = process.env.BUNNY_STREAM_CDN_HOST;
const TOKEN_KEY = process.env.BUNNY_STREAM_TOKEN_KEY;

export const hasBunny = Boolean(LIBRARY && API_KEY && CDN_HOST);

// Public test stream used in demo mode.
const DEMO_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

/** Create an empty video in Bunny and return what the browser needs to upload it directly. */
export async function createUpload(title: string) {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY}/videos`, {
    method: "POST",
    headers: { AccessKey: API_KEY!, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ title }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Could not create video (${res.status})`);
  const video = (await res.json()) as { guid: string };
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 6;
  const signature = createHash("sha256")
    .update(`${LIBRARY}${API_KEY}${expires}${video.guid}`)
    .digest("hex");
  return {
    endpoint: "https://video.bunnycdn.com/tusupload",
    videoId: video.guid,
    libraryId: LIBRARY!,
    expires,
    signature,
  };
}

export async function getVideoInfo(videoId: string): Promise<{ length: number; status: number } | null> {
  if (!hasBunny) return null;
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY}/videos/${encodeURIComponent(videoId)}`, {
    headers: { AccessKey: API_KEY!, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as { length: number; status: number };
}

export async function deleteVideo(videoId: string) {
  if (!hasBunny) return;
  await fetch(`https://video.bunnycdn.com/library/${LIBRARY}/videos/${encodeURIComponent(videoId)}`, {
    method: "DELETE",
    headers: { AccessKey: API_KEY! },
  }).catch(() => undefined);
}

function base64url(buf: Buffer) {
  return buf.toString("base64").replace(/\n/g, "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/** Streaming URL for a video. Signed (expires after a few hours) when token auth is set up. */
export function playbackUrl(videoId: string | null): string | null {
  if (!videoId) return null;
  if (videoId === "demo" || !hasBunny) return DEMO_STREAM;
  if (!TOKEN_KEY) return `https://${CDN_HOST}/${videoId}/playlist.m3u8`;
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 4;
  const tokenPath = `/${videoId}/`;
  const token = base64url(
    createHash("sha256").update(`${TOKEN_KEY}${tokenPath}${expires}token_path=${tokenPath}`).digest(),
  );
  return `https://${CDN_HOST}/bcdn_token=${token}&expires=${expires}&token_path=${encodeURIComponent(tokenPath)}${tokenPath}playlist.m3u8`;
}

export function thumbnailUrl(videoId: string | null): string | null {
  if (!videoId || videoId === "demo" || !hasBunny) return null;
  return `https://${CDN_HOST}/${videoId}/thumbnail.jpg`;
}
