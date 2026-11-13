import Link from "next/link";
import { Users } from "lucide-react";
import { CourseThumb } from "@/components/CourseThumb";
import { Stars } from "@/components/Stars";
import { flagEmoji } from "@/lib/countries";
import type { CourseWithStats } from "@/lib/types";
import type { PriceView } from "@/lib/pricing";

export function CourseCard({ course, price }: { course: CourseWithStats; price: PriceView }) {
  const { stats } = course;
  return (
    <Link href={`/courses/${course.slug}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5">
      <CourseThumb url={course.thumbnail_url} category={course.category} title={course.title} />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold leading-snug group-hover:text-terracotta">{course.title}</h3>
        {course.teacher && (
          <p className="mt-1 text-sm text-earth-soft">
            {course.teacher.country && <span className="mr-1">{flagEmoji(course.teacher.country)}</span>}
            {course.teacher.full_name}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2 text-sm">
          {stats.rating_count > 0 ? (
            <>
              <span className="font-bold">{stats.rating_avg.toFixed(1)}</span>
              <Stars value={stats.rating_avg} size="h-3.5 w-3.5" />
              <span className="text-earth/50">({stats.rating_count.toLocaleString("en")})</span>
            </>
          ) : (
            <span className="chip bg-forest-light text-forest">New</span>
          )}
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <span className={`text-lg font-extrabold ${price.amount === 0 ? "text-forest" : ""}`}>{price.label}</span>
          {stats.student_count > 0 && (
            <span className="flex items-center gap-1 text-xs text-earth/50">
              <Users className="h-3.5 w-3.5" /> {stats.student_count.toLocaleString("en")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
