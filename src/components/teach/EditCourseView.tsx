"use client";

import { useRouter } from "next/navigation";
import { Send, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CourseCover } from "@/components/course/CourseCover";
import { CourseDetailsForm, toFormValues, toPayload } from "@/components/teach/CourseDetailsForm";
import { EditorTopBar } from "@/components/teach/EditorTopBar";
import { LessonManager } from "@/components/teach/LessonManager";
import { useRequiredUser } from "@/components/auth/RequireAuth";
import { useAppStore } from "@/lib/store/app-store";
import { deleteDraft, submitForReview, updateDraft } from "@/lib/services/teaching";
import { toast } from "@/lib/services/toast";
import { FileQuestion } from "lucide-react";

const STATUS_TEXT = {
  draft: { tone: "canvas", label: "Draft", text: "Add your lessons, then send your course for review." },
  pending: { tone: "saffron", label: "In review", text: "Our team is reviewing your course. We usually reply within 48 hours." },
  published: { tone: "malachite", label: "Live", text: "Your course is live. Changes you save show straight away." },
  rejected: { tone: "ember", label: "Needs changes", text: "" },
} as const;

export function EditCourseView({ id }: { id: string }) {
  const user = useRequiredUser();
  const router = useRouter();
  const draft = useAppStore((s) => s.drafts.find((d) => d.id === id && d.ownerId === user.id));

  if (!draft) {
    return <EmptyState icon={FileQuestion} title="Course not found" action={<Button href="/teach/dashboard" variant="dark">Back to dashboard</Button>}>It may have been deleted.</EmptyState>;
  }
  const status = STATUS_TEXT[draft.status];

  return (
    <div className="pb-12">
      <EditorTopBar title={draft.title} />
      <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="lessons-h">
            <h2 id="lessons-h" className="mb-4 text-section font-semibold">Lessons</h2>
            <LessonManager draft={draft} ownerId={user.id} />
          </section>
          <section aria-labelledby="details-h">
            <h2 id="details-h" className="mb-6 text-section font-semibold">Course details</h2>
            <CourseDetailsForm
              key={draft.id}
              initial={toFormValues(draft, draft.currency)}
              submitLabel="Save changes"
              onSubmit={(v) => {
                const res = updateDraft(user.id, draft.id, toPayload(v));
                if (!res.ok) return { ok: false, fields: res.fields };
                toast("Changes saved", { tone: "success" });
                return { ok: true };
              }}
            />
          </section>
        </div>
        <aside className="order-first lg:order-none">
          <div className="space-y-4 lg:sticky lg:top-[calc(var(--header-h)+32px)]">
            <div className="rounded-card border border-line p-5">
              <div className="w-full"><CourseCover id={draft.id} category={draft.category} /></div>
              <div className="mt-4 flex items-center gap-2"><Badge tone={status.tone}>{status.label}</Badge><span className="text-caption text-ink-soft">{draft.lessons.length} lessons</span></div>
              <p className="mt-3 text-body text-ink-soft">{draft.status === "rejected" ? `Reviewer note: ${draft.rejectionReason}` : status.text}</p>
              {(draft.status === "draft" || draft.status === "rejected") && (
                <Button
                  block
                  className="mt-5"
                  onClick={() => {
                    const res = submitForReview(user.id, draft.id);
                    toast(res.ok ? "Sent for review. We'll be in touch soon." : res.error, { tone: res.ok ? "success" : "error" });
                  }}
                >
                  <Send className="h-4 w-4" /> Send for review
                </Button>
              )}
            </div>
            {draft.status !== "published" && (
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Delete this course? This can't be undone.")) return;
                  deleteDraft(user.id, draft.id);
                  toast("Course deleted");
                  router.push("/teach/dashboard");
                }}
                className="inline-flex items-center gap-2 px-1 text-body font-semibold text-ember underline underline-offset-4"
              >
                <Trash2 className="h-4 w-4" /> Delete course
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
