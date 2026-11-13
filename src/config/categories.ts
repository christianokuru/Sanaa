export const CATEGORY_SLUGS = ["fashion", "hair", "beauty", "dance", "music", "crafts"] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type Category = {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  /** Cover art colors, strongest first. */
  palette: [string, string, string];
};

export const CATEGORIES: Category[] = [
  { slug: "fashion", name: "Fashion & Sewing", short: "Fashion", description: "Ankara, agbada, pattern cutting and tailoring that sells.", palette: ["#D93A16", "#F4A51C", "#191D57"] },
  { slug: "hair", name: "Hair & Braiding", short: "Hair", description: "Knotless, Fulani, cornrows, locs and wig making.", palette: ["#2747D8", "#F4A51C", "#E2477F"] },
  { slug: "beauty", name: "Makeup & Beauty", short: "Beauty", description: "Bridal, editorial and everyday makeup for melanin-rich skin.", palette: ["#E2477F", "#D93A16", "#F2E8D9"] },
  { slug: "dance", name: "Dance", short: "Dance", description: "Amapiano, Afrobeats, Azonto and choreography for the camera.", palette: ["#F4A51C", "#2747D8", "#1A1A1A"] },
  { slug: "music", name: "Music & Drums", short: "Music", description: "Djembe, talking drum, kora and the rhythms behind the songs.", palette: ["#0B8457", "#F4A51C", "#D93A16"] },
  { slug: "crafts", name: "Crafts & Beadwork", short: "Crafts", description: "Beadwork, weaving, pottery and leather goods to sell.", palette: ["#191D57", "#0B8457", "#F4A51C"] },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function isCategorySlug(slug: string | undefined | null): slug is CategorySlug {
  return !!slug && (CATEGORY_SLUGS as readonly string[]).includes(slug);
}
