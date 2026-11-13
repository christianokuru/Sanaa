import Link from "next/link";
import { ChevronDown, Lock, PlayCircle } from "lucide-react";
import type { Course } from "@/lib/catalog/types";
import { formatDuration } from "@/lib/utils/format";

export function Curriculum({ course }: { course: Course }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
      {course.sections.map((section, i) => {
        const total = section.lessons.reduce((s, l) => s + l.durationSec, 0);
        return (
          <details key={section.id} open={i === 0} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-canvas px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-ui font-semibold">{section.title}</span>
                <span className="text-caption text-ink-soft">{section.lessons.length} lessons · {formatDuration(total)}</span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
            </summary>
            <ul>
              {section.lessons.map((lesson) => (
                <li key={lesson.id} className="flex min-h-[52px] items-center gap-3 px-5 py-2.5">
                  {lesson.preview ? <PlayCircle className="h-5 w-5 shrink-0 text-ink" /> : <Lock className="h-4 w-4 shrink-0 text-ink-mute" />}
                  <span className="flex-1 text-body">{lesson.title}</span>
                  {lesson.preview && (
                    <Link href={`/learn/${course.slug}?lesson=${lesson.id}`} prefetch={false} className="text-body font-semibold underline underline-offset-4">Preview</Link>
                  )}
                  <span className="w-14 text-right text-caption text-ink-soft">{formatDuration(lesson.durationSec)}</span>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
