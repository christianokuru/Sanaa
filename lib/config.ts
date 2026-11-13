export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const PLATFORM_FEE_RATE = Number(process.env.PLATFORM_FEE_RATE ?? "0.2");

export const CATEGORIES = [
  { slug: "fashion", name: "Fashion & Sewing", short: "Fashion", blurb: "Ankara styles, pattern cutting, beadwork" },
  { slug: "hair-beauty", name: "Hair & Beauty", short: "Hair & Beauty", blurb: "Braiding, wig making, makeup" },
  { slug: "dance-music", name: "Dance & Music", short: "Dance & Music", blurb: "Afrobeats, Amapiano, drumming" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
