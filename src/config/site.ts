/** Courses shown in the home page hero, picked by hand for strong photos from different crafts. */
export const HERO_COURSE_IDS = ["c-gele", "c-djembe", "c-ankara-dress"] as const;

export const siteConfig = {
  name: "Sanaa",
  tagline: "Learn the craft. Earn from it.",
  description:
    "Sanaa is Africa's home for craft. Learn sewing, braiding, makeup, dance, drumming and beadwork from master teachers, in your own currency, on your phone.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en",
  twitter: "@sanaa",
  supportEmail: "hello@sanaa.africa",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
