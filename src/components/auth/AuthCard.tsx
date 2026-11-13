import { Container } from "@/components/ui/Container";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Container className="flex justify-center pt-6 md:pt-14">
      <div className="w-full max-w-[568px] md:rounded-3xl md:border md:border-line md:shadow-float">
        <div className="border-b border-line py-4 text-center text-ui font-semibold">{title}</div>
        <div className="py-6 md:px-8 md:py-8">
          {subtitle && <h1 className="mb-6 text-section font-semibold">{subtitle}</h1>}
          {children}
        </div>
      </div>
    </Container>
  );
}
