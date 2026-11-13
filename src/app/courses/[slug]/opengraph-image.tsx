import { OG_SIZE, renderOgImage } from "@/lib/seo/og";
import { getAllCourses, getCourseBySlug, getTeacherById } from "@/lib/catalog/repository";
import { getCategory } from "@/config/categories";

export const alt = "Course on Sanaa";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) return renderOgImage({ eyebrow: "Sanaa", title: "Learn the craft.", footer: "sanaa.africa" });
  const teacher = getTeacherById(course.teacherId);
  return renderOgImage({
    eyebrow: getCategory(course.category)?.name ?? "Course",
    title: course.title,
    footer: `${teacher ? `with ${teacher.name} · ` : ""}Rated ${course.rating} · ${course.students.toLocaleString("en")} students`,
  });
}
