import { CourseArt } from "@/components/brand/CourseArt";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function TeachBanner() {
  return (
    <Container as="section" className="mt-16 md:mt-24">
      <div className="relative grid overflow-hidden rounded-[28px] bg-ink text-white md:grid-cols-2">
        <div className="relative z-10 p-8 md:p-14">
          <p className="text-caption font-semibold uppercase tracking-[0.2em] text-saffron">For teachers</p>
          <h2 className="mt-4 text-balance text-[2rem] font-bold leading-[1.05] tracking-[-0.035em] md:text-[2.75rem]">
            Your skill is worth more than you charge.
          </h2>
          <p className="mt-4 max-w-md text-ui leading-relaxed text-white/70">
            Film your course on your phone, set your price in your own currency and keep 80% of every sale. We handle payments, hosting and promotion.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/teach" variant="white" size="lg">Start teaching</Button>
            <Button href="/teach/guide" size="lg" className="bg-white/10 text-white hover:bg-white/20">Read the filming guide</Button>
          </div>
        </div>
        <div className="relative h-56 md:h-auto" aria-hidden>
          <CourseArt seed="teach-banner" palette={["#D93A16", "#F4A51C", "#2747D8"]} variant={2} />
        </div>
      </div>
    </Container>
  );
}
