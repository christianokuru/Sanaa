import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Avatar } from "@/components/ui/Avatar";
import { CourseGrid } from "@/components/course/CourseGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCoursesByTeacher, getTeacherBySlug, getTeachers } from "@/lib/catalog/repository";
import { findCountry } from "@/lib/locale/countries";
import { personJsonLd } from "@/lib/seo/json-ld";
import { formatCompact, formatNumber } from "@/lib/utils/format";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getTeachers().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const t = getTeacherBySlug(params.slug);
  if (!t) return {};
  return { title: `${t.name}, ${t.title}`, description: t.bio, alternates: { canonical: `/teachers/${t.slug}` } };
}

export default function TeacherPage({ params }: Props) {
  const teacher = getTeacherBySlug(params.slug);
  if (!teacher) notFound();
  const courses = getCoursesByTeacher(teacher.id);
  const students = courses.reduce((s, c) => s + c.students, 0);
  const reviews = courses.reduce((s, c) => s + c.ratingCount, 0);
  const rating = courses.reduce((s, c) => s + c.rating * c.ratingCount, 0) / Math.max(1, reviews);

  return (
    <Container className="pt-8 md:pt-12">
      <div className="grid gap-10 md:grid-cols-[340px_1fr] md:gap-16">
        <aside>
          <div className="rounded-3xl p-8 text-center shadow-float ring-1 ring-black/5">
            <Avatar name={teacher.name} size="xl" className="mx-auto" />
            <h1 className="mt-4 flex items-center justify-center gap-1.5 text-[1.75rem] font-bold tracking-[-0.03em]">
              {teacher.name}
              {teacher.verified && <BadgeCheck className="h-6 w-6 text-ember" aria-label="Verified teacher" />}
            </h1>
            <p className="text-ui text-ink-soft">{teacher.title}</p>
            <dl className="mt-6 grid grid-cols-3 divide-x divide-line">
              <div><dt className="text-caption text-ink-soft">Students</dt><dd className="text-title font-bold">{formatCompact(students)}</dd></div>
              <div><dt className="text-caption text-ink-soft">Reviews</dt><dd className="text-title font-bold">{formatNumber(reviews)}</dd></div>
              <div><dt className="text-caption text-ink-soft">Rating</dt><dd className="flex items-center justify-center gap-1 text-title font-bold">{rating.toFixed(1)}<Star className="h-3.5 w-3.5 fill-ink" aria-hidden /></dd></div>
            </dl>
          </div>
        </aside>
        <div>
          <h2 className="text-section font-semibold">About {teacher.name.split(" ")[0]}</h2>
          <p className="mt-2 flex items-center gap-1.5 text-body text-ink-soft"><MapPin className="h-4 w-4" />{teacher.city}, {findCountry(teacher.country)?.name} · {teacher.yearsExperience} years of experience</p>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed">{teacher.bio}</p>
          <h2 className="mt-12 text-section font-semibold">Courses by {teacher.name.split(" ")[0]}</h2>
          <div className="mt-6"><CourseGrid courses={courses} /></div>
        </div>
      </div>
      <JsonLd data={personJsonLd(teacher)} />
    </Container>
  );
}
