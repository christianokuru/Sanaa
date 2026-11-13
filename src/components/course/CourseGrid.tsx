import { CourseCard } from "@/components/course/CourseCard";
import { getTeacherById } from "@/lib/catalog/repository";
import type { Course } from "@/lib/catalog/types";

export function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {courses.map((c) => (
        <li key={c.id}>
          <CourseCard course={c} teacher={getTeacherById(c.teacherId)} />
        </li>
      ))}
    </ul>
  );
}
