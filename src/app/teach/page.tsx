import { Camera, CheckCircle2, Upload, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CourseArt } from "@/components/brand/CourseArt";
import { EarningsCalculator } from "@/components/teach/EarningsCalculator";
import { TeachCta } from "@/components/teach/TeachCta";

export const metadata = {
  title: "Teach on Sanaa: keep 80% of every sale",
  description: "Film your craft on your phone, set your price in your own currency and keep 80% of every sale. Paid to mobile money or bank.",
  alternates: { canonical: "/teach" },
};

const STEPS = [
  { icon: Camera, title: "Film on your phone", text: "Short lessons, close up. Our filming guide shows you how." },
  { icon: Upload, title: "Upload and set your price", text: "In your own currency. Learners see it in theirs." },
  { icon: CheckCircle2, title: "Get approved", text: "We review every course within two days so learners trust what they buy." },
  { icon: Wallet, title: "Get paid", text: "Keep 80% of every sale, sent to mobile money or your bank." },
];

export default function TeachPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-25" aria-hidden><CourseArt seed="teach-hero" palette={["#D93A16", "#F4A51C", "#2747D8"]} variant={4} /></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 to-ink/40" aria-hidden />
        <Container className="relative grid items-center gap-12 py-14 md:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.2em] text-saffron">Teach on Sanaa</p>
            <h1 className="mt-4 text-balance text-[2.75rem] font-bold leading-[1] tracking-[-0.045em] md:text-[4.25rem]">
              Teach your craft. <span className="font-serif font-normal italic text-saffron">Keep 80%.</span>
            </h1>
            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-white/75">
              Tailors, braiders, makeup artists, dancers and drummers: turn what you know into income that keeps coming, from learners across Africa and abroad.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TeachCta />
              <Button href="/teach/guide" size="lg" className="bg-white/10 text-white hover:bg-white/20">Read the filming guide</Button>
            </div>
          </div>
          <EarningsCalculator />
        </Container>
      </section>

      <Container as="section" className="mt-16 md:mt-24">
        <SectionHeader title="How it works" subtitle="From your phone to paying students in four steps." className="mb-6" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="rounded-card bg-canvas p-6">
              <span className="text-caption font-semibold text-ink-soft">Step {i + 1}</span>
              <Icon className="mt-6 h-8 w-8" strokeWidth={1.5} />
              <h3 className="mt-4 text-title font-semibold">{title}</h3>
              <p className="mt-2 text-body leading-relaxed text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Container as="section" className="mt-16 md:mt-24">
        <div className="grid gap-10 rounded-[28px] border border-line p-8 md:grid-cols-3 md:p-12">
          {[
            ["80%", "of every sale is yours"],
            ["54", "African currencies supported"],
            ["48h", "average course review time"],
          ].map(([big, small]) => (
            <div key={big}>
              <p className="text-[3rem] font-bold leading-none tracking-[-0.05em]">{big}</p>
              <p className="mt-2 text-ui text-ink-soft">{small}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
