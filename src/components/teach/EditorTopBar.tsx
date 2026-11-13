import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function EditorTopBar({ title, back = "/teach/dashboard" }: { title: string; back?: string }) {
  return (
    <div className="flex items-center gap-2 py-4 md:py-8">
      <Link href={back} aria-label="Back to dashboard" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-canvas">
        <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
      </Link>
      <h1 className="truncate text-[1.5rem] font-bold tracking-[-0.03em] md:text-[2rem]">{title}</h1>
    </div>
  );
}
