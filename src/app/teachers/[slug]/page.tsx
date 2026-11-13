import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CourseGrid } from "@/components/course/CourseGrid";
import { ReviewCard } from "@/components/course/ReviewCard";
import { TeacherAvatar, TeacherBio, TeacherSocials, TeacherTestimonials } from "@/components/teacher/TeacherExtras";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCoursesByTeacher, getTeacherBySlug, getTeacherReviews, getTeachers } from "@/lib/catalog/repository";
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
  const first = teacher.name.split(" ")[0]!;
  const courses = getCoursesByTeacher(teacher.id);
  const students = courses.reduce((s, c) => s + c.students, 0);
  const reviews = courses.reduce((s, c) => s + c.ratingCount, 0);
  const rating = courses.reduce((s, c) => s + c.rating * c.ratingCount, 0) / Math.max(1, reviews);
  const learnerReviews = getTeacherReviews(teacher.id, 6);

  return (
    <Container className="pt-8 md:pt-12">
      <div className="grid gap-10 md:grid-cols-[340px_1fr] md:gap-16">
        <aside>
          <div className="rounded-3xl p-8 text-center shadow-float ring-1 ring-black/5 md:sticky md:top-[calc(var(--header-h)+32px)]">
            <TeacherAvatar teacherId={teacher.id} name={teacher.name} size="2xl" className="mx-auto" />
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
            <TeacherSocials teacherId={teacher.id} className="mt-6 justify-center" />
          </div>
        </aside>
        <div>
          <h2 className="text-section font-semibold">About {first}</h2>
          <p className="mt-2 flex items-center gap-1.5 text-body text-ink-soft"><MapPin className="h-4 w-4" />{teacher.city}, {findCountry(teacher.country)?.name} · {teacher.yearsExperience} years of experience</p>
          <TeacherBio teacherId={teacher.id} fallback={teacher.bio} className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed" />

          <h2 className="mt-12 text-section font-semibold">Courses by {first}</h2>
          <div className="mt-6"><CourseGrid courses={courses} /></div>

          {learnerReviews.length > 0 && (
            <section aria-labelledby="learner-reviews" className="mt-14">
              <h2 id="learner-reviews" className="flex items-center gap-2 text-section font-semibold">
                <Star className="h-5 w-5 fill-ink" aria-hidden />
                {rating.toFixed(1)} · What learners say
              </h2>
              <p className="mt-1 text-body text-ink-soft">From people who bought {first}&rsquo;s courses on Sanaa.</p>
              <ul className="mt-6 grid gap-x-16 gap-y-10 md:grid-cols-2">
                {learnerReviews.map((r) => (
                  <li key={r.id}>
                    <ReviewCard {...r} />
                    <Link href={`/courses/${r.courseSlug}`} prefetch={false} className="mt-2 inline-block text-caption font-semibold text-ink-soft underline underline-offset-2 hover:text-ink">
                      {r.courseTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div id="client-reviews" className="scroll-mt-[calc(var(--header-h)+16px)]">
            <TeacherTestimonials teacherId={teacher.id} firstName={first} large />
          </div>
        </div>
      </div>
      <JsonLd data={personJsonLd(teacher)} />
    </Container>
  );
}
