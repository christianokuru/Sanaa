import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { CATEGORIES } from "@/config/categories";
import { getAllCourses, getTeachers } from "@/lib/catalog/repository";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["/", "/courses", "/teach", "/teach/guide", "/about", "/help", "/terms", "/privacy", "/credits"].map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.6,
  }));
  return [
    ...staticPages,
    ...CATEGORIES.map((c) => ({ url: absoluteUrl(`/categories/${c.slug}`), lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...getAllCourses().map((c) => ({ url: absoluteUrl(`/courses/${c.slug}`), lastModified: new Date(c.updatedAt), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...getTeachers().map((t) => ({ url: absoluteUrl(`/teachers/${t.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
