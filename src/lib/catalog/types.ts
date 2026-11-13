import type { CategorySlug } from "@/config/categories";

export type Level = "beginner" | "intermediate" | "advanced";

export type Teacher = {
  id: string;
  slug: string;
  name: string;
  title: string;
  country: string;
  city: string;
  bio: string;
  yearsExperience: number;
  verified: boolean;
};

export type Lesson = {
  id: string;
  title: string;
  durationSec: number;
  preview: boolean;
};

export type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

/** A self-hosted photo, served at 480, 1080 and 1600 pixels wide. */
export type CoverImage = {
  src: string;
  alt: string;
  credit: PhotoCredit;
};

export type PhotoCredit = {
  creator: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
};

export type CourseBadge = "bestseller" | "top-rated" | "new";

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: CategorySlug;
  level: Level;
  language: string;
  price: number;
  currency: string;
  teacherId: string;
  outcomes: string[];
  requirements: string[];
  sections: Section[];
  rating: number;
  ratingCount: number;
  students: number;
  badge?: CourseBadge;
  /** Real cover photo. Falls back to generated art when missing. */
  cover?: CoverImage;
  updatedAt: string;
};

export type Review = {
  id: string;
  courseId: string;
  author: string;
  country: string;
  rating: number;
  body: string;
  createdAt: string;
};

export type CourseSort = "popular" | "rating" | "newest" | "price-low" | "price-high";

export type CourseQuery = {
  q?: string;
  category?: CategorySlug;
  level?: Level;
  price?: "free" | "paid";
  sort?: CourseSort;
};
