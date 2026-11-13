import Link from "next/link";
import { CourseCover } from "@/components/course/CourseCover";
import { WishlistButton } from "@/components/course/WishlistButton";
import { PriceTag } from "@/components/locale/PriceTag";
import { Rating } from "@/components/ui/Rating";
import type { Course, Teacher } from "@/lib/catalog/types";
import { findCountry } from "@/lib/locale/countries";
import { courseLessons } from "@/lib/catalog/repository";

/**
 * Listing card: no border, no shadow, image-first, like a premium marketplace.
 * Works in server and client components.
 */
export function CourseCard({ course, teacher }: { course: Course; teacher?: Teacher }) {
  const country = teacher ? findCountry(teacher.country) : undefined;
  const lessons = courseLessons(course).length;
  return (
    <article className="group relative">
      <Link href={`/courses/${course.slug}`} className="block rounded-card focus-visible:ring-offset-4" prefetch={false}>
        <CourseCover id={course.id} category={course.category} cover={course.cover} badge={course.badge} />
        <div className="mt-3 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-ui font-semibold leading-snug text-ink">{course.title}</h3>
          {course.ratingCount > 0 && <Rating value={course.rating} className="mt-0.5 shrink-0" />}
        </div>
        <p className="mt-1 truncate text-body text-ink-soft">
          {teacher?.name}
          {country && <> · {country.name}</>}
        </p>
        <p className="mt-1.5 text-body text-ink">
          <PriceTag price={course.price} currency={course.currency} className="font-semibold" />
          <span className="text-ink-soft"> · {lessons} lessons</span>
        </p>
      </Link>
      <WishlistButton courseId={course.id} title={course.title} className="absolute right-1 top-1" />
    </article>
  );
}
