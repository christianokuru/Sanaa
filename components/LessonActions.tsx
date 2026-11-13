"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { markLessonComplete } from "@/lib/actions/learning";

export function LessonPlayer({
  src, watermark, lessonId, courseSlug, canTrack, done, nextHref,
}: {
  src: string | null;
  watermark: string;
  lessonId: string;
  courseSlug: string;
  canTrack: boolean;
  done: boolean;
  nextHref: string | null;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const complete = (goNext: boolean) =>
    start(async () => {
      if (canTrack && !done) await markLessonComplete(lessonId, courseSlug);
      if (goNext && nextHref) router.push(nextHref);
      else router.refresh();
    });

  return (
    <div>
      {src ? (
        <VideoPlayer key={lessonId} src={src} watermark={watermark} onEnded={() => complete(false)} />
      ) : (
        <div className="flex aspect-video items-center justify-center bg-earth text-cream/70">Video is still processing. Check back soon.</div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {canTrack && (
          <button onClick={() => complete(false)} disabled={pending || done} className={done ? "btn bg-forest-light text-forest" : "btn-outline"}>
            {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            {done ? "Completed" : "Mark as complete"}
          </button>
        )}
        {nextHref && (
          <button onClick={() => complete(true)} disabled={pending} className="btn-primary">
            Next lesson
          </button>
        )}
      </div>
    </div>
  );
}
