import { ProsePage } from "@/components/content/Prose";

export const metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <ProsePage eyebrow="Legal" title="Terms of Service" intro="Last updated 1 November 2026. Please read these terms before using Sanaa. This is a template and should be reviewed by a lawyer before launch.">
      <section><h2>1. Using Sanaa</h2><p>You must be at least 16, or have a parent's permission, to create an account. Keep your password safe; you're responsible for activity on your account.</p></section>
      <section><h2>2. Buying courses</h2><p>When you buy a course you get a personal licence to watch it for as long as Sanaa offers it. You may not share, download, record or resell course videos.</p></section>
      <section><h2>3. Refunds</h2><p>If a course is materially different from its description, request a refund within 14 days of purchase and before completing half of it.</p></section>
      <section><h2>4. Teaching</h2><p>Teachers must own the rights to everything in their courses. Teachers receive 80% of the net price of each sale. Sanaa may remove courses that break these terms or our quality standards.</p></section>
      <section><h2>5. Conduct</h2><ul><li>No harassment, hate speech or fraud.</li><li>No asking learners to pay outside Sanaa.</li><li>No uploading content you don't have rights to.</li></ul></section>
      <section><h2>6. Liability</h2><p>Courses teach practical skills; take care with tools, heat and chemicals. Sanaa is not liable for injuries or losses from applying what you learn.</p></section>
    </ProsePage>
  );
}
