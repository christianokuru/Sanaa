import Link from "next/link";
import { CATEGORIES } from "@/config/categories";
import { Container } from "@/components/ui/Container";
import { CountryButton } from "@/components/locale/CountryPicker";

const COLUMNS = [
  { title: "Learn", links: CATEGORIES.map((c) => ({ href: `/categories/${c.slug}`, label: c.name })) },
  {
    title: "Teach",
    links: [
      { href: "/teach", label: "Teach on Sanaa" },
      { href: "/teach/guide", label: "Filming guide" },
      { href: "/teach/dashboard", label: "Teacher dashboard" },
      { href: "/help#payouts", label: "How payouts work" },
    ],
  },
  {
    title: "Sanaa",
    links: [
      { href: "/about", label: "About us" },
      { href: "/help", label: "Help Centre" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/credits", label: "Photo credits" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-canvas">
      <Container className="grid gap-8 py-12 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-body font-semibold">{col.title}</h2>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} prefetch={false} className="text-body text-ink hover:underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="flex flex-col-reverse gap-4 border-t border-line py-6 text-body md:flex-row md:items-center md:justify-between">
        <p className="text-ink-soft">© {new Date().getFullYear()} Sanaa · Made in Africa, for the world</p>
        <CountryButton variant="text" className="self-start md:self-auto" />
      </Container>
    </footer>
  );
}
