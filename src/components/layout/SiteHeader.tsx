import { Suspense } from "react";
import Link from "next/link";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { CountryButton } from "@/components/locale/CountryPicker";
import { DesktopSearch } from "@/components/search/DesktopSearch";
import { MobileSearch } from "@/components/search/MobileSearch";

export function SiteHeader() {
  return (
    <HeaderShell>
      {/* Phones: brand mark, search capsule, country */}
      <Container className="flex items-center gap-3 py-3 md:hidden">
        <Link href="/" aria-label="Sanaa home" className="shrink-0">
          <LogoMark className="h-9 w-9" />
        </Link>
        <div className="min-w-0 flex-1">
          <MobileSearch />
        </div>
        <CountryButton variant="round" />
      </Container>

      {/* Tablet and desktop: one search capsule, inline on desktop and on its own row on tablet */}
      <Container className="hidden flex-wrap items-center gap-x-6 py-3 md:flex lg:h-20 lg:flex-nowrap lg:py-0">
        <div className="flex h-14 flex-1 items-center lg:h-auto">
          <Logo />
        </div>
        <nav aria-label="Account" className="flex flex-1 items-center justify-end gap-1 lg:order-3">
          <Link href="/teach" className="hidden h-10 items-center whitespace-nowrap rounded-full px-4 text-body font-semibold hover:bg-canvas xl:inline-flex">
            Teach on Sanaa
          </Link>
          <CountryButton />
          <UserMenu />
        </nav>
        <div className="order-last mt-1 basis-full lg:order-2 lg:mt-0 lg:basis-auto lg:flex-[2.4]">
          <Suspense fallback={<div className="mx-auto h-16 max-w-[850px] rounded-full border border-line shadow-pill" />}>
            <DesktopSearch />
          </Suspense>
        </div>
      </Container>
    </HeaderShell>
  );
}
