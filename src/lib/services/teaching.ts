"use client";

import { getStore, setStore } from "@/lib/store/app-store";
import type { DraftCourse, PayoutAccount } from "@/lib/store/schema";
import { randomId } from "@/lib/security/password";
import { slugify } from "@/lib/utils/slug";
import { findCountry } from "@/lib/locale/countries";
import { courseDetailsSchema, fieldErrors, lessonSchema, payoutSchema } from "@/lib/validation/schemas";
import { fail, ok, type Result } from "@/lib/services/result";

/** Course drafts and payout settings for teachers. */

function now() {
  return new Date().toISOString();
}

function ownDraft(ownerId: string, draftId: string): DraftCourse | undefined {
  return getStore().drafts.find((d) => d.id === draftId && d.ownerId === ownerId);
}

function patchDraft(draftId: string, patch: Partial<DraftCourse>) {
  setStore((s) => ({ drafts: s.drafts.map((d) => (d.id === draftId ? { ...d, ...patch, updatedAt: now() } : d)) }));
}

export function createDraft(ownerId: string, input: unknown): Result<DraftCourse> {
  const parsed = courseDetailsSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  const id = `d-${randomId(6)}`;
  const draft: DraftCourse = {
    ...parsed.data,
    id,
    ownerId,
    slug: `${slugify(parsed.data.title)}-${id.slice(2, 6)}`,
    lessons: [],
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  };
  setStore((s) => ({ drafts: [draft, ...s.drafts] }));
  return ok(draft);
}

export function updateDraft(ownerId: string, draftId: string, input: unknown): Result {
  if (!ownDraft(ownerId, draftId)) return fail("Course not found.");
  const parsed = courseDetailsSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  patchDraft(draftId, parsed.data);
  return ok(undefined);
}

export function addLesson(ownerId: string, draftId: string, input: unknown): Result {
  const draft = ownDraft(ownerId, draftId);
  if (!draft) return fail("Course not found.");
  const parsed = lessonSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  patchDraft(draftId, {
    lessons: [
      ...draft.lessons,
      { id: `${draftId}-l${randomId(4)}`, title: parsed.data.title, durationSec: parsed.data.minutes * 60, preview: parsed.data.preview },
    ],
  });
  return ok(undefined);
}

export function lessonAction(ownerId: string, draftId: string, lessonId: string, action: "up" | "down" | "delete" | "preview") {
  const draft = ownDraft(ownerId, draftId);
  if (!draft) return;
  const lessons = [...draft.lessons];
  const i = lessons.findIndex((l) => l.id === lessonId);
  if (i < 0) return;
  if (action === "delete") lessons.splice(i, 1);
  if (action === "preview") lessons[i] = { ...lessons[i]!, preview: !lessons[i]!.preview };
  if (action === "up" && i > 0) [lessons[i - 1], lessons[i]] = [lessons[i]!, lessons[i - 1]!];
  if (action === "down" && i < lessons.length - 1) [lessons[i + 1], lessons[i]] = [lessons[i]!, lessons[i + 1]!];
  patchDraft(draftId, { lessons });
}

export function submitForReview(ownerId: string, draftId: string): Result {
  const draft = ownDraft(ownerId, draftId);
  if (!draft) return fail("Course not found.");
  if (draft.lessons.length === 0) return fail("Add at least one lesson before sending for review.");
  patchDraft(draftId, { status: "pending", rejectionReason: undefined });
  return ok(undefined);
}

export function deleteDraft(ownerId: string, draftId: string) {
  setStore((s) => ({ drafts: s.drafts.filter((d) => !(d.id === draftId && d.ownerId === ownerId && d.status !== "published")) }));
}

export function savePayoutAccount(userId: string, input: unknown): Result {
  const parsed = payoutSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  const country = findCountry(parsed.data.country);
  if (!country) return fail("Choose your country.");
  const account: PayoutAccount = { ...parsed.data, currency: country.currency };
  setStore((s) => ({ payoutAccounts: { ...s.payoutAccounts, [userId]: account } }));
  return ok(undefined);
}
