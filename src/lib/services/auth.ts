"use client";

import { getStore, setStore } from "@/lib/store/app-store";
import { GUEST_KEY, type PublicUser, type User } from "@/lib/store/schema";
import { hashPassword, randomId, verifyPassword } from "@/lib/security/password";
import { fieldErrors, loginSchema, passwordChangeSchema, profileSchema, signupSchema } from "@/lib/validation/schemas";
import { fail, ok, type Result } from "@/lib/services/result";

/**
 * Demo authentication that runs on the device. Passwords are hashed with PBKDF2 and
 * repeated failures lock the account for a few minutes. This protects the demo,
 * but real security comes from the server (Supabase Auth) once it is connected.
 */

const MAX_FAILURES = 5;
const LOCK_MS = 5 * 60 * 1000;

export const DEMO_PASSWORD = "Sanaa2026";
export const DEMO_ACCOUNTS = [
  { email: "learner@sanaa.africa", name: "Zola Mokoena", role: "student" as const, country: "ZA" },
  { email: "teacher@sanaa.africa", name: "Adaeze Okafor", role: "teacher" as const, country: "NG", teacherId: "t-adaeze" },
  { email: "admin@sanaa.africa", name: "Sanaa Admin", role: "admin" as const, country: "NG" },
];

let seeding: Promise<void> | null = null;

export function ensureDemoAccounts(): Promise<void> {
  seeding ??= (async () => {
    const existing = new Set(getStore().users.map((u) => u.email));
    const missing = DEMO_ACCOUNTS.filter((a) => !existing.has(a.email));
    if (missing.length === 0) return;
    const created: User[] = [];
    for (const a of missing) {
      const { hash, salt } = await hashPassword(DEMO_PASSWORD);
      created.push({
        id: `u-${randomId(8)}`,
        name: a.name,
        email: a.email,
        role: a.role,
        country: a.country,
        bio: "",
        teacherId: "teacherId" in a ? a.teacherId : undefined,
        passwordHash: hash,
        salt,
        createdAt: new Date().toISOString(),
      });
    }
    setStore((s) => ({ users: [...s.users, ...created] }));
  })();
  return seeding;
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _h, salt: _s, ...rest } = user;
  return rest;
}

function startSession(userId: string) {
  setStore((s) => {
    // Keep anything saved while logged out.
    const guest = s.wishlist[GUEST_KEY] ?? [];
    const mine = s.wishlist[userId] ?? [];
    const wishlist = { ...s.wishlist, [userId]: Array.from(new Set([...mine, ...guest])) };
    delete wishlist[GUEST_KEY];
    return { sessionUserId: userId, wishlist };
  });
}

export async function signUp(input: unknown): Promise<Result<PublicUser>> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  const { name, email, password, country, role } = parsed.data;
  if (getStore().users.some((u) => u.email === email)) {
    return fail("An account with this email already exists.", { email: "This email is already registered. Try logging in." });
  }
  const { hash, salt } = await hashPassword(password);
  const user: User = {
    id: `u-${randomId(8)}`,
    name,
    email,
    role,
    country,
    bio: "",
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };
  setStore((s) => ({ users: [...s.users, user] }));
  startSession(user.id);
  return ok(toPublicUser(user));
}

export async function signIn(input: unknown): Promise<Result<PublicUser>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  await ensureDemoAccounts();
  const { email, password } = parsed.data;

  const guard = getStore().loginGuard[email];
  if (guard && guard.lockedUntil > Date.now()) {
    const mins = Math.ceil((guard.lockedUntil - Date.now()) / 60000);
    return fail(`Too many attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.`);
  }

  const user = getStore().users.find((u) => u.email === email);
  // Always run the hash so response time doesn't reveal whether the email exists.
  const valid = user
    ? await verifyPassword(password, user.passwordHash, user.salt)
    : (await hashPassword(password), false);

  if (!user || !valid) {
    setStore((s) => {
      const failures = (s.loginGuard[email]?.failures ?? 0) + 1;
      const lockedUntil = failures >= MAX_FAILURES ? Date.now() + LOCK_MS : 0;
      return { loginGuard: { ...s.loginGuard, [email]: { failures: lockedUntil ? 0 : failures, lockedUntil } } };
    });
    return fail("Wrong email or password.");
  }

  setStore((s) => {
    const loginGuard = { ...s.loginGuard };
    delete loginGuard[email];
    return { loginGuard };
  });
  startSession(user.id);
  return ok(toPublicUser(user));
}

export function signOut() {
  setStore(() => ({ sessionUserId: null }));
}

/** Log out and reload on the home page, so no protected page or in-memory data lingers. */
export function signOutAndLeave() {
  signOut();
  window.location.assign("/");
}

export function updateProfile(userId: string, input: unknown): Result {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  setStore((s) => ({
    users: s.users.map((u) => (u.id === userId ? { ...u, ...parsed.data, bio: parsed.data.bio ?? u.bio } : u)),
  }));
  return ok(undefined);
}

export async function changePassword(userId: string, input: unknown): Promise<Result> {
  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  const user = getStore().users.find((u) => u.id === userId);
  if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash, user.salt))) {
    return fail("Current password is wrong.", { current: "Current password is wrong" });
  }
  const { hash, salt } = await hashPassword(parsed.data.next);
  setStore((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, passwordHash: hash, salt } : u)) }));
  return ok(undefined);
}

export function becomeTeacher(userId: string) {
  setStore((s) => ({ users: s.users.map((u) => (u.id === userId && u.role === "student" ? { ...u, role: "teacher" } : u)) }));
}

/** Permanently removes the account and everything saved for it. Requires the password. */
export async function deleteAccount(userId: string, password: string): Promise<Result> {
  const user = getStore().users.find((u) => u.id === userId);
  if (!user || !(await verifyPassword(password, user.passwordHash, user.salt))) {
    return fail("Password is wrong.", { password: "Password is wrong" });
  }
  setStore((s) => {
    const omit = <T>(rec: Record<string, T>) => Object.fromEntries(Object.entries(rec).filter(([k]) => k !== userId));
    return {
      users: s.users.filter((u) => u.id !== userId),
      sessionUserId: null,
      enrollments: s.enrollments.filter((e) => e.userId !== userId),
      reviews: s.reviews.filter((r) => r.userId !== userId),
      drafts: s.drafts.filter((d) => d.ownerId !== userId),
      progress: omit(s.progress),
      wishlist: omit(s.wishlist),
      payoutAccounts: omit(s.payoutAccounts),
    };
  });
  return ok(undefined);
}
