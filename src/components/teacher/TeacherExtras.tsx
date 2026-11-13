"use client";

import Link from "next/link";
import { AtSign, Facebook, Instagram, Quote, Youtube } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SOCIALS } from "@/config/socials";
import { useTeacherBio, useTeacherProfile } from "@/lib/hooks/use-store";
import { SOCIAL_PLATFORMS, type SocialPlatform, type Testimonial } from "@/lib/store/schema";
import { cn } from "@/lib/utils/cn";

/**
 * The parts of a teacher's public profile that the teacher edits: photo, bio, social
 * handles and reviews from past clients. They fill in after the page loads.
 */

const ICONS: Partial<Record<SocialPlatform, typeof Instagram>> = { instagram: Instagram, youtube: Youtube, facebook: Facebook };

export function TeacherAvatar({ teacherId, name, size, className }: { teacherId: string; name: string; size?: React.ComponentProps<typeof Avatar>["size"]; className?: string }) {
  const profile = useTeacherProfile(teacherId);
  return <Avatar name={name} photo={profile?.photo} size={size} className={className} />;
}

export function TeacherBio({ teacherId, fallback, className }: { teacherId: string; fallback: string; className?: string }) {
  const bio = useTeacherBio(teacherId);
  return <p className={cn("whitespace-pre-line", className)}>{bio ?? fallback}</p>;
}

export function SocialLinks({ socials, className }: { socials: Partial<Record<SocialPlatform, string>>; className?: string }) {
  const list = SOCIAL_PLATFORMS.filter((p) => socials[p]);
  if (list.length === 0) return null;
  return (
    <ul aria-label="Social media" className={cn("flex flex-wrap gap-2", className)}>
      {list.map((p) => {
        const Icon = ICONS[p] ?? AtSign;
        const handle = socials[p]!;
        return (
          <li key={p}>
            <a
              href={SOCIALS[p].url(handle)}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 text-body font-medium transition hover:border-ink"
            >
              <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
              <span className="sr-only">{SOCIALS[p].label}: </span>
              <span aria-hidden className="text-ink-soft">{p === "instagram" || p === "x" || p === "tiktok" ? `@${handle}` : SOCIALS[p].label}</span>
              <span className="sr-only">@{handle} (opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function TeacherSocials({ teacherId, className }: { teacherId: string; className?: string }) {
  const profile = useTeacherProfile(teacherId);
  return profile ? <SocialLinks socials={profile.socials} className={className} /> : null;
}

export function TestimonialCard({ t, children }: { t: Testimonial; children?: React.ReactNode }) {
  return (
    <figure className="relative flex h-full flex-col rounded-card bg-canvas p-5">
      <Quote className="h-5 w-5 text-ember" aria-hidden />
      <blockquote className="mt-3 flex-1 whitespace-pre-line text-ui leading-relaxed">{t.body}</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <Avatar name={t.author} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body font-semibold">{t.author}</span>
          {t.context && <span className="block truncate text-caption text-ink-soft">{t.context}</span>}
        </span>
        {children}
      </figcaption>
    </figure>
  );
}

/** Reviews the teacher collected outside Sanaa. Clearly marked as shared by the teacher. */
export function TeacherTestimonials({
  teacherId, firstName, limit, moreHref, large = false,
}: { teacherId: string; firstName: string; limit?: number; moreHref?: string; /** Page-level section instead of a sub-section. */ large?: boolean }) {
  const profile = useTeacherProfile(teacherId);
  const all = profile?.testimonials ?? [];
  if (all.length === 0) return null;
  const shown = limit ? all.slice(0, limit) : all;
  const Heading = large ? "h2" : "h3";
  return (
    <section aria-labelledby={`clients-${teacherId}`} className={large ? "mt-14" : "mt-10"}>
      <Heading id={`clients-${teacherId}`} className={large ? "text-section font-semibold" : "text-title font-semibold"}>What {firstName}&rsquo;s clients say</Heading>
      <p className="mt-1 text-caption text-ink-soft">Shared by {firstName} from work outside Sanaa. These are not checked by Sanaa.</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {shown.map((t) => (
          <li key={t.id}><TestimonialCard t={t} /></li>
        ))}
      </ul>
      {moreHref && all.length > shown.length && (
        <Link href={moreHref} className="mt-4 inline-block text-body font-semibold underline underline-offset-4">
          See all {all.length} client reviews
        </Link>
      )}
    </section>
  );
}
