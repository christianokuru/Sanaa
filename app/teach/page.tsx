import Link from "next/link";
import { Camera, Upload, Wallet, CheckCircle2 } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { becomeTeacher } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { PLATFORM_FEE_RATE } from "@/lib/config";

export const metadata = { title: "Teach on Sanaa" };

export default async function TeachPage() {
  const user = await getSessionUser();
  const keep = Math.round((1 - PLATFORM_FEE_RATE) * 100);

  const cta = !user ? (
    <Link href="/signup?role=teacher" className="btn-primary w-full sm:w-auto">Create a teacher account</Link>
  ) : user.profile.role === "student" ? (
    <form action={becomeTeacher}><SubmitButton className="btn-primary w-full sm:w-auto">Start teaching</SubmitButton></form>
  ) : (
    <Link href="/teach/dashboard" className="btn-primary w-full sm:w-auto">Go to your dashboard</Link>
  );

  return (
    <>
      <section className="mudcloth text-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h1 className="max-w-xl font-display text-4xl font-extrabold leading-tight md:text-5xl">
            Teach your craft. <span className="text-gold">Keep {keep}%.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-cream/80">
            Tailors, braiders, makeup artists, dancers and drummers: film your skill on your phone and sell it to learners across Africa and abroad.
          </p>
          <div className="mt-8">{cta}</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10">
        <h2 className="font-display text-2xl font-bold">How it works</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            { icon: Camera, title: "Film", text: "Record short lessons on your phone. Our guide shows you how." },
            { icon: Upload, title: "Upload", text: "Upload from your phone, set your price in your own currency." },
            { icon: CheckCircle2, title: "Get approved", text: "We check every course so learners trust Sanaa." },
            { icon: Wallet, title: "Get paid", text: `You keep ${keep}% of every sale, paid to mobile money or bank.` },
          ].map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="card p-5">
              <p className="text-sm font-bold text-terracotta">Step {i + 1}</p>
              <Icon className="mt-2 h-7 w-7" />
              <p className="mt-2 font-bold">{title}</p>
              <p className="mt-1 text-sm text-earth-soft">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold">Example</h2>
          <p className="mt-2 text-earth-soft">
            Your course costs ₦15,000 and 40 students buy it. That&apos;s ₦600,000 in sales.
            You get <b className="text-forest">₦{(600000 * (1 - PLATFORM_FEE_RATE)).toLocaleString("en")}</b>. Sanaa keeps {100 - keep}% for payments, video hosting and promotion.
          </p>
          <Link href="/teach/guide" className="mt-4 inline-block font-semibold text-terracotta">Read the filming guide →</Link>
        </div>
      </section>
    </>
  );
}
