import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { CourseCover } from "@/components/course/CourseCover";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Course } from "@/lib/catalog/types";
import { formatCompact } from "@/lib/utils/format";

/** Clean, confident hero: big type on white, a mosaic of craft photos beside it. */
export function HomeHero({ featured, teacherCount, studentCount }: { featured: Course[]; teacherCount: number; studentCount: number }) {
  const [lead, ...rest] = featured;
  return (
    <Container as="section" className="pt-6 md:pt-12">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-saffron-tint px-3 py-1.5 text-caption font-semibold text-[#7A4F00]">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron" aria-hidden />
            {teacherCount} master teachers · {formatCompact(studentCount)}+ learners
          </p>
          <h1 className="mt-5 text-balance text-[2.75rem] font-bold leading-[1] tracking-[-0.045em] text-ink sm:text-[3.5rem] lg:text-[4.5rem]">
            Learn the craft.
            <br />
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-ember">Earn</span> from it.
          </h1>
          <p className="mt-5 max-w-lg text-pretty text-[1.0625rem] leading-relaxed text-ink-soft md:text-lg">
            Sewing, braiding, makeup, dance, drumming and beadwork, taught by Africa&apos;s best. Pay in your own currency and watch on your phone.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/courses" size="lg">
              Explore courses <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/teach" size="lg" variant="outline">
              Teach and keep 80%
            </Button>
          </div>
          <p className="mt-6 text-caption text-ink-soft">Pay with mobile money, card or bank transfer · 54 African currencies</p>
        </div>

        {lead && (
          <div className="relative">
            <div className="grid grid-cols-3 grid-rows-2 gap-3 md:gap-4">
              <Link href={`/courses/${lead.slug}`} prefetch={false} className="col-span-2 row-span-2 overflow-hidden rounded-[24px]" aria-label={lead.title}>
                <CourseCover id={lead.id} category={lead.category} cover={lead.cover} rounded={false} fill priority sizes="(min-width: 1024px) 30vw, 66vw" />
              </Link>
              {rest.slice(0, 2).map((c) => (
                <Link key={c.id} href={`/courses/${c.slug}`} prefetch={false} className="aspect-square overflow-hidden rounded-[20px]" aria-label={c.title}>
                  <CourseCover id={c.id} category={c.category} cover={c.cover} rounded={false} fill sizes="(min-width: 1024px) 15vw, 33vw" />
                </Link>
              ))}
            </div>
            <Link
              href={`/courses/${lead.slug}`}
              prefetch={false}
              className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-float ring-1 ring-black/5 transition hover:-translate-y-0.5 sm:right-auto sm:max-w-sm"
            >
              <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                <CourseCover id={lead.id} category={lead.category} cover={lead.cover} rounded={false} fill sizes="48px" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-body font-semibold">{lead.title}</span>
                <span className="flex items-center gap-1 text-caption text-ink-soft">
                  <Star className="h-3 w-3 fill-ink text-ink" aria-hidden /> {lead.rating} · {formatCompact(lead.students)} students
                </span>
              </span>
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
