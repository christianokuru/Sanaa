import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { CourseArt } from "@/components/brand/CourseArt";
import { TeacherAvatar } from "@/components/teacher/TeacherExtras";
import type { Teacher } from "@/lib/catalog/types";
import { findCountry } from "@/lib/locale/countries";

export function TeacherCard({ teacher, courseCount }: { teacher: Teacher; courseCount: number }) {
  const country = findCountry(teacher.country);
  return (
    <Link href={`/teachers/${teacher.slug}`} prefetch={false} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card">
        <CourseArt seed={teacher.id} palette={["#191D57", "#F4A51C", "#D93A16"]} variant={teacher.id.length} className="transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <TeacherAvatar teacherId={teacher.id} name={teacher.name} size="lg" className="ring-4 ring-white/90" />
          <p className="mt-3 flex items-center gap-1 text-ui font-semibold">
            {teacher.name}
            {teacher.verified && <BadgeCheck className="h-4 w-4 text-saffron" aria-label="Verified teacher" />}
          </p>
          <p className="text-body text-white/80">{teacher.title}</p>
        </div>
      </div>
      <p className="mt-2 text-body text-ink-soft">
        {teacher.city}, {country?.name} · {courseCount} course{courseCount === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
