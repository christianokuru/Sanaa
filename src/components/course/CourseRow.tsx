import { CourseCard } from "@/components/course/CourseCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Scroller } from "@/components/ui/Scroller";
import { getTeacherById } from "@/lib/catalog/repository";
import type { Course } from "@/lib/catalog/types";

export function CourseRow({ title, subtitle, href, courses }: { title: string; subtitle?: string; href?: string; courses: Course[] }) {
  if (courses.length === 0) return null;
  return (
    <section aria-label={title}>
      <SectionHeader title={title} subtitle={subtitle} href={href} className="mb-5" />
      <Scroller label={title}>
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} teacher={getTeacherById(c.teacherId)} />
        ))}
      </Scroller>
    </section>
  );
}
