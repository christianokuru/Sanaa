import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Teacher } from "@/lib/catalog/types";
import { findCountry } from "@/lib/locale/countries";
import { formatCompact } from "@/lib/utils/format";

export function TeacherBlock({ teacher, rating, students, courses }: { teacher: Teacher; rating: number; students: number; courses: number }) {
  const country = findCountry(teacher.country);
  return (
    <section aria-labelledby="teacher-title">
      <h2 id="teacher-title" className="text-section font-semibold">Meet your teacher</h2>
      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-float ring-1 ring-black/5">
          <div className="grid grid-cols-[1fr_auto] items-center gap-6">
            <div className="text-center">
              <Avatar name={teacher.name} size="xl" className="mx-auto" />
              <p className="mt-3 flex items-center justify-center gap-1 text-title font-bold">
                {teacher.name}
                {teacher.verified && <BadgeCheck className="h-5 w-5 text-ember" aria-label="Verified" />}
              </p>
              <p className="text-body text-ink-soft">{teacher.title}</p>
            </div>
            <dl className="divide-y divide-line text-left">
              <div className="pb-3"><dt className="text-caption text-ink-soft">Students</dt><dd className="text-title font-bold">{formatCompact(students)}</dd></div>
              <div className="py-3"><dt className="text-caption text-ink-soft">Rating</dt><dd className="flex items-center gap-1 text-title font-bold">{rating.toFixed(1)}<Star className="h-3.5 w-3.5 fill-ink" aria-hidden /></dd></div>
              <div className="pt-3"><dt className="text-caption text-ink-soft">Years</dt><dd className="text-title font-bold">{teacher.yearsExperience}</dd></div>
            </dl>
          </div>
        </div>
        <div>
          <p className="text-body text-ink-soft">{teacher.city}, {country?.name} · {courses} course{courses === 1 ? "" : "s"} on Sanaa</p>
          <p className="mt-3 text-ui leading-relaxed">{teacher.bio}</p>
          <Button href={`/teachers/${teacher.slug}`} variant="dark" className="mt-6">View profile</Button>
          <p className="mt-6 max-w-sm text-caption text-ink-soft">
            To protect your payment, always pay through Sanaa. Never send money to a teacher directly. <Link href="/help#safety" className="underline">Learn more</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
