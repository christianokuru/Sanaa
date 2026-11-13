import { CATEGORIES } from "@/config/categories";
import { Container } from "@/components/ui/Container";
import { CategoryBar } from "@/components/layout/CategoryBar";
import { CourseRow } from "@/components/course/CourseRow";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TeachBanner } from "@/components/home/TeachBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Scroller } from "@/components/ui/Scroller";
import { TeacherCard } from "@/components/teacher/TeacherCard";
import {
  getAllCourses, getCoursesByCategory, getCoursesByTeacher, getFreeCourses, getNewCourses, getPopularCourses, getTeachers,
} from "@/lib/catalog/repository";

export default function HomePage() {
  const popular = getPopularCourses(10);
  const teachers = getTeachers();
  const students = getAllCourses().reduce((s, c) => s + c.students, 0);

  return (
    <>
      <Container className="sticky top-[var(--header-h)] z-30 hidden border-b border-line bg-white pt-4 md:block">
        <CategoryBar active="all" />
      </Container>
      <Container className="pt-3 md:hidden">
        <CategoryBar active="all" />
      </Container>

      <HomeHero featured={popular.slice(0, 3)} teacherCount={teachers.length} studentCount={students} />

      <Container className="mt-20 space-y-14 md:mt-24 md:space-y-16">
        <CourseRow title="Popular right now" subtitle="What learners across Africa are taking this week" href="/courses?sort=popular" courses={popular} />
        <CourseRow title="Free to start" subtitle="Try a craft before you commit" href="/courses?price=free" courses={getFreeCourses()} />
        {CATEGORIES.slice(0, 3).map((c) => (
          <CourseRow key={c.slug} title={c.name} subtitle={c.description} href={`/categories/${c.slug}`} courses={getCoursesByCategory(c.slug)} />
        ))}
      </Container>

      <Container as="section" className="mt-14 md:mt-16">
        <SectionHeader title="Meet the masters" subtitle="Verified teachers with years behind the chair, the machine and the drum" className="mb-5" />
        <Scroller label="Teachers">
          {teachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} courseCount={getCoursesByTeacher(t.id).length} />
          ))}
        </Scroller>
      </Container>

      <HowItWorks />

      <Container className="mt-16 space-y-14 md:mt-24 md:space-y-16">
        {CATEGORIES.slice(3).map((c) => (
          <CourseRow key={c.slug} title={c.name} subtitle={c.description} href={`/categories/${c.slug}`} courses={getCoursesByCategory(c.slug)} />
        ))}
        <CourseRow title="New on Sanaa" href="/courses?sort=newest" courses={getNewCourses()} />
      </Container>

      <TeachBanner />
    </>
  );
}
