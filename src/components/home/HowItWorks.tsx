import { PlayCircle, Smartphone, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const STEPS = [
  { icon: Wallet, title: "Pay your way", text: "Mobile money, card or bank transfer. Every price shows in your own currency, with no surprise fees." },
  { icon: Smartphone, title: "Learn on your phone", text: "Short, close-up lessons filmed for small screens. Data saver mode when bundles run low." },
  { icon: PlayCircle, title: "Own it for life", text: "Watch again whenever you need. Finish the course and get a certificate customers can check." },
];

export function HowItWorks() {
  return (
    <Container as="section" className="mt-16 md:mt-24">
      <SectionHeader title="Made for how Africa learns" subtitle="Everything you need, nothing you don't." className="mb-6" />
      <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="rounded-card bg-canvas p-6">
            <div className="flex items-center justify-between">
              <Icon className="h-8 w-8 text-ink" strokeWidth={1.5} />
              <span className="text-caption font-semibold text-ink-soft">0{i + 1}</span>
            </div>
            <h3 className="mt-8 text-title font-semibold">{title}</h3>
            <p className="mt-2 text-body leading-relaxed text-ink-soft">{text}</p>
          </li>
        ))}
      </ol>
    </Container>
  );
}
