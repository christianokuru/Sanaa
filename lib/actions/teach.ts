"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, LEVELS } from "@/lib/config";
import { ALL_COUNTRIES, findCountry } from "@/lib/countries";
import { createUpload, deleteVideo, getVideoInfo, hasBunny } from "@/lib/bunny";

type State = { error?: string; message?: string } | null;

const TEACHER = ["teacher", "admin"] as const;

function slugify(s: string) {
  const base = s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 60);
  return `${base || "course"}-${randomBytes(2).toString("hex")}`;
}

const CURRENCIES = new Set(ALL_COUNTRIES.map((c) => c.currency));

function readCourseFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const category = String(formData.get("category") ?? "");
  const level = String(formData.get("level") ?? "beginner");
  const currency = String(formData.get("currency") ?? "USD");
  const price = Math.max(0, Math.round(Number(formData.get("price") ?? 0) * 100) / 100);
  return {
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim().slice(0, 160),
    description: String(formData.get("description") ?? "").trim().slice(0, 5000),
    category: CATEGORIES.some((c) => c.slug === category) ? category : "fashion",
    level: (LEVELS as readonly string[]).includes(level) ? level : "beginner",
    currency: CURRENCIES.has(currency) ? currency : "USD",
    price: Number.isFinite(price) ? price : 0,
    what_you_learn: String(formData.get("what_you_learn") ?? "")
      .split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12),
  };
}

async function ownCourse(courseId: string, userId: string) {
  const { data } = await createClient()
    .from("courses").select("id, slug, teacher_id, status").eq("id", courseId).maybeSingle();
  if (!data || data.teacher_id !== userId) throw new Error("Course not found");
  return data;
}

export async function createCourse(_: State, formData: FormData): Promise<State> {
  const user = await requireRole([...TEACHER], "/teach/courses/new");
  const fields = readCourseFields(formData);
  if (fields.title.length < 4) return { error: "Please give your course a title." };
  const { data, error } = await createClient()
    .from("courses")
    .insert({ ...fields, teacher_id: user.id, slug: slugify(fields.title), status: "draft" })
    .select("id")
    .single();
  if (error || !data) return { error: "Could not create the course." };
  redirect(`/teach/courses/${data.id}`);
}

export async function updateCourse(_: State, formData: FormData): Promise<State> {
  const user = await requireRole([...TEACHER], "/teach/dashboard");
  const courseId = String(formData.get("courseId"));
  const course = await ownCourse(courseId, user.id);
  const fields = readCourseFields(formData);
  if (fields.title.length < 4) return { error: "Please give your course a title." };
  const { error } = await createClient().from("courses").update(fields).eq("id", courseId);
  if (error) return { error: "Could not save." };
  revalidatePath(`/teach/courses/${courseId}`);
  revalidatePath(`/courses/${course.slug}`);
  return { message: "Saved." };
}

export async function setThumbnail(courseId: string, url: string) {
  const user = await requireRole([...TEACHER], "/teach/dashboard");
  await ownCourse(courseId, user.id);
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !url.startsWith(`${base}/storage/v1/object/public/thumbnails/${user.id}/`)) {
    throw new Error("Invalid image");
  }
  await createClient().from("courses").update({ thumbnail_url: url }).eq("id", courseId);
  revalidatePath(`/teach/courses/${courseId}`);
}

export async function submitForReview(formData: FormData) {
  const user = await requireRole([...TEACHER], "/teach/dashboard");
  const courseId = String(formData.get("courseId"));
  await ownCourse(courseId, user.id);
  const supabase = createClient();
  const { count } = await supabase.from("lessons").select("id", { count: "exact", head: true }).eq("course_id", courseId);
  if (!count) redirect(`/teach/courses/${courseId}?error=${encodeURIComponent("Add at least one lesson first.")}`);
  await supabase.from("courses").update({ status: "pending", rejection_reason: null }).eq("id", courseId);
  revalidatePath(`/teach/courses/${courseId}`);
  revalidatePath("/teach/dashboard");
}

export async function deleteCourse(formData: FormData) {
  const user = await requireRole([...TEACHER], "/teach/dashboard");
  const courseId = String(formData.get("courseId"));
  const course = await ownCourse(courseId, user.id);
  if (course.status !== "draft" && course.status !== "rejected") return;
  const supabase = createClient();
  const { data: lessons } = await supabase.from("lessons").select("video_id").eq("course_id", courseId);
  await supabase.from("courses").delete().eq("id", courseId);
  await Promise.all((lessons ?? []).map((l) => (l.video_id ? deleteVideo(l.video_id) : null)));
  redirect("/teach/dashboard");
}

// ---------- Lessons ----------

