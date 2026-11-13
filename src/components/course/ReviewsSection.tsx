import { Star } from "lucide-react";
import { ReviewCard } from "@/components/course/ReviewCard";
import { MyReview } from "@/components/course/ReviewForm";
import type { Course, Review } from "@/lib/catalog/types";
import { formatNumber } from "@/lib/utils/format";

export function ReviewsSection({ course, reviews }: { course: Course; reviews: Review[] }) {
  return (
    <section id="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="flex items-center gap-2 text-section font-semibold">
        <Star className="h-5 w-5 fill-ink" aria-hidden />
        {course.rating.toFixed(1)} · {formatNumber(course.ratingCount)} reviews
      </h2>
      <div className="mt-6">
        <MyReview courseId={course.id} />
      </div>
      <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
        {reviews.map((r) => (
          <ReviewCard key={r.id} {...r} />
        ))}
      </div>
    </section>
  );
}
