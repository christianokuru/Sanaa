"use client";

import { useRouter } from "next/navigation";
import { CourseDetailsForm, toFormValues, toPayload } from "@/components/teach/CourseDetailsForm";
import { EditorTopBar } from "@/components/teach/EditorTopBar";
import { useRequiredUser } from "@/components/auth/RequireAuth";
import { createDraft } from "@/lib/services/teaching";
import { toast } from "@/lib/services/toast";
import { findCountry } from "@/lib/locale/countries";

export function NewCourseView() {
  const user = useRequiredUser();
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl pb-12">
      <EditorTopBar title="New course" />
      <p className="mb-8 text-ui text-ink-soft">Start with the basics. You'll add lessons on the next screen, and it saves as a draft until you send it for review.</p>
      <CourseDetailsForm
        initial={toFormValues(undefined, findCountry(user.country)?.currency ?? "USD")}
        submitLabel="Create course and add lessons"
        onSubmit={(v) => {
          const res = createDraft(user.id, toPayload(v));
          if (!res.ok) return { ok: false, fields: res.fields };
          toast("Draft created", { tone: "success" });
          router.push(`/teach/courses/${res.data.id}`);
          return { ok: true };
        }}
      />
    </div>
  );
}
