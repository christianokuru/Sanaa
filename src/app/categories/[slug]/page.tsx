import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/config/categories";
import { Container } from "@/components/ui/Container";
import { CategoryBar } from "@/components/layout/CategoryBar";
import { CourseGrid } from "@/components/course/CourseGrid";
import { CourseArt } from "@/components/brand/CourseArt";
import { CategoryIcon } from "@/components/brand/CategoryIcon";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCoursesByCategory } from "@/lib/catalog/repository";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { formatCompact } from "@/lib/utils/format";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategory(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} courses online`,
    description: `${category.description} Learn ${category.name.toLowerCase()} from African master teachers, in your own currency.`,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: { title: `${category.name} courses on Sanaa`, description: category.description },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  const courses = getCoursesByCategory(category.slug);
  const students = courses.reduce((s, c) => s + c.students, 0);

  return (
    <>
      <Container className="sticky top-[var(--header-h)] z-30 hidden border-b border-line bg-white pt-4 md:block">
        <CategoryBar active={category.slug} />
      </Container>
      <Container className="pt-3 md:hidden">
        <CategoryBar active={category.slug} />
      </Container>
      <Container className="pt-6 md:pt-10">
        <section className="relative grid overflow-hidden rounded-[28px] bg-canvas md:grid-cols-[1.2fr_1fr]">
          <div className="p-7 md:p-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-pill">
              <CategoryIcon slug={category.slug} className="h-7 w-7" />
            </span>
            <h1 className="mt-6 text-[2.25rem] font-bold leading-none tracking-[-0.04em] md:text-[3.25rem]">{category.name}</h1>
            <p className="mt-4 max-w-md text-ui leading-relaxed text-ink-soft">{category.description}</p>
            <p className="mt-6 text-body font-semibold">
              {courses.length} courses · {formatCompact(students)} learners
            </p>
            <Button href={`/courses?category=${category.slug}&price=free`} variant="outline" size="sm" className="mt-6">Show free courses</Button>
          </div>
          <div className="h-48 md:h-auto" aria-hidden>
            <CourseArt seed={`cat-${category.slug}`} palette={category.palette} variant={CATEGORIES.indexOf(category)} />
          </div>
        </section>
        <h2 className="mt-12 text-section font-semibold">All {category.name.toLowerCase()} courses</h2>
        <div className="mt-6">
          <CourseGrid courses={courses} />
        </div>
      </Container>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: category.name, path: `/categories/${category.slug}` }])} />
    </>
  );
}
