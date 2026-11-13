import { cn } from "@/lib/utils/cn";

type Tone = "white" | "ink" | "ember" | "saffron" | "malachite" | "cobalt" | "canvas";
const TONES: Record<Tone, string> = {
  white: "bg-white text-ink shadow-pill",
  ink: "bg-ink text-white",
  ember: "bg-ember-tint text-ember",
  saffron: "bg-saffron-tint text-[#8A5A00]",
  malachite: "bg-malachite-tint text-malachite",
  cobalt: "bg-cobalt-tint text-cobalt",
  canvas: "bg-canvas text-ink",
};

export function Badge({ tone = "canvas", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption font-semibold", TONES[tone], className)}>
      {children}
    </span>
  );
}
