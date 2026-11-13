export type Role = "student" | "teacher" | "admin";

export type Profile = {
  id: string;
  full_name: string;
  role: Role;
  country: string | null;
  bio: string | null;
};

export type CourseStatus = "draft" | "pending" | "published" | "rejected";

export type Course = {
  id: string;
  teacher_id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  price: number;
  currency: string;
  thumbnail_url: string | null;
  what_you_learn: string[];
  status: CourseStatus;
  rejection_reason: string | null;
  created_at: string;
  teacher?: Pick<Profile, "id" | "full_name" | "country" | "bio"> | null;
};

export type CourseStats = {
  student_count: number;
  lesson_count: number;
  total_seconds: number;
  rating_avg: number;
  rating_count: number;
};

export type CourseWithStats = Course & { stats: CourseStats };

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  position: number;
  video_id: string | null;
  duration_seconds: number | null;
  is_preview: boolean;
};

export type Review = {
  id: string;
  course_id: string;
  student_id: string;
  rating: number;
  comment: string;
  created_at: string;
  student?: { full_name: string; country: string | null } | null;
};
