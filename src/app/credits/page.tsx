import { ProsePage } from "@/components/content/Prose";
import { getAllCourses } from "@/lib/catalog/repository";

export const metadata = {
  title: "Photo credits",
  description: "The photographers whose openly licensed work appears on Sanaa.",
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  const credited = getAllCourses().filter((c) => c.cover);
  return (
    <ProsePage eyebrow="Thank you" title="Photo credits" intro="Course photos on Sanaa are openly licensed work by these photographers. Each will be replaced by the teacher's own photos as courses go live.">
      <section>
        <ul>
          {credited.map(({ id, title, cover }) => (
            <li key={id}>
              <strong>{title}:</strong> photo by{" "}
              <a href={cover!.credit.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">{cover!.credit.creator}</a>,{" "}
              <a href={cover!.credit.licenseUrl} target="_blank" rel="noopener noreferrer nofollow">{cover!.credit.license}</a>
            </li>
          ))}
        </ul>
      </section>
    </ProsePage>
  );
}
