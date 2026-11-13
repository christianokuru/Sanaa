import Link from "next/link";
import { ArrowRight, Smartphone, Wallet, Wifi, BadgeCheck } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { CATEGORIES } from "@/lib/config";
import { getPublishedCourses } from "@/lib/data";
import { getPricer } from "@/lib/pricing";
import { getViewerCountry } from "@/lib/geo";
import { flagEmoji } from "@/lib/countries";

export default async function HomePage() {
  const [courses, price] = await Promise.all([getPublishedCourses({ limit: 6 }), getPricer()]);
  const country = getViewerCountry();

  return (
    <>
      {/* Hero */}
      <section className="mudcloth text-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          {country && (
            <p className="chip mb-4 bg-cream/10 text-cream">
              {flagEmoji(country.code)} Prices in {country.currency} for {country.name}
            </p>
          )}
          <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
            Learn the craft. <span className="text-gold">Earn from it.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-cream/80">
            Sewing, braiding, makeup, dance and drumming. Video courses taught by African teachers, made to watch on your phone.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses" className="btn-primary">
              Browse courses <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/teach" className="btn border-2 border-cream/30 text-cream hover:bg-cream/10">
              Teach and earn 80%
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <h2 className="font-display text-2xl font-bold">What do you want to learn?</h2>
        <div className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              href={`/courses?category=${c.slug}`}
              className={`min-w-[75%] snap-start rounded-2xl p-5 text-white sm:min-w-[45%] md:min-w-0 ${
                ["bg-terracotta", "bg-forest", "bg-earth"][i]
              }`}
            >
              <p className="font-display text-xl font-bold">{c.name}</p>
              <p className="mt-1 text-sm text-white/80">{c.blurb}</p>
              <p className="mt-6 flex items-center gap-1 text-sm font-semibold">
                See courses <ArrowRight className="h-4 w-4" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular courses */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">Popular right now</h2>
          <Link href="/courses" className="text-sm font-semibold text-terracotta">See all</Link>
        </div>
        {courses.length === 0 ? (
          <p className="card mt-4 p-6 text-earth-soft">No courses yet. The first teachers are filming now.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} price={price(c.price, c.currency)} />
            ))}
          </div>
        )}
      </section>

      {/* Why Sanaa */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <h2 className="font-display text-2xl font-bold">Made for Africa</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Wallet, title: "Pay your way", text: "Mobile money, card or bank transfer, in your own currency." },
            { icon: Wifi, title: "Data saver", text: "Watch in lower quality to save data when you need to." },
            { icon: Smartphone, title: "Phone first", text: "Every course is filmed and built to watch on a phone." },
            { icon: BadgeCheck, title: "Certificates", text: "Finish a course and get a certificate to show customers." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5">
              <Icon className="h-7 w-7 text-terracotta" />
              <p className="mt-3 font-bold">{title}</p>
              <p className="mt-1 text-sm text-earth-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Teach CTA */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="overflow-hidden rounded-3xl bg-gold-light">
          <div className="kente h-2" />
          <div className="p-6 md:p-10">
            <h2 className="font-display text-3xl font-bold">Got a skill? Teach it.</h2>
            <p className="mt-2 max-w-lg text-earth-soft">
              Film your course on your phone, set your price and keep 80% of every sale. We handle payments in every country.
            </p>
            <Link href="/teach" className="btn-dark mt-6">Start teaching</Link>
          </div>
        </div>
      </section>
    </>
  );
}
