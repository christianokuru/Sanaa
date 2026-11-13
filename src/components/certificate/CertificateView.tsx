"use client";

import { Award, Download } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { CourseArt } from "@/components/brand/CourseArt";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ShareButton } from "@/components/course/ShareButton";
import { getCourseById, getTeacherById } from "@/lib/catalog/repository";
import { getCategory } from "@/config/categories";
import { useAppStore } from "@/lib/store/app-store";
import { useHydrated } from "@/lib/hooks/use-store";
import { formatDate } from "@/lib/utils/format";

export function CertificateView({ id }: { id: string }) {
  const hydrated = useHydrated();
  const enrollment = useAppStore((s) => s.enrollments.find((e) => e.id === id));
  const student = useAppStore((s) => s.users.find((u) => u.id === enrollment?.userId));

  if (!hydrated) return <Skeleton className="mx-auto mt-10 aspect-[1.414] max-w-3xl" />;
  const course = enrollment ? getCourseById(enrollment.courseId) : undefined;
  if (!enrollment?.completedAt || !course || !student) {
    return (
      <EmptyState icon={Award} title="Certificate not found" action={<Button href="/my-learning" variant="dark">Go to My learning</Button>}>
        Certificates appear once every lesson in a course is complete.
      </EmptyState>
    );
  }
  const teacher = getTeacherById(course.teacherId);

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[20px] bg-white shadow-modal ring-1 ring-black/5 print:shadow-none">
        <div className="h-3 overflow-hidden" aria-hidden><CourseArt seed={course.id} palette={getCategory(course.category)!.palette} variant={0} className="h-40" /></div>
        <div className="px-6 py-12 text-center md:px-16 md:py-16">
          <LogoMark className="mx-auto h-12 w-12" />
          <p className="mt-6 text-caption font-semibold uppercase tracking-[0.3em] text-ember">Certificate of completion</p>
          <p className="mt-8 text-ui text-ink-soft">This certifies that</p>
          <p className="mt-2 font-serif text-[2.75rem] italic leading-tight md:text-[3.5rem]">{student.name}</p>
          <p className="mt-6 text-ui text-ink-soft">has successfully completed</p>
          <p className="mt-2 text-balance text-[1.5rem] font-bold tracking-[-0.02em] md:text-[1.75rem]">{course.title}</p>
          {teacher && <p className="mt-2 text-body text-ink-soft">taught by {teacher.name}, {teacher.title.toLowerCase()}</p>}
          <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-6 border-t border-line pt-6 text-body">
            <div><p className="text-caption text-ink-soft">Completed</p><p className="font-semibold">{formatDate(enrollment.completedAt, { day: "numeric", month: "long", year: "numeric" })}</p></div>
            <div><p className="text-caption text-ink-soft">Certificate ID</p><p className="font-mono text-caption font-semibold">{enrollment.id.toUpperCase()}</p></div>
          </div>
        </div>
        <div className="h-3 overflow-hidden" aria-hidden><CourseArt seed={course.id} palette={getCategory(course.category)!.palette} variant={0} className="h-40" /></div>
      </div>
      <div className="mt-8 flex justify-center gap-3 print:hidden">
        <Button variant="dark" onClick={() => window.print()}><Download className="h-4 w-4" /> Download PDF</Button>
        <ShareButton title={`My Sanaa certificate: ${course.title}`} path={`/certificates/${enrollment.id}`} className="border border-line-strong" />
      </div>
    </div>
  );
}
