import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, PlayCircle, Lock, Users, BarChart3 } from "lucide-react";
import { CourseThumb } from "@/components/CourseThumb";
import { Stars } from "@/components/Stars";
import { SubmitButton } from "@/components/SubmitButton";
import { ReviewForm } from "@/components/ReviewForm";
import { getCourseBySlug, getLessons, getReviews, isEnrolled, formatDuration } from "@/lib/data";
import { getPricer } from "@/lib/pricing";
import { getSessionUser } from "@/lib/auth";
import { chargeCurrency } from "@/lib/currency";
import { getViewerCurrency } from "@/lib/geo";
import { categoryName, hasSupabase } from "@/lib/config";
import { findCountry, flagEmoji } from "@/lib/countries";
import { startCheckout } from "@/lib/actions/checkout";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  return course ? { title: course.title, description: course.subtitle } : {};
}

export default async function CoursePage({
  params, searchParams,
}: { params: { slug: string }; searchParams: { error?: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  const [lessons, reviews, price, user] = await Promise.all([
    getLessons(course.id), getReviews(course.id), getPricer(), getSessionUser(),
  ]);
  const enrolled = await isEnrolled(course.id, user?.id);
  const p = price(course.price, course.currency);
  const viewerCurrency = getViewerCurrency();
  const chargedIn = chargeCurrency(viewerCurrency);
  const isOwner = user?.id === course.teacher_id;
  const teacherCountry = findCountry(course.teacher?.country);
  const myReview = user ? reviews.find((r) => r.student_id === user.id) : undefined;
  const totalSeconds = lessons.reduce((s, l) => s + (l.duration_seconds ?? 0), 0);

  const buyBox = (
    <div className="card p-5">
      <p className={`text-3xl font-extrabold ${p.amount === 0 ? "text-forest" : ""}`}>{p.label}</p>
      {p.converted && (
        <p className="mt-1 text-xs text-earth-soft">Teacher&apos;s price: {p.original}. Converted at today&apos;s rate.</p>
      )}
      {p.amount > 0 && chargedIn !== viewerCurrency && (
        <p className="mt-1 text-xs text-earth-soft">You will be charged in USD (card).</p>
      )}
      {searchParams.error && <p className="mt-3 rounded-xl bg-terracotta-light p-3 text-sm">{searchParams.error}</p>}
      <div className="mt-4">
        {enrolled || isOwner ? (
          <Link href={`/learn/${course.slug}`} className="btn-primary w-full">
            <PlayCircle className="h-5 w-5" /> {isOwner ? "Preview your course" : "Continue learning"}
          </Link>
        ) : course.status !== "published" ? (
          <p className="rounded-xl bg-sand p-3 text-sm">This course is not published yet.</p>
        ) : !hasSupabase ? (
          <Link href={`/learn/${course.slug}`} className="btn-primary w-full">Try the player (demo)</Link>
        ) : (
          <form action={startCheckout}>
            <input type="hidden" name="courseId" value={course.id} />
            <SubmitButton pendingText="Opening payment...">
              {p.amount === 0 ? "Enroll for free" : "Buy now"}
            </SubmitButton>
          </form>
        )}
      </div>
      {p.amount > 0 && !enrolled && (
        <p className="mt-3 text-center text-xs text-earth-soft">Pay with mobile money, card or bank transfer</p>
      )}
    </div>
  );

  return (
    <div className="pb-24 md:pb-0">
      <section className="bg-earth text-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[1fr_340px] md:py-10">
          <div>
            <Link href={`/courses?category=${course.category}`} className="chip bg-cream/10 text-gold">
              {categoryName(course.category)}
            </Link>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">{course.title}</h1>
            {course.subtitle && <p className="mt-2 text-lg text-cream/80">{course.subtitle}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-cream/80">
              {course.stats.rating_count > 0 && (
                <span className="flex items-center gap-1.5">
                  <b className="text-gold">{course.stats.rating_avg.toFixed(1)}</b>
                  <Stars value={course.stats.rating_avg} size="h-3.5 w-3.5" />
                  ({course.stats.rating_count.toLocaleString("en")})
                </span>
              )}
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.stats.student_count.toLocaleString("en")} students</span>
              <span className="flex items-center gap-1 capitalize"><BarChart3 className="h-4 w-4" /> {course.level}</span>
              {totalSeconds > 0 && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formatDuration(totalSeconds)}</span>}
            </div>
            {course.teacher && (
              <p className="mt-3 text-sm">
                Taught by <b>{course.teacher.full_name}</b>
                {teacherCountry && <> {flagEmoji(teacherCountry.code)} {teacherCountry.name}</>}
              </p>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl md:row-span-2">
            <CourseThumb url={course.thumbnail_url} category={course.category} title={course.title} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {course.status !== "published" && (
            <p className="rounded-xl bg-gold-light p-4 text-sm">
              Status: <b className="capitalize">{course.status}</b>. Only you and admins can see this page.
            </p>
          )}

          {course.what_you_learn.length > 0 && (
            <section className="card p-5">
              <h2 className="font-display text-xl font-bold">What you will learn</h2>
              <ul className="mt-3 space-y-2">
                {course.what_you_learn.map((item) => (
                  <li key={item} className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-forest" /> {item}</li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="font-display text-xl font-bold">Lessons ({lessons.length})</h2>
            <ol className="card mt-3 divide-y divide-earth/10">
              {lessons.map((l, i) => (
                <li key={l.id} className="flex min-h-[56px] items-center gap-3 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand text-sm font-bold">{i + 1}</span>
                  <span className="flex-1">{l.title}</span>
                  {l.is_preview && !enrolled ? (
                    <Link href={`/learn/${course.slug}?lesson=${l.id}`} className="chip bg-forest-light text-forest">Free preview</Link>
                  ) : enrolled || isOwner ? (
                    <PlayCircle className="h-5 w-5 text-terracotta" />
                  ) : (
                    <Lock className="h-4 w-4 text-earth/30" />
                  )}
                  {l.duration_seconds ? <span className="text-xs text-earth/50">{formatDuration(l.duration_seconds)}</span> : null}
                </li>
              ))}
              {lessons.length === 0 && <li className="p-4 text-sm text-earth-soft">No lessons yet.</li>}
            </ol>
          </section>

          {course.description && (
            <section>
              <h2 className="font-display text-xl font-bold">About this course</h2>
              <div className="mt-2 space-y-3 whitespace-pre-line text-earth-soft">{course.description}</div>
            </section>
          )}

          {course.teacher && (
            <section className="card p-5">
              <h2 className="font-display text-xl font-bold">Your teacher</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-lg font-bold text-white">
                  {course.teacher.full_name.charAt(0)}
                </span>
                <div>
                  <p className="font-bold">{course.teacher.full_name}</p>
                  {teacherCountry && <p className="text-sm text-earth-soft">{flagEmoji(teacherCountry.code)} {teacherCountry.name}</p>}
                </div>
              </div>
              {course.teacher.bio && <p className="mt-3 text-earth-soft">{course.teacher.bio}</p>}
            </section>
          )}

          <section>
            <h2 className="font-display text-xl font-bold">Reviews</h2>
            {enrolled && user && <ReviewForm courseId={course.id} existing={myReview} />}
            <ul className="mt-3 space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">
                      {r.student?.full_name || "Student"}{" "}
                      {r.student?.country && <span>{flagEmoji(r.student.country)}</span>}
                    </p>
                    <Stars value={r.rating} size="h-3.5 w-3.5" />
                  </div>
                  {r.comment && <p className="mt-2 text-earth-soft">{r.comment}</p>}
                </li>
              ))}
              {reviews.length === 0 && <li className="text-sm text-earth-soft">No reviews yet.</li>}
            </ul>
          </section>
        </div>

        <aside className="hidden md:block">
          <div className="sticky top-24">{buyBox}</div>
        </aside>
      </div>

      {/* Mobile: price and buy button stay at the bottom of the screen */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-earth/10 bg-white p-3 md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className={`text-xl font-extrabold ${p.amount === 0 ? "text-forest" : ""}`}>{p.label}</p>
            {p.converted && <p className="truncate text-[11px] text-earth-soft">Teacher&apos;s price {p.original}</p>}
          </div>
          <div className="flex-1">
            {enrolled || isOwner ? (
              <Link href={`/learn/${course.slug}`} className="btn-primary w-full">Continue</Link>
            ) : course.status !== "published" ? null : !hasSupabase ? (
              <Link href={`/learn/${course.slug}`} className="btn-primary w-full">Try (demo)</Link>
            ) : (
              <form action={startCheckout}>
                <input type="hidden" name="courseId" value={course.id} />
                <SubmitButton pendingText="Opening...">{p.amount === 0 ? "Enroll free" : "Buy now"}</SubmitButton>
              </form>
            )}
          </div>
        </div>
        {searchParams.error && <p className="mt-2 text-xs text-terracotta-dark">{searchParams.error}</p>}
      </div>
    </div>
  );
}
