"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextAreaField } from "@/components/ui/Field";
import { StarInput } from "@/components/ui/Rating";
import { ReviewCard } from "@/components/course/ReviewCard";
import { useAppStore } from "@/lib/store/app-store";
import { useCurrentUser, useEnrollment } from "@/lib/hooks/use-store";
import { saveReview } from "@/lib/services/library";
import { toast } from "@/lib/services/toast";

/** Shows the learner's own review, and lets enrolled learners write or edit one. */
export function MyReview({ courseId }: { courseId: string }) {
  const user = useCurrentUser();
  const enrollment = useEnrollment(courseId);
  const mine = useAppStore((s) => s.reviews.find((r) => r.courseId === courseId && r.userId === s.sessionUserId));
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user || !enrollment) return null;

  function startEdit() {
    setRating(mine?.rating ?? 0);
    setBody(mine?.body ?? "");
    setErrors({});
    setEditing(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = saveReview(user!, courseId, { rating, body });
    if (!res.ok) return setErrors(res.fields ?? { _form: res.error });
    setEditing(false);
    toast("Thanks! Your review is live.", { tone: "success" });
  }

  if (!editing) {
    return (
      <div className="mb-8 rounded-2xl bg-canvas p-5">
        {mine ? (
          <>
            <ReviewCard {...mine} mine />
            <Button variant="link" className="mt-3" onClick={startEdit}>Edit your review</Button>
          </>
        ) : (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-ui"><span className="font-semibold">You&apos;re enrolled.</span> How is the course so far?</p>
            <Button variant="dark" size="sm" onClick={startEdit}>Write a review</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mb-8 space-y-5 rounded-2xl border border-line p-5">
      <p className="text-ui font-semibold">Rate this course</p>
      <StarInput value={rating} onChange={setRating} error={errors.rating} />
      <TextAreaField label="Your review" value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} error={errors.body} placeholder="What did you learn? What could be better?" />
      {errors._form && <p role="alert" className="text-body text-ember">{errors._form}</p>}
      <div className="flex gap-3">
        <Button type="submit" variant="dark">Post review</Button>
        <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
      </div>
    </form>
  );
}