export async function createVideoUpload(courseId: string, title: string) {
  const user = await requireRole([...TEACHER], "/teach/dashboard");
  await ownCourse(courseId, user.id);
  if (!hasBunny) return null;
  return createUpload(title.slice(0, 120) || "Lesson");
}

export async function addLesson(input: { courseId: string; title: string; videoId: string | null; isPreview: boolean }) {
  const user = await requireRole([...TEACHER], "/teach/dashboard");
  await ownCourse(input.courseId, user.id);
  const supabase = createClient();
  const { data: last } = await supabase
    .from("lessons").select("position").eq("course_id", input.courseId)
    .order("position", { ascending: false }).limit(1).maybeSingle();
  const { error } = await supabase.from("lessons").insert({
    course_id: input.courseId,
    title: input.title.trim().slice(0, 120) || "Lesson",
    video_id: input.videoId,
    is_preview: input.isPreview,
    position: (last?.position ?? -1) + 1,
  });
  if (error) throw new Error("Could not add lesson");
  revalidatePath(`/teach/courses/${input.courseId}`);
}

export async function lessonAction(formData: FormData) {
  const user = await requireRole([...TEACHER], "/teach/dashboard");
  const courseId = String(formData.get("courseId"));
  const lessonId = String(formData.get("lessonId"));
  const op = String(formData.get("op"));
  await ownCourse(courseId, user.id);
  const supabase = createClient();
  const { data: lessons } = await supabase
    .from("lessons").select("id, position, video_id, is_preview").eq("course_id", courseId).order("position");
  const list = lessons ?? [];
  const i = list.findIndex((l) => l.id === lessonId);
  if (i < 0) return;

  if (op === "delete") {
    await supabase.from("lessons").delete().eq("id", lessonId);
    if (list[i].video_id) await deleteVideo(list[i].video_id);
  } else if (op === "preview") {
    await supabase.from("lessons").update({ is_preview: !list[i].is_preview }).eq("id", lessonId);
  } else if (op === "up" || op === "down") {
    const j = op === "up" ? i - 1 : i + 1;
    if (j >= 0 && j < list.length) {
      const order = [...list];
      [order[i], order[j]] = [order[j], order[i]];
      await Promise.all(order.map((l, pos) => supabase.from("lessons").update({ position: pos }).eq("id", l.id)));
    }
  }
  revalidatePath(`/teach/courses/${courseId}`);
}

/** Fill in lesson lengths once Bunny has finished processing the videos. */
export async function refreshDurations(courseId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("lessons").select("id, video_id").eq("course_id", courseId).is("duration_seconds", null).not("video_id", "is", null);
  await Promise.all(
    (data ?? []).map(async (l) => {
      const info = await getVideoInfo(l.video_id!);
      if (info && info.length > 0) {
        await supabase.from("lessons").update({ duration_seconds: Math.round(info.length) }).eq("id", l.id);
      }
    }),
  );
}

// ---------- Payout details ----------

export async function savePayoutAccount(_: State, formData: FormData): Promise<State> {
  const user = await requireRole([...TEACHER], "/teach/payout");
  const method = formData.get("method") === "bank" ? "bank" : "mobile_money";
  const country = findCountry(String(formData.get("country") ?? ""));
  const providerCode = String(formData.get("provider_code") ?? "").trim();
  const accountNumber = String(formData.get("account_number") ?? "").replace(/\s+/g, "");
  const accountName = String(formData.get("account_name") ?? "").trim();
  if (!country) return { error: "Choose your country." };
  if (!providerCode) return { error: method === "bank" ? "Choose your bank." : "Choose your mobile money network." };
  if (accountNumber.length < 6) return { error: method === "bank" ? "Enter your account number." : "Enter your phone number with country code, e.g. 2547..." };
  if (accountName.length < 2) return { error: "Enter the name on the account." };

  const { error } = await createClient().from("payout_accounts").upsert({
    teacher_id: user.id,
    method,
    country: country.code,
    currency: country.currency,
    provider_code: providerCode,
    provider_name: String(formData.get("provider_name") ?? "").slice(0, 80) || null,
    account_number: accountNumber,
    account_name: accountName,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: "Could not save." };
  revalidatePath("/teach/dashboard");
  return { message: "Payout details saved." };
}

export async function listBanks(country: string): Promise<{ code: string; name: string }[]> {
  await requireRole([...TEACHER], "/teach/payout");
  const { getBanks, hasFlutterwave } = await import("@/lib/flutterwave");
  if (!hasFlutterwave || !findCountry(country)) return [];
  try {
    const banks = await getBanks(country);
    return banks.map((b) => ({ code: b.code, name: b.name })).sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}
