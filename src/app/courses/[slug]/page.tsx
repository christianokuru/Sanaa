import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Award, Check, Clock, Infinity as InfinityIcon, Smartphone, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { Rating } from "@/components/ui/Rating";
import { CourseCover } from "@/components/course/CourseCover";
import { CourseMobileTop } from "@/components/course/CourseMobileTop";
import { Curriculum } from "@/components/course/Curriculum";
import { PurchaseBar, PurchaseCard } from "@/components/course/PurchaseActions";
import { ReviewsSection } from "@/components/course/ReviewsSection";
import { ShareButton } from "@/components/course/ShareButton";
import { TeacherBlock } from "@/components/course/TeacherBlock";
import { WishlistButton } from "@/components/course/WishlistButton";
import { CourseRow } from "@/components/course/CourseRow";
import { CategoryIcon } from "@/components/brand/CategoryIcon";
import { Avatar } from "@/components/ui/Avatar";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategory } from "@/config/categories";
import {
  courseDuration, courseLessons, getAllCourses, getCourseBySlug, getCoursesByTeacher, getRelatedCourses, getReviews, getTeacherById,
} from "@/lib/catalog/repository";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { formatDuration, formatNumber } from "@/lib/utils/format";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const course = getCourseBySlug(params.slug);
  if (!course) return {};
  const teacher = getTeacherById(course.teacherId);
  return {
    title: course.title,
    description: `${course.subtitle}. ${teacher ? `Taught by ${teacher.name}, ${teacher.title.toLowerCase()}.` : ""} ${course.ratingCount} reviews, ${formatNumber(course.students)} students.`,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { type: "article", title: course.title, description: course.subtitle },
  };
}

const LEVEL_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as const;
const BADGE_LABEL = { bestseller: "Bestseller", "top-rated": "Top rated", new: "New" } as const;

