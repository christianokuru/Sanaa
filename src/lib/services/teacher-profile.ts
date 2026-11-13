"use client";

import { getStore, setStore } from "@/lib/store/app-store";
import { PHOTO_DATA_URL, type PublicUser, type TeacherProfile } from "@/lib/store/schema";
import { randomId } from "@/lib/security/password";
import { fieldErrors, socialsSchema, testimonialInputSchema } from "@/lib/validation/schemas";
import { fail, ok, type Result } from "@/lib/services/result";

/**
 * A teacher's public extras: photo, social handles and reviews from past clients.
 * Saved under the teacher's catalog id, so it shows on their course and profile pages.
 */

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD = 10 * 1024 * 1024;
const PHOTO_PX = 480;
const MAX_TESTIMONIALS = 6;

/** Where this user's public profile is stored: their catalog teacher id, else their user id. */
export function profileKey(user: Pick<PublicUser, "id" | "teacherId">): string {
  return user.teacherId ?? user.id;
}

function canTeach(user: PublicUser) {
  return user.role === "teacher" || user.role === "admin";
}

function patch(user: PublicUser, update: (p: TeacherProfile) => Partial<TeacherProfile>) {
  const key = profileKey(user);
  setStore((s) => {
    const current: TeacherProfile = s.teacherProfiles[key] ?? { socials: {}, testimonials: [], updatedAt: "" };
    return { teacherProfiles: { ...s.teacherProfiles, [key]: { ...current, ...update(current), updatedAt: new Date().toISOString() } } };
  });
}

/**
 * Checks the file, crops it to a centred square and re-draws it at 480 px.
 * Re-drawing strips hidden data (like GPS location) and anything that isn't a real image.
 */
export async function preparePhoto(file: File): Promise<Result<string>> {
  if (!PHOTO_TYPES.includes(file.type)) return fail("Use a JPG, PNG or WebP photo.");
  if (file.size > MAX_UPLOAD) return fail("That photo is too big. Use one under 10 MB.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return fail("We couldn't read that photo. Try another one.");
  }
  const side = Math.min(bitmap.width, bitmap.height);
  if (side < 200) {
    bitmap.close();
    return fail("That photo is too small. Use one at least 200 pixels wide.");
  }
  const size = Math.min(PHOTO_PX, side);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return fail("Your browser couldn't process the photo.");
  // Keep the upper part of tall photos, where the face usually is.
  const sx = (bitmap.width - side) / 2;
  const sy = bitmap.height > bitmap.width ? (bitmap.height - side) * 0.25 : 0;
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);
  bitmap.close();

  let url = canvas.toDataURL("image/webp", 0.85);
  if (!url.startsWith("data:image/webp")) url = canvas.toDataURL("image/jpeg", 0.85); // older Safari
  if (!PHOTO_DATA_URL.test(url) || url.length > 300_000) return fail("We couldn't process that photo. Try another one.");
  return ok(url);
}

export function savePhoto(user: PublicUser, dataUrl: string): Result {
  if (!canTeach(user)) return fail("Only teachers have a public profile.");
  if (!PHOTO_DATA_URL.test(dataUrl) || dataUrl.length > 300_000) return fail("That photo couldn't be saved.");
  patch(user, () => ({ photo: dataUrl }));
  return ok(undefined);
}

export function removePhoto(user: PublicUser) {
  patch(user, () => ({ photo: undefined }));
}

export function saveSocials(user: PublicUser, input: unknown): Result {
  if (!canTeach(user)) return fail("Only teachers have a public profile.");
  const parsed = socialsSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  patch(user, () => ({ socials: parsed.data }));
  return ok(undefined);
}

export function addTestimonial(user: PublicUser, input: unknown): Result {
  if (!canTeach(user)) return fail("Only teachers have a public profile.");
  const parsed = testimonialInputSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  const existing = getStore().teacherProfiles[profileKey(user)]?.testimonials ?? [];
  if (existing.length >= MAX_TESTIMONIALS) return fail(`You can show up to ${MAX_TESTIMONIALS} reviews. Remove one to add another.`);
  patch(user, (p) => ({
    testimonials: [{ id: `tm-${randomId(6)}`, author: parsed.data.author, context: parsed.data.context, body: parsed.data.body, createdAt: new Date().toISOString() }, ...p.testimonials],
  }));
  return ok(undefined);
}

export function removeTestimonial(user: PublicUser, id: string) {
  patch(user, (p) => ({ testimonials: p.testimonials.filter((t) => t.id !== id) }));
}

export { MAX_TESTIMONIALS };
