"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CourseCover } from "@/components/course/CourseCover";
import { getCategory } from "@/config/categories";
import { formatPrice } from "@/lib/locale/currency";
import { useAppStore } from "@/lib/store/app-store";
import { reviewDraft } from "@/lib/services/admin";
import { toast } from "@/lib/services/toast";
import { formatDuration } from "@/lib/utils/format";

/** Courses waiting for approval, with approve / request-changes actions. */
export function ReviewQueue({ adminId }: { adminId: string }) {
  const pending = useAppStore(useShallow((s) => s.drafts.filter((d) => d.status === "pending")));
  const users = useAppStore((s) => s.users);
  const [reasons, setReasons] = useState<Record<string, string>>({});

  if (pending.length === 0) {
    return <p className="rounded-card bg-canvas p-8 text-ui text-ink-soft">No courses waiting for review.</p>;
  }

  return (
    <ul className="space-y-4">
      {pending.map((d) => (
        <li key={d.id} className="rounded-card border border-line p-5">
          <div className="flex gap-4">
            <div className="w-24 shrink-0"><CourseCover id={d.id} category={d.category} /></div>
            <div className="min-w-0 flex-1">
              <Badge tone="saffron">In review</Badge>
              <p className="mt-2 text-title font-semibold">{d.title}</p>
              <p className="text-body text-ink-soft">
                {users.find((u) => u.id === d.ownerId)?.name} · {getCategory(d.category)?.name} · {formatPrice(d.price, d.currency)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-body">{d.subtitle}</p>
          <details className="mt-3 text-body">
            <summary className="cursor-pointer font-semibold">{d.lessons.length} lessons</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">
              {d.lessons.map((l) => <li key={l.id}>{l.title} · {formatDuration(l.durationSec)}</li>)}
            </ol>
          </details>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button size="sm" className="bg-malachite hover:bg-malachite/90" onClick={() => { reviewDraft(adminId, d.id, true); toast("Course approved and live", { tone: "success" }); }}>
              <Check className="h-4 w-4" /> Approve
            </Button>
            <input
              value={reasons[d.id] ?? ""}
              onChange={(e) => setReasons({ ...reasons, [d.id]: e.target.value })}
              placeholder="What should the teacher fix?"
              aria-label="Reason for changes"
              maxLength={500}
              className="h-9 flex-1 rounded-lg border border-line-strong px-3 text-body focus:border-ink focus:outline-none"
            />
            <Button size="sm" variant="outline" onClick={() => { reviewDraft(adminId, d.id, false, reasons[d.id]); toast("Sent back to the teacher"); }}>
              <X className="h-4 w-4" /> Request changes
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
