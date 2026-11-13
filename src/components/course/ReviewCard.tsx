import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { findCountry } from "@/lib/locale/countries";
import { formatDate } from "@/lib/utils/format";

export function ReviewCard({ author, country, rating, body, createdAt, mine }: { author: string; country: string; rating: number; body: string; createdAt: string; mine?: boolean }) {
  return (
    <article>
      <header className="flex items-center gap-3">
        <Avatar name={author} />
        <div>
          <p className="text-ui font-semibold">{author}{mine && <span className="ml-2 text-caption font-medium text-ink-soft">(you)</span>}</p>
          <p className="text-caption text-ink-soft">{findCountry(country)?.name}</p>
        </div>
      </header>
      <p className="mt-3 flex items-center gap-2 text-caption">
        <span className="flex" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-ink text-ink" : "text-line-strong"}`} aria-hidden />)}
        </span>
        <span className="font-semibold">· {formatDate(createdAt, { month: "long", year: "numeric" })}</span>
      </p>
      <p className="mt-2 text-ui leading-relaxed">{body}</p>
    </article>
  );
}
