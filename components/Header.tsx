import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CountryPicker } from "@/components/CountryPicker";
import { getViewerCountry } from "@/lib/geo";
import { getSessionUser } from "@/lib/auth";

export async function Header() {
  const country = getViewerCountry();
  const user = await getSessionUser();
  return (
    <header className="sticky top-0 z-40 border-b border-earth/10 bg-cream/95 backdrop-blur">
      <div className="kente h-1.5 w-full" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex" aria-label="Main menu">
          <Link href="/courses" className="hover:text-terracotta">Browse</Link>
          <Link href="/my-learning" className="hover:text-terracotta">My learning</Link>
          <Link href="/teach" className="hover:text-terracotta">Teach on Sanaa</Link>
          {user?.profile.role === "admin" && <Link href="/admin" className="hover:text-terracotta">Admin</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <CountryPicker current={country} />
          {user ? (
            <Link
              href="/account"
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-forest font-bold text-white md:flex"
              aria-label="Your account"
            >
              {(user.profile.full_name || user.email).charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link href="/login" className="hidden text-sm font-semibold md:block">Log in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
