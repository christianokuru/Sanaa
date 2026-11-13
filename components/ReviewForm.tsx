"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Star } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";
import { saveReview } from "@/lib/actions/learning";
import type { Review } from "@/lib/types";

export function ReviewForm({ courseId, existing }: { courseId: string; existing?: Review }) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [state, action] = useFormState(saveReview, null);
  return (
    <form action={action} className="card mt-3 space-y-3 p-4">
      <p className="font-bold">{existing ? "Your review" : "Rate this course"}</p>
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onClick={() => setRating(i)} aria-label={`${i} stars`} className="p-1">
            <Star className={`h-8 w-8 ${i <= rating ? "fill-gold text-gold" : "text-earth/20"}`} />
          </button>
        ))}
      </div>
      <textarea name="comment" defaultValue={existing?.comment} rows={3} className="input" placeholder="What did you like? What could be better?" />
      {state?.error && <p className="text-sm text-terracotta-dark">{state.error}</p>}
      {state?.ok && <p className="text-sm text-forest">Thanks! Your review is saved.</p>}
      {rating > 0 && <SubmitButton className="btn-dark">Save review</SubmitButton>}
    </form>
  );
}