export default function CoursePage({ params }: Props) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();
  const teacher = getTeacherById(course.teacherId);
  const category = getCategory(course.category)!;
  const reviews = getReviews(course.id);
  const lessons = courseLessons(course);
  const preview = lessons.find((l) => l.preview);
  const teacherCourses = teacher ? getCoursesByTeacher(teacher.id) : [];
  const purchase = { courseId: course.id, slug: course.slug, price: course.price, currency: course.currency, previewLessonId: preview?.id };
  const path = `/courses/${course.slug}`;

  const highlights = [
    { icon: Smartphone, title: "Filmed for your phone", text: "Close-up, short lessons with a data saver mode." },
    { icon: InfinityIcon, title: "Yours for life", text: "Watch again whenever you need, at your own pace." },
    { icon: Award, title: "Certificate included", text: "Finish every lesson to earn a certificate customers can verify." },
  ];

  return (
    <>
      <article className="pb-28 md:pb-0">
        {/* Phone: full-bleed cover with floating controls */}
        <div className="relative md:hidden">
          <div className="aspect-[4/3]"><CourseCover id={course.id} category={course.category} coverUrl={course.coverUrl} rounded={false} fill /></div>
          <CourseMobileTop courseId={course.id} title={course.title} path={path} />
        </div>

        <Container className="relative -mt-6 rounded-t-[28px] bg-white pt-8 md:mt-0 md:rounded-none md:pt-8">
          <header className="text-center md:text-left">
            <h1 className="text-balance text-[1.75rem] font-bold leading-tight tracking-[-0.03em] md:text-[2rem]">{course.title}</h1>
            <div className="mt-3 hidden items-center justify-between md:flex">
              <p className="flex items-center gap-2 text-body">
                <Rating value={course.rating} className="font-semibold" /> ·
                <a href="#reviews" className="font-semibold underline underline-offset-2">{formatNumber(course.ratingCount)} reviews</a> ·
                <span className="text-ink-soft">{category.name}</span>
              </p>
              <div className="flex">
                <ShareButton title={course.title} path={path} />
                <WishlistButton courseId={course.id} title={course.title} variant="inline" />
              </div>
            </div>
          </header>

          {/* Desktop: wide cover */}
          <div className="mt-6 hidden h-[clamp(320px,34vw,460px)] overflow-hidden rounded-[20px] md:grid md:grid-cols-[2fr_1fr] md:grid-rows-2 md:gap-2">
            <CourseCover id={course.id} category={course.category} coverUrl={course.coverUrl} rounded={false} fill className="row-span-2" />
            <CourseCover id={`${course.id}-b`} category={course.category} rounded={false} fill />
            <CourseCover id={`${course.id}-c`} category={course.category} rounded={false} fill />
          </div>

          <div className="mt-8 grid gap-16 md:grid-cols-[1fr_360px] lg:gap-24">
            <div className="min-w-0">
              <div className="text-center md:text-left">
                <p className="text-title font-semibold">{course.subtitle}</p>
                <p className="mt-1 text-ui text-ink-soft">
                  {LEVEL_LABEL[course.level]} · {lessons.length} lessons · {formatDuration(courseDuration(course))} · {course.language}
                </p>
              </div>

              {/* Rating summary */}
              <div className="mt-6 grid grid-cols-3 items-center rounded-2xl border border-line py-4 text-center">
                <div>
                  <p className="text-title font-bold">{course.rating.toFixed(1)}</p>
                  <p className="text-caption text-ink-soft">rating</p>
                </div>
                <div className="border-x border-line px-2">
                  <p className="flex items-center justify-center gap-1 text-body font-bold">
                    <CategoryIcon slug={course.category} className="h-5 w-5" />
                    {course.badge ? BADGE_LABEL[course.badge] : LEVEL_LABEL[course.level]}
                  </p>
                  <p className="text-caption text-ink-soft">{course.badge ? category.short : "Level"}</p>
                </div>
                <div>
                  <p className="flex items-center justify-center gap-1 text-title font-bold"><Users className="h-4 w-4" />{formatNumber(course.students)}</p>
                  <p className="text-caption text-ink-soft">students</p>
                </div>
              </div>

              {teacher && (
                <>
                  <a href="#teacher-title" className="mt-6 flex items-center gap-4 py-2">
                    <Avatar name={teacher.name} size="lg" />
                    <span>
                      <span className="block text-ui font-semibold">Taught by {teacher.name}</span>
                      <span className="block text-body text-ink-soft">{teacher.title} · {teacher.yearsExperience} years</span>
                    </span>
                  </a>
                  <Divider className="mt-6" />
                </>
              )}

              <ul className="space-y-6 py-8">
                {highlights.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-5">
                    <Icon className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={1.5} />
                    <span>
                      <span className="block text-ui font-semibold">{title}</span>
                      <span className="block text-body text-ink-soft">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Divider />

              <section className="py-8" aria-labelledby="about-title">
                <h2 id="about-title" className="sr-only">About this course</h2>
                <ExpandableText text={course.description} />
              </section>
              <Divider />

              <section className="py-8" aria-labelledby="learn-title">
                <h2 id="learn-title" className="text-section font-semibold">What you&apos;ll learn</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-ui"><Check className="mt-0.5 h-5 w-5 shrink-0 text-malachite" strokeWidth={2.5} />{o}</li>
                  ))}
                </ul>
              </section>
              <Divider />

              <section className="py-8" aria-labelledby="curriculum-title">
                <div className="flex items-end justify-between">
                  <h2 id="curriculum-title" className="text-section font-semibold">Course content</h2>
                  <p className="flex items-center gap-1 text-body text-ink-soft"><Clock className="h-4 w-4" />{formatDuration(courseDuration(course))}</p>
                </div>
                <div className="mt-6"><Curriculum course={course} /></div>
              </section>
              <Divider />

              <section className="py-8" aria-labelledby="needs-title">
                <h2 id="needs-title" className="text-section font-semibold">What you need</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-ui">
                  {course.requirements.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </section>
            </div>

            <aside className="hidden md:block">
              <div className="sticky top-[calc(var(--header-h)+32px)]">
                <PurchaseCard {...purchase} />
              </div>
            </aside>
          </div>

          <Divider />
          <div className="py-10"><ReviewsSection course={course} reviews={reviews} /></div>
          {teacher && (
            <>
              <Divider />
              <div className="py-10">
                <TeacherBlock
                  teacher={teacher}
                  rating={teacherCourses.reduce((s, c) => s + c.rating, 0) / Math.max(1, teacherCourses.length)}
                  students={teacherCourses.reduce((s, c) => s + c.students, 0)}
                  courses={teacherCourses.length}
                />
              </div>
            </>
          )}
          <Divider />
          <div className="py-10">
            <CourseRow title="You might also like" courses={getRelatedCourses(course, 8)} />
          </div>
        </Container>
      </article>

      <PurchaseBar {...purchase} />
      <JsonLd
        data={[
          courseJsonLd(course, teacher, reviews),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: category.name, path: `/categories/${category.slug}` },
            { name: course.title, path: `/courses/${course.slug}` },
          ]),
        ]}
      />
    </>
  );
}
