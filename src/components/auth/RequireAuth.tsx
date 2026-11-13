"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCurrentUser, useHydrated } from "@/lib/hooks/use-store";
import type { PublicUser } from "@/lib/store/schema";

type Role = PublicUser["role"];

/**
 * Client-side page guard: sends visitors to log in and keeps out the wrong roles.
 * It shapes the experience only. Real access control belongs on the server.
 */
export function RequireAuth({ roles, children }: { roles?: Role[]; children: React.ReactNode }) {
  const user = useCurrentUser();
  const hydrated = useHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const allowed = user && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      const next = `${pathname}${params.size ? `?${params.toString()}` : ""}`;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    } else if (!allowed) {
      router.replace(user.role === "student" && roles?.includes("teacher") ? "/teach" : "/account");
    }
  }, [hydrated, user, allowed, pathname, params, router, roles]);

  if (!hydrated || !allowed) {
    return (
      <Container className="pt-10" >
        <div aria-busy="true" aria-label="Loading">
          <Skeleton className="h-10 w-56 rounded-lg" />
          <Skeleton className="mt-6 h-40 w-full" />
          <Skeleton className="mt-4 h-40 w-full" />
        </div>
      </Container>
    );
  }
  return <>{children}</>;
}

/** For components rendered inside <RequireAuth>: the user is guaranteed to exist. */
export function useRequiredUser(): PublicUser {
  const user = useCurrentUser();
  if (!user) throw new Error("useRequiredUser must be used inside <RequireAuth>");
  return user;
}
