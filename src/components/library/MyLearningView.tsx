"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { LearningCard } from "@/components/library/LearningCard";
import { getCourseById } from "@/lib/catalog/repository";
import { useMyEnrollments } from "@/lib/hooks/use-store";
import { cn } from "@/lib/utils/cn";

type Tab = "all" | "progress" | "done";

export function MyLearningView() {
  const enrollments = useMyEnrollments();
  const [tab, setTab] = useState<Tab>("all");
  const items = enrollments
    .map((e) => ({ enrollment: e, course: getCourseById(e.courseId) }))
    .filter((x) => x.course)
    .filter((x) => (tab === "all" ? true : tab === "done" ? x.enrollment.completedAt : !x.enrollment.completedAt));

  return (
    <>
      <PageHeader title="My learning" subtitle="Pick up where you left off" />
      {enrollments.length === 0 ? (
        <EmptyState icon={PlayCircle} title="No courses yet" action={<Button href="/courses" variant="dark">Find a course</Button>}>
          When you buy or enroll in a course, it shows up here so you can learn at your own pace.
        </EmptyState>
      ) : (
        <>
          <div role="tablist" aria-label="Filter courses" className="mt-6 flex gap-6 border-b border-line">
            {([["all", "All courses"], ["progress", "In progress"], ["done", "Completed"]] as const).map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={cn("-mb-px border-b-2 pb-3 text-body font-semibold transition", tab === value ? "border-ink text-ink" : "border-transparent text-ink-soft hover:text-ink")}
              >
                {label}
              </button>
            ))}
          </div>
          {items.length === 0 ? (
            <p className="py-12 text-ui text-ink-soft">{tab === "done" ? "Finish all lessons in a course to see it here." : "Nothing here yet."}</p>
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map(({ enrollment, course }) => (
                <li key={enrollment.id}><LearningCard course={course!} enrollment={enrollment} /></li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
