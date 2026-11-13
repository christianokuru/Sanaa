import { Container } from "@/components/ui/Container";

/** Simple, readable layout for long-form pages (terms, privacy, about). */
export function ProsePage({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <Container className="pt-10 md:pt-16">
      <div className="mx-auto max-w-2xl">
        {eyebrow && <p className="text-caption font-semibold uppercase tracking-[0.2em] text-ember">{eyebrow}</p>}
        <h1 className="mt-3 text-balance text-[2.25rem] font-bold leading-[1.05] tracking-[-0.04em] md:text-[3rem]">{title}</h1>
        {intro && <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">{intro}</p>}
        <div className="mt-10 space-y-8 text-ui leading-relaxed [&_h2]:mb-3 [&_h2]:text-title [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_p+p]:mt-3 [&_ul]:space-y-2">
          {children}
        </div>
      </div>
    </Container>
  );
}
