import type { SocialPlatform } from "@/lib/store/schema";

/** How each platform is labelled and linked. Links are only ever built from a validated handle. */
export const SOCIALS: Record<SocialPlatform, { label: string; url: (handle: string) => string }> = {
  instagram: { label: "Instagram", url: (h) => `https://www.instagram.com/${h}` },
  tiktok: { label: "TikTok", url: (h) => `https://www.tiktok.com/@${h}` },
  youtube: { label: "YouTube", url: (h) => `https://www.youtube.com/@${h}` },
  facebook: { label: "Facebook", url: (h) => `https://www.facebook.com/${h}` },
  x: { label: "X", url: (h) => `https://x.com/${h}` },
};
