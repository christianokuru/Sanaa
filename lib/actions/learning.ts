"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabase } from "@/lib/config";

export async function markLessonComplete(lessonId: string, courseSlug: string) {
  if (!hasSupabase) return;
  const user = await requireUser(`/learn/${courseSlug}`);
  const supabase = createClient();
  await supabase
    .from("lesson_progress")
    .upsert({ student_id: user.id, lesson_id: lessonId }, { onConflict: "student_id,lesson_id", ignoreDuplicates: true });

  // When every lesson is done, mark the course complete (unlocks the certificate).
  const { data: lesson } = await supabase.from("lessons").select("course_id").eq("id", lessonId).single();
  if (lesson) {
    const { data: all } = await supabase.from("lessons").select("id").eq("course_id", lesson.course_id);
    const ids = (all ?? []).map((l) => l.id);
    const { count } = await supabase
      .from("lesson_progress")
      .select("lesson_id", { count: "exact", head: true })
      .eq("student_id", user.id)
      .in("lesson_id", ids);
    if (ids.length > 0 && count === ids.length) {
      await createAdminClient()
        .from("enrollments")
        .update({ completed_at: new Date().toISOString() })
        .eq("course_id", lesson.course_id)
        .eq("student_id", user.id)
        .is("completed_at", null);
    }
  }
  revalidatePath(`/learn/${courseSlug}`);
}

export async function saveReview(_: unknown, formData: FormData) {
  if (!hasSupabase) return { error: "Demo mode." };
  const courseId = String(formData.get("courseId"));
  const rating = Math.max(1, Math.min(5, Number(formData.get("rating"))));
  const comment = String(formData.get("comment") ?? "").slice(0, 1000).trim();
  const user = await requireUser("/my-learning");
  const supabase = createClient();
  const { data: course } = await supabase.from("courses").select("slug").eq("id", courseId).single();
  const { error } = await supabase
    .from("reviews")
    .upsert({ course_id: courseId, student_id: user.id, rating, comment }, { onConflict: "course_id,student_id" });
  if (error) return { error: "Could not save your review." };
  if (course) revalidatePath(`/courses/${course.slug}`);
  return { ok: true };
}
