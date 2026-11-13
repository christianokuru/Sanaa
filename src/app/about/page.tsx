import { ProsePage } from "@/components/content/Prose";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "About Sanaa", description: "Sanaa means art in Swahili. We help African craftspeople teach their skills and earn from them.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <ProsePage eyebrow="About us" title="Sanaa means art." intro="It's the Swahili word for craft and skill. We built Sanaa so the best tailors, braiders, makeup artists, dancers and drummers in Africa can teach what they know, and get paid fairly for it.">
      <section>
        <h2>Why we exist</h2>
        <p>Africa is full of masters whose skills are passed on by hand, one apprentice at a time. Online learning platforms were built for other markets: priced in dollars, paid by card, filmed for laptops.</p>
        <p>Sanaa is built for us. Prices show in your own currency. You pay with mobile money. Lessons are filmed close up for phones, with a data saver for when bundles run low.</p>
      </section>
      <section>
        <h2>A fair deal for teachers</h2>
        <p>Teachers keep 80% of every sale. We use the other 20% to run payments, host videos and bring new students to their courses.</p>
      </section>
      <section>
        <h2>Quality you can trust</h2>
        <p>Every course is reviewed before it goes live. Learners rate every course, and certificates can be checked by anyone with the link.</p>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/courses">Explore courses</Button>
        <Button href="/teach" variant="outline">Teach on Sanaa</Button>
      </div>
    </ProsePage>
  );
}
