import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUp, ArrowDown, Trash2, Eye, EyeOff, ExternalLink, Video } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CourseForm } from "@/components/teach/CourseForm";
import { ThumbnailUploader } from "@/components/teach/ThumbnailUploader";
import { LessonUploader } from "@/components/teach/LessonUploader";
import { SubmitButton } from "@/components/SubmitButton";
import { deleteCourse, lessonAction, refreshDurations, submitForReview } from "@/lib/actions/teach";
import { hasBunny } from "@/lib/bunny";
import { PLATFORM_FEE_RATE } from "@/lib/config";
import { formatDuration } from "@/lib/data";
import type { Course, Lesson } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit course" };

export default async function EditCoursePage({ params, searchParams }: { params: { id: string }; searchParams: { error?: string } }) {
  const user = await requireRole(["teacher", "admin"], `/teach/courses/${params.id}`);
  const supabase = createClient();
  const { data: course } = await supabase.from("courses").select("*").eq("id", params.id).maybeSingle();
  if (!course || course.teacher_id !== user.id) notFound();

  await refreshDurations(course.id);
  const { data: lessonRows } = await supabase.from("lessons").select("*").eq("course_id", course.id).order("position");
  const lessons = (lessonRows ?? []) as Lesson[];
  const c = { ...(course as Course), price: Number(course.price) };

  const statusBox: Record<string, React.ReactNode> = {
    draft: <>This course is a <b>draft</b>. When your lessons are ready, send it for review.</>,
    pending: <>Your course is <b>waiting for review</b>. We usually reply within 2 days.</>,
    published: <>Your course is <b>live</b>. Changes you save show straight away.</>,
    rejected: <>Your course <b>needs changes</b>: {c.rejection_reason || "see our email"}. Fix it and send it again.</>,
  };

  const LessonButton = ({ lesson, op, label, children }: { lesson: Lesson; op: string; label: string; children: React.ReactNode }) => (
    <form action={lessonAction}>
      <input type="hidden" name="courseId" value={c.id} />
      <input type="hidden" name="lessonId" value={lesson.id} />
      <input type="hidden" name="op" value={op} />
      <button className="rounded-full p-2 hover:bg-sand" aria-label={label} title={label}>{children}</button>
    </form>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/teach/dashboard" className="flex items-center gap-1 text-sm font-semibold text-earth-soft"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">{c.title}</h1>

      <div className={`mt-4 rounded-2xl p-4 text-sm ${c.status === "rejected" ? "bg-terracotta-light" : c.status === "published" ? "bg-forest-light" : "bg-gold-light"}`}>
        {statusBox[c.status]}
        <div className="mt-3 flex flex-wrap gap-2">
          {(c.status === "draft" || c.status === "rejected") && (
            <form action={submitForReview}>
              <input type="hidden" name="courseId" value={c.id} />
              <SubmitButton className="btn-primary min-h-[40px] px-5 text-sm">Send for review</SubmitButton>
            </form>
          )}
          <Link href={`/courses/${c.slug}`} className="btn-outline min-h-[40px] px-5 text-sm"><ExternalLink className="h-4 w-4" /> View course page</Link>
        </div>
        {searchParams.error && <p className="mt-2 font-semibold text-terracotta-dark">{searchParams.error}</p>}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">Lessons ({lessons.length})</h2>
        <ol className="card mt-3 divide-y divide-earth/10">
          {lessons.map((l, i) => (
            <li key={l.id} className="flex items-center gap-2 px-3 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand text-sm font-bold">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{l.title}</p>
                <p className="flex items-center gap-2 text-xs text-earth-soft">
                  <Video className="h-3 w-3" />
                  {!l.video_id ? "No video" : l.duration_seconds ? formatDuration(l.duration_seconds) : "Processing video..."}
                  {l.is_preview && <span className="chip bg-forest-light px-2 py-0 text-forest">Free preview</span>}
                </p>
              </div>
              <LessonButton lesson={l} op="preview" label={l.is_preview ? "Make paid" : "Make free preview"}>
                {l.is_preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </LessonButton>
              {i > 0 && <LessonButton lesson={l} op="up" label="Move up"><ArrowUp className="h-4 w-4" /></LessonButton>}
              {i < lessons.length - 1 && <LessonButton lesson={l} op="down" label="Move down"><ArrowDown className="h-4 w-4" /></LessonButton>}
              <LessonButton lesson={l} op="delete" label="Delete lesson"><Trash2 className="h-4 w-4 text-terracotta" /></LessonButton>
            </li>
          ))}
          {lessons.length === 0 && <li className="p-4 text-sm text-earth-soft">No lessons yet. Add your first one below.</li>}
        </ol>
        <div className="mt-4"><LessonUploader courseId={c.id} videoReady={hasBunny} /></div>
        <p className="mt-2 text-sm"><Link href="/teach/guide" className="font-semibold text-terracotta">Tips for filming on your phone →</Link></p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">Cover photo</h2>
        <div className="mt-3"><ThumbnailUploader courseId={c.id} userId={user.id} current={c.thumbnail_url} /></div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">Course details</h2>
        <div className="card mt-3 p-5"><CourseForm course={c} defaultCurrency={c.currency} feeRate={PLATFORM_FEE_RATE} /></div>
      </section>

      {(c.status === "draft" || c.status === "rejected") && (
        <form action={deleteCourse} className="mt-8">
          <input type="hidden" name="courseId" value={c.id} />
          <button className="text-sm font-semibold text-terracotta-dark">Delete this course</button>
        </form>
      )}
    </div>
  );
}
