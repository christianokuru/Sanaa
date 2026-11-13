import { z } from "zod";

/**
 * Shape of everything the app saves on the device.
 * Every load is validated against this schema, so edited or corrupted storage is discarded
 * instead of crashing the app or injecting unexpected values.
 */

const id = z.string().min(1).max(128);
const iso = z.string().max(40);

export const userSchema = z.object({
  id,
  name: z.string().max(80),
  email: z.string().max(254),
  role: z.enum(["student", "teacher", "admin"]),
  country: z.string().max(2),
  bio: z.string().max(600).default(""),
  teacherId: z.string().max(64).optional(),
  passwordHash: z.string().length(64),
  salt: z.string().length(32),
  createdAt: iso,
});

export const enrollmentSchema = z.object({
  id,
  userId: id,
  courseId: id,
  createdAt: iso,
  amount: z.number().nonnegative(),
  currency: z.string().max(3),
  amountUsd: z.number().nonnegative(),
  method: z.enum(["free", "mobile_money", "card", "bank"]),
  completedAt: iso.optional(),
});

export const userReviewSchema = z.object({
  id,
  userId: id,
  courseId: id,
  author: z.string().max(80),
  country: z.string().max(2),
  rating: z.number().int().min(1).max(5),
  body: z.string().max(1000),
  createdAt: iso,
});

const lessonSchema = z.object({ id, title: z.string().max(120), durationSec: z.number().int().nonnegative(), preview: z.boolean() });

export const draftCourseSchema = z.object({
  id,
  ownerId: id,
  slug: z.string().max(80),
  title: z.string().max(120),
  subtitle: z.string().max(160),
  description: z.string().max(5000),
  category: z.string().max(20),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().nonnegative(),
  currency: z.string().max(3),
  outcomes: z.array(z.string().max(120)).max(12),
  lessons: z.array(lessonSchema).max(200),
  status: z.enum(["draft", "pending", "published", "rejected"]),
  rejectionReason: z.string().max(500).optional(),
  createdAt: iso,
  updatedAt: iso,
});

export const payoutAccountSchema = z.object({
  method: z.enum(["mobile_money", "bank"]),
  country: z.string().max(2),
  currency: z.string().max(3),
  provider: z.string().max(80),
  accountNumber: z.string().max(20),
  accountName: z.string().max(80),
});

export const payoutSchema = z.object({
  id,
  userId: id,
  amountUsd: z.number().nonnegative(),
  amount: z.number().nonnegative(),
  currency: z.string().max(3),
  status: z.enum(["processing", "paid", "failed"]),
  createdAt: iso,
});

export const persistedStateSchema = z.object({
  users: z.array(userSchema).max(500),
  sessionUserId: id.nullable(),
  enrollments: z.array(enrollmentSchema).max(5000),
  progress: z.record(z.array(id).max(5000)),
  wishlist: z.record(z.array(id).max(500)),
  reviews: z.array(userReviewSchema).max(2000),
  drafts: z.array(draftCourseSchema).max(200),
  payoutAccounts: z.record(payoutAccountSchema),
  payouts: z.array(payoutSchema).max(2000),
  courseDecisions: z.record(z.object({ status: z.enum(["published", "rejected"]), reason: z.string().max(500).optional() })),
  prefs: z.object({ dataSaver: z.boolean(), recentSearches: z.array(z.string().max(80)).max(8) }),
  loginGuard: z.record(z.object({ failures: z.number().int().nonnegative(), lockedUntil: z.number().nonnegative() })),
});

export type User = z.infer<typeof userSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type UserReview = z.infer<typeof userReviewSchema>;
export type DraftCourse = z.infer<typeof draftCourseSchema>;
export type PayoutAccount = z.infer<typeof payoutAccountSchema>;
export type Payout = z.infer<typeof payoutSchema>;
export type PersistedState = z.infer<typeof persistedStateSchema>;
export type PublicUser = Omit<User, "passwordHash" | "salt">;

export const GUEST_KEY = "guest";

export const initialState: PersistedState = {
  users: [],
  sessionUserId: null,
  enrollments: [],
  progress: {},
  wishlist: {},
  reviews: [],
  drafts: [],
  payoutAccounts: {},
  payouts: [],
  courseDecisions: {},
  prefs: { dataSaver: false, recentSearches: [] },
  loginGuard: {},
};
