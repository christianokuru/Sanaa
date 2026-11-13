import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import type { Course } from "@/lib/catalog/types";
import { formatDuration } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function LessonList({ course, currentId, completed, canOpen }: { course: Course; currentId: string; completed: Set<string>; canOpen: (lessonId: string, preview: boolean) => boolean }) {
  let n = 0;
  return (
    <nav aria-label="Lessons" className="space-y-6">
      {course.sections.map((section) => (
        <div key={section.id}>
          <h3 className="px-5 text-caption font-semibold uppercase tracking-wider text-ink-soft md:px-3">{section.title}</h3>
          <ol className="mt-2">
            {section.lessons.map((lesson) => {
              n += 1;
              const open = canOpen(lesson.id, lesson.preview);
              const active = lesson.id === currentId;
              const done = completed.has(lesson.id);
              const content = (
                <>
                  <span className="mt-0.5 shrink-0">
                    {done ? <CheckCircle2 className="h-5 w-5 text-malachite" /> : open ? <PlayCircle className={cn("h-5 w-5", active ? "text-ember" : "text-ink-soft")} /> : <Lock className="h-4 w-4 text-ink-mute" />}
                  </span>
                  <span className="flex-1">
                    <span className={cn("block text-body", active && "font-semibold")}>{n}. {lesson.title}</span>
                    <span className="block text-caption text-ink-soft">{formatDuration(lesson.durationSec)}{lesson.preview && !done ? " · Free preview" : ""}</span>
                  </span>
                </>
              );
              return (
                <li key={lesson.id}>
                  {open ? (
                    <Link href={`/learn/${course.slug}?lesson=${lesson.id}`} replace scroll={false} aria-current={active ? "true" : undefined} className={cn("flex gap-3 px-5 py-3 transition md:rounded-xl md:px-3", active ? "bg-ember-tint" : "hover:bg-canvas")}>
                      {content}
                    </Link>
                  ) : (
                    <div className="flex gap-3 px-5 py-3 text-ink-soft md:px-3" aria-disabled="true">{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </nav>
  );
}
